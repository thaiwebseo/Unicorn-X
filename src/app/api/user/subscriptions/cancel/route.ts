import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path if needed, e.g. '@/app/api/auth/[...nextauth]/route' or wherever authOptions is
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { subscriptionId } = await req.json();

        if (!subscriptionId) {
            return new NextResponse('Subscription ID is required', { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const sub = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { plan: true }
        });

        if (!sub || sub.userId !== user.id) {
            return new NextResponse('Subscription not found', { status: 404 });
        }

        if (sub.status !== 'ACTIVE') {
            return new NextResponse('Subscription is not active', { status: 400 });
        }

        // Retrieve Stripe Subscription ID via Session
        if (!sub.stripeSessionId) {
            return new NextResponse('Stripe Session ID not found', { status: 500 });
        }

        // If it starts with 'sub_', it might be a direct migration or manually set (less likely with current flows but good for safety)
        // Checks if stripeSessionId is actually a subscription id (unlikely given naming)
        // But our webhook stores session.id which starts with 'cs_'

        let stripeSubscriptionId: string | null = null;

        if (sub.stripeSessionId.startsWith('cs_')) {
            const checkoutSession = await stripe.checkout.sessions.retrieve(sub.stripeSessionId);
            if (typeof checkoutSession.subscription === 'string') {
                stripeSubscriptionId = checkoutSession.subscription;
            } else if (checkoutSession.subscription && typeof checkoutSession.subscription === 'object') {
                stripeSubscriptionId = checkoutSession.subscription.id;
            }
        }

        // Fallback for migrated data or other cases if we ever stored sub id in that field
        if (!stripeSubscriptionId && sub.stripeSessionId.startsWith('sub_')) {
            stripeSubscriptionId = sub.stripeSessionId;
        }

        if (!stripeSubscriptionId) {
            return new NextResponse('Could not resolve Stripe Subscription ID', { status: 500 });
        }

        // Cancel at period end
        await stripe.subscriptions.update(stripeSubscriptionId, {
            cancel_at_period_end: true
        });

        // Update local DB to CANCELLED 
        // Note: The user will still have access until endDate because we don't change endDate here
        // We relying on the backend logic to allow access if currentDate <= endDate
        await prisma.subscription.update({
            where: { id: subscriptionId },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
