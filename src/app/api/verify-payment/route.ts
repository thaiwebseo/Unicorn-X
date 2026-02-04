import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { BotStatus } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return new NextResponse('Missing session ID', { status: 400 });
        }

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Check if this session was already processed
        const existingSubscription = await prisma.subscription.findUnique({
            where: { stripeSessionId: sessionId }
        });

        if (existingSubscription) {
            // Already processed, find the bot created for this user
            let existingBot = await prisma.bot.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });

            // If bot was deleted (e.g., due to enum migration), create a new one
            if (!existingBot) {
                // Get plan name from Stripe session
                const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
                const planName = checkoutSession.metadata?.planName || 'Trading Bot';

                existingBot = await prisma.bot.create({
                    data: {
                        userId: user.id,
                        name: planName,
                        apiKey: '',
                        secretKey: '',
                        status: BotStatus.WAITING_FOR_SETUP
                    }
                });
                console.log(`✅ Created replacement bot ${existingBot.id} for user ${user.id}`);
            }

            return NextResponse.json({
                message: 'Session already processed',
                subscriptionId: existingSubscription.id,
                botId: existingBot.id
            });
        }

        // Retrieve the checkout session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (checkoutSession.payment_status !== 'paid') {
            return new NextResponse('Payment not completed', { status: 400 });
        }

        const planId = checkoutSession.metadata?.planId || 'monthly';
        const planName = checkoutSession.metadata?.planName || 'Subscription';
        const planType = checkoutSession.metadata?.planType || 'monthly';

        // Determine duration based on planType
        let durationMonths = 1;
        if (planType === 'yearly') {
            durationMonths = 12;
        } else if (planType === 'onetime') {
            durationMonths = 1200; // Lifetime (~100 years)
        }

        // Find or create a Plan record (Plan logic remains same, ensuring we have a plan object)
        let plan = await prisma.plan.findFirst({
            where: { name: { contains: planId } } // Fallback lookup if exact name failed previously, but we want exact name if possible
        });

        // Use the exact Plan Name Strategy if possible
        let exactPlan = await prisma.plan.findFirst({ where: { name: planName } });
        if (exactPlan) plan = exactPlan;

        if (!plan) {
            // Fallback search
            plan = await prisma.plan.findFirst({
                where: { name: { contains: planId } }
            });
        }

        if (!plan) {
            // Create a default plan if none exists
            const amount = (checkoutSession.amount_total || 0) / 100;
            plan = await prisma.plan.create({
                data: {
                    name: planName || 'Trading Bot Plan',
                    category: planName.split('-')[0]?.trim() || 'Trading Bot',
                    tier: planName.split('-')[1]?.trim() || 'Standard',
                    priceMonthly: planType === 'yearly' ? amount / 12 : amount,
                    priceYearly: planType === 'yearly' ? amount : amount * 12,
                    features: ['Trading Bot Access', 'Unlimited Trades', '24/7 Support'],
                    isActive: true
                }
            });
            console.log(`✅ Auto-created Plan: ${plan.name}`);
        }

        // CHECK FOR RENEWAL: Find existing subscription for this user and plan
        const existingSubscriptionForPlan = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                planId: plan.id
            },
            orderBy: { endDate: 'desc' }
        });

        let subscription: any;
        let bot: any = null;

        if (existingSubscriptionForPlan) {
            // --- RENEWAL LOGIC ---
            console.log(`🔄 Processing Renewal for User ${user.id}, Plan ${plan.name}`);

            const now = new Date();
            const currentEndDate = new Date(existingSubscriptionForPlan.endDate);
            const isExpired = currentEndDate < now;

            // Calculate new End Date
            // If not expired, add to current end date. If expired, start from now.
            const newEndDate = new Date(isExpired ? now : currentEndDate);
            newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

            // Update existing subscription
            subscription = await prisma.subscription.update({
                where: { id: existingSubscriptionForPlan.id },
                data: {
                    status: 'ACTIVE',
                    endDate: newEndDate,
                    stripeSessionId: sessionId // Update to track this most recent payment
                }
            });

            // Handle Bot for Renewal (Reuse existing or provision missing)
            const botsToCreate = plan.includedBots.length > 0 ? plan.includedBots : [plan.name];
            let lastProcessedBot = null;

            for (const botName of botsToCreate) {
                let existingBot = await prisma.bot.findFirst({
                    where: { userId: user.id, name: botName }
                });

                if (!existingBot) {
                    existingBot = await prisma.bot.create({
                        data: {
                            userId: user.id,
                            name: botName,
                            apiKey: '',
                            secretKey: '',
                            status: BotStatus.WAITING_FOR_SETUP
                        }
                    });
                    console.log(`🤖 Provisioned missing bot '${botName}' for user ${user.id} during renewal`);
                }
                lastProcessedBot = existingBot;
            }
            bot = lastProcessedBot;

        } else {
            // --- NEW SUBSCRIPTION LOGIC ---
            console.log(`✨ Processing New Subscription for User ${user.id}, Plan ${plan.name}`);

            const startDate = new Date();
            let endDate = new Date();

            const isTrial = checkoutSession.metadata?.isTrial === 'true';

            if (isTrial) {
                endDate.setDate(endDate.getDate() + 7); // 7-Day Trial

                // Record that user has used this trial
                const category = checkoutSession.metadata?.category;
                if (category) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            trialUsedCategories: { push: category }
                        } as any // Cast to any to bypass outdated generated client
                    });
                }
            } else {
                endDate.setMonth(endDate.getMonth() + durationMonths);
            }

            subscription = await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    isTrial,
                    status: 'ACTIVE',
                    startDate,
                    endDate,
                    stripeSessionId: sessionId
                } as any
            });

            // Create Bots for the user (Support Bundles)
            const botsToCreate = plan.includedBots.length > 0 ? plan.includedBots : [planName || 'Trading Bot'];
            let lastProcessedBot = null;

            for (const botName of botsToCreate) {
                const finalBotName = isTrial ? `${botName} (Trial)` : botName;
                const newBot = await prisma.bot.create({
                    data: {
                        userId: user.id,
                        name: finalBotName,
                        apiKey: '',
                        secretKey: '',
                        status: BotStatus.WAITING_FOR_SETUP
                    }
                });
                console.log(`🤖 Provisioned bot '${finalBotName}' for user ${user.id}`);
                lastProcessedBot = newBot;
            }
            bot = lastProcessedBot;
        }

        // Create Order record (Always create a record of payment)
        await prisma.order.create({
            data: {
                userId: user.id,
                amount: (checkoutSession.amount_total || 0) / 100,
                planName,
                paymentMethod: checkoutSession.payment_method_types?.[0] || 'card',
                stripeSessionId: sessionId,
                status: 'PAID'
            }
        });

        console.log(`✅ Subscription ${subscription.id} process complete. Renewal: ${!!existingSubscriptionForPlan}`);

        return NextResponse.json({
            message: 'Payment processed successfully',
            subscriptionId: subscription.id,
            botId: bot.id
        });

    } catch (error: any) {
        console.error('[VERIFY_PAYMENT_ERROR]', error);
        return new NextResponse(error?.message || 'Internal Error', { status: 500 });
    }
}
