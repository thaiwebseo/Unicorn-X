import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { BotStatus } from '@prisma/client';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`🔔 Webhook: checkout.session.completed [${session.id}]`);
            await handlePaymentSuccess(session);
            break;
        }
        case 'invoice.paid': {
            const invoice = event.data.object as any;
            // Only process if it's a subscription invoice (recurring)
            if (invoice.subscription) {
                console.log(`🔔 Webhook: invoice.paid [${invoice.id}]`);
                await handleRecurringPayment(invoice);
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`🔔 Webhook: customer.subscription.deleted [${subscription.id}]`);
            await handleSubscriptionDeleted(subscription);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// SHARED LOGIC: Handle Payment (Initial or Renewal)
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName || 'Trading Bot';
    const planType = session.metadata?.planType || 'monthly';
    const sessionId = session.id;

    if (!userId) return;

    // 1. Double check if already processed (Idempotency)
    const existingSub = await prisma.subscription.findUnique({
        where: { stripeSessionId: sessionId }
    });
    if (existingSub) {
        console.log(`⏩ Session ${sessionId} already processed, skipping.`);
        return;
    }

    // 2. Process logic (Replicate verify-payment logic but for automated context)
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        // Find or create Plan
        let plan = await prisma.plan.findFirst({ where: { name: planName } });
        if (!plan) {
            // Re-use logic to create plan if it doesn't exist
            const amount = (session.amount_total || 0) / 100;
            plan = await prisma.plan.create({
                data: {
                    name: planName,
                    category: planName.split('-')[0]?.trim() || 'Bot',
                    tier: planName.split('-')[1]?.trim() || 'Starter',
                    priceMonthly: planType === 'yearly' ? amount / 12 : amount,
                    priceYearly: planType === 'yearly' ? amount : amount * 12,
                    features: ['Automated Trading'],
                    isActive: true
                }
            });
        }

        const durationMonths = planType === 'yearly' ? 12 : 1;

        // Find existing subscription for renewal
        const existingSubForPlan = await prisma.subscription.findFirst({
            where: { userId: user.id, planId: plan.id },
            orderBy: { endDate: 'desc' }
        });

        const isTrial = session.metadata?.isTrial === 'true';

        if (existingSubForPlan) {
            // RENEWAL
            const now = new Date();
            const currentEndDate = new Date(existingSubForPlan.endDate);
            const isExpired = currentEndDate < now;
            const newEndDate = new Date(isExpired ? now : currentEndDate);
            newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

            await prisma.subscription.update({
                where: { id: existingSubForPlan.id },
                data: {
                    status: 'ACTIVE',
                    endDate: newEndDate,
                    stripeSessionId: sessionId,
                    isTrial: false // Renewal is never a trial
                }
            });
        } else {
            // NEW SUBSCRIPTION
            let endDate = new Date();

            if (isTrial) {
                // FIXED: Trial is exactly 7 days
                endDate.setDate(endDate.getDate() + 7);
            } else {
                // Normal Plan
                endDate.setMonth(endDate.getMonth() + durationMonths);
            }

            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate,
                    stripeSessionId: sessionId,
                    isTrial: isTrial
                }
            });

            // Ensure Bots exist (Support Bundles)
            const botsToCreate = plan.includedBots.length > 0 ? plan.includedBots : [plan.name];

            for (const botName of botsToCreate) {
                const existingBot = await prisma.bot.findFirst({ where: { userId: user.id, name: botName } });
                if (!existingBot) {
                    await prisma.bot.create({
                        data: {
                            userId: user.id,
                            name: botName,
                            apiKey: '',
                            secretKey: '',
                            status: BotStatus.WAITING_FOR_SETUP
                        }
                    });
                    console.log(`🤖 Provisioned bot '${botName}' for user ${user.id}`);
                }
            }
        }

        // Always create Order
        await prisma.order.create({
            data: {
                userId: user.id,
                amount: (session.amount_total || 0) / 100,
                planName,
                paymentMethod: session.payment_method_types?.[0] || 'card',
                stripeSessionId: sessionId,
                status: 'PAID'
            }
        });

        console.log(`✅ Webhook processed initial checkout for user ${userId}`);

        // 3. Handle Coupon Usage (Post-payment)
        const couponCode = session.metadata?.couponCode;
        if (couponCode) {
            try {
                const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
                if (coupon) {
                    await prisma.coupon.update({
                        where: { id: coupon.id },
                        data: { usageCount: { increment: 1 } }
                    });

                    await prisma.couponUsage.create({
                        data: {
                            couponId: coupon.id,
                            userId: userId
                        }
                    });
                    console.log(`🎟️ Recorded usage for coupon ${couponCode} by user ${userId}`);
                }
            } catch (err) {
                console.error(`Failed to record coupon usage for ${couponCode}:`, err);
            }
        }
    } catch (e) {
        console.error('Webhook processing error:', e);
    }
}

// HANDLE RECURRING RENEWALS (invoice.paid)
async function handleRecurringPayment(invoice: any) {
    const subscriptionId = invoice.subscription as string;
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    // We get metadata from the subscription, which was passed from checkout
    const userId = stripeSubscription.metadata?.userId;
    const planName = stripeSubscription.metadata?.planName || 'Renewal Subscription';
    const planType = stripeSubscription.metadata?.planType || 'monthly';

    if (!userId) return;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        // Find the subscription in our DB by matching userId and plan name
        // (Since stripeSessionId changes per payment, we look up by user and plan)
        const dbSub = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                plan: { name: planName }
            },
            include: { plan: true }
        });

        if (dbSub) {
            const durationMonths = planType === 'yearly' ? 12 : 1;
            const currentEndDate = new Date(dbSub.endDate);
            const now = new Date();

            // Extend end date
            const newEndDate = new Date(currentEndDate < now ? now : currentEndDate);
            newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

            await prisma.subscription.update({
                where: { id: dbSub.id },
                data: {
                    status: 'ACTIVE',
                    endDate: newEndDate,
                    updatedAt: new Date()
                }
            });

            // Create Order record for history
            await prisma.order.create({
                data: {
                    userId: user.id,
                    amount: (invoice.amount_paid || 0) / 100,
                    planName,
                    paymentMethod: 'card', // Recurring is usually card
                    stripeSessionId: `auto-${invoice.id}`, // Mark as auto-renewal
                    status: 'PAID'
                }
            });

            console.log(`♻️ Webhook processed recurring renewal for user ${userId}, new end date: ${newEndDate}`);
        }
    } catch (e) {
        console.error('Recurring webhook error:', e);
    }
}

async function handleSubscriptionDeleted(stripeSub: Stripe.Subscription) {
    const userId = stripeSub.metadata?.userId;
    if (!userId) return;

    try {
        // Mark matchng subscription as EXPIRED or CANCELLED
        const planName = stripeSub.metadata?.planName;
        const dbSub = await prisma.subscription.findFirst({
            where: { userId, plan: { name: planName } }
        });

        if (dbSub) {
            await prisma.subscription.update({
                where: { id: dbSub.id },
                data: { status: 'EXPIRED' }
            });
            console.log(`⛔ Removed access for user ${userId} due to subscription cancellation`);
        }
    } catch (e) {
        console.error('Cancellation webhook error:', e);
    }
}
