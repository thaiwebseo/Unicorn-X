import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { planId, planName: clientPlanName, type, price, firstName, lastName, isRenewal } = body;

        // Update User Profile if name is provided
        if (firstName && lastName) {
            await prisma.user.update({
                where: { email: session.user.email! },
                data: { name: `${firstName} ${lastName}` }
            });
        }

        if (!planId || price === undefined || price === null) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Security: Fetch plan details from database to verify price
        const plan = await prisma.plan.findUnique({
            where: { id: planId }
        });

        if (!plan) {
            return new NextResponse('Plan not found', { status: 404 });
        }

        if (!plan.isActive) {
            return new NextResponse('This plan is currently not available for purchase.', { status: 403 });
        }

        // Use client-provided planName if available, otherwise fallback to DB name
        let productName = clientPlanName || plan.name;
        let mode: 'subscription' | 'payment' = 'subscription';
        let recurring = undefined;
        let finalPrice = 0;

        switch (type) {
            case 'monthly':
                mode = 'subscription';
                recurring = { interval: 'month' as const };
                finalPrice = plan.priceMonthly;
                break;
            case 'yearly':
                mode = 'subscription';
                recurring = { interval: 'year' as const };
                finalPrice = plan.priceYearly;
                break;
            case 'onetime':
                mode = 'payment';
                finalPrice = price; // Fallback for custom onetime if needed
                break;
        }

        // Convert price to cents
        const unitAmount = Math.round(finalPrice * 100);

        const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
            mode === 'subscription' ? ['card'] : ['card', 'promptpay'];

        // Look up actual user ID from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const successUrl = isRenewal
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment_success=true`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/guided-setup/create-key?session_id={CHECKOUT_SESSION_ID}`;

        // Get Referral ID from body
        const { ref, couponCode } = body;

        // Handle Coupons
        let appliedStripeCoupon = null;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode.toUpperCase() }
            });

            if (coupon && coupon.isActive && coupon.stripeCouponId) {
                // Double check expiry and limit
                const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                const limitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;

                if (!isExpired && !limitReached) {
                    appliedStripeCoupon = coupon.stripeCouponId;
                    // Note: Usage count increment is handled in the Stripe Webhook to prevent counting abandoned checkouts.
                }
            }
        }

        // Check for Trial Eligibility
        const { isTrial } = body;
        if (isTrial) {
            // Check if user has already used trial for this category
            // Check if user has already used ANY free trial
            const trialUsedCategories = (user as any).trialUsedCategories || [];
            if (trialUsedCategories.length > 0) {
                return new NextResponse('You have already used your one-time free trial account quota.', { status: 400 });
            }

            // Enforce Stripe Trial requirements
            // 1. Must use 'subscription' mode
            if (mode !== 'subscription') {
                return new NextResponse('Free trial is only available for subscription plans.', { status: 400 });
            }
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: paymentMethodTypes,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName + (isTrial ? ' (7-Day Free Trial)' : ''),
                        },
                        unit_amount: unitAmount,
                        recurring: recurring,
                    },
                    quantity: 1,
                },
            ],
            discounts: appliedStripeCoupon ? [{ coupon: appliedStripeCoupon }] : undefined,
            mode: mode,
            subscription_data: {
                trial_period_days: isTrial ? 7 : undefined,
                metadata: {
                    userId: user.id,
                    planId: planId,
                    planName: productName,
                    planType: type,
                    isTrial: isTrial ? 'true' : 'false',
                    category: plan.category
                }
            },
            success_url: successUrl,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscription?canceled=true`,
            customer_email: session.user.email!,
            metadata: {
                userId: user.id,
                planId: planId,
                planName: productName,
                planType: type,
                refId: ref || '',
                isTrial: isTrial ? 'true' : 'false',
                category: plan.category,
                couponCode: couponCode || ''
            }
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error('[STRIPE_CHECKOUT_ERROR]', error);
        return new NextResponse(error?.message || 'Internal Error', { status: 500 });
    }
}
