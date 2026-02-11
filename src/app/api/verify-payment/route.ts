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

        // CHECK FOR RENEWAL: Find existing subscription for this user and SAME CATEGORY (allows switching Monthly <-> Yearly)
        const existingSubscriptionForPlan = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                plan: {
                    category: plan.category
                }
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
                    planId: plan.id, // Update plan ID (e.g. switching from Monthly to Yearly)
                    isTrial: false, // Convert to paid if was trial
                    endDate: newEndDate,
                    stripeSessionId: sessionId // Update to track this most recent payment
                } as any
            });

            // Create/Renew Bots for the user (Support Bundles)
            // Hardcoded fallback for bundles if DB is missing includedBots
            let botsToCreate = (plan as any).includedBots || [];
            // Robust Bundle Detection: Check category or if name contains 'bundle'
            const isBundle = plan.category === 'Bundles' || plan.name.toLowerCase().includes('bundle') || plan.category.toLowerCase().includes('bundle');

            if (botsToCreate.length === 0 && isBundle) {
                const tier = plan.tier.toLowerCase();
                if (tier.includes('starter') || plan.name.toLowerCase().includes('starter')) {
                    botsToCreate = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
                } else if (tier.includes('pro') || plan.name.toLowerCase().includes('pro')) {
                    botsToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
                } else if (tier.includes('expert') || plan.name.toLowerCase().includes('expert')) {
                    botsToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro'];
                }
            }
            if (botsToCreate.length === 0) botsToCreate = [plan.name];

            console.log(`📦 Renewal Processing: ${botsToCreate.length} bots for bundle/plan ${plan.name}`);

            const createdBotIds: string[] = [];
            for (const botName of botsToCreate) {
                // 1. Try to find existing trial bot to convert
                const trialBotName = `${botName} (Trial)`;
                const existingTrialBot = await prisma.bot.findFirst({
                    where: {
                        userId: user.id,
                        name: trialBotName
                    }
                });

                if (existingTrialBot) {
                    // Convert trial bot to regular bot
                    const updatedBot = await prisma.bot.update({
                        where: { id: existingTrialBot.id },
                        data: {
                            name: botName // Remove (Trial) suffix
                        }
                    });
                    createdBotIds.push(updatedBot.id);
                    console.log(`🔄 Converted trial bot '${trialBotName}' to paid bot '${botName}'`);
                } else {
                    // 2. Or find existing regular bot
                    const existingBot = await prisma.bot.findFirst({
                        where: {
                            userId: user.id,
                            name: botName
                        }
                    });

                    if (!existingBot) {
                        // 3. Create new bot if doesn't exist
                        const newBot = await prisma.bot.create({
                            data: {
                                userId: user.id,
                                name: botName,
                                apiKey: '',
                                secretKey: '',
                                status: BotStatus.WAITING_FOR_SETUP
                            }
                        });
                        createdBotIds.push(newBot.id);
                        console.log(`🤖 Created new bot '${botName}' during renewal`);
                    } else {
                        createdBotIds.push(existingBot.id);
                    }
                }
            }
            bot = createdBotIds;

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
            // Hardcoded fallback for bundles if DB is missing includedBots
            let botsToCreate = (plan as any).includedBots || [];
            // Robust Bundle Detection
            const isBundle = plan.category === 'Bundles' || plan.name.toLowerCase().includes('bundle') || plan.category.toLowerCase().includes('bundle');

            if (botsToCreate.length === 0 && isBundle) {
                const tier = plan.tier.toLowerCase();
                // Check tier or plan name for bundle type
                if (tier.includes('starter') || plan.name.toLowerCase().includes('starter')) {
                    botsToCreate = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
                } else if (tier.includes('pro') || plan.name.toLowerCase().includes('pro')) {
                    botsToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
                } else if (tier.includes('expert') || plan.name.toLowerCase().includes('expert')) {
                    botsToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro'];
                }
            }
            if (botsToCreate.length === 0) botsToCreate = [planName || 'Trading Bot'];

            // --- OPTION 1: Cancel Overlapping Subscriptions ---
            // If buying a Bundle, check if user has existing active subscriptions for any of these bots
            if (isBundle) {
                const activeSubscriptions = await prisma.subscription.findMany({
                    where: {
                        userId: user.id,
                        status: 'ACTIVE',
                        id: { not: subscription.id }, // Exclude the new subscription we just created
                        plan: {
                            category: { not: 'Bundles' } // Only look for individual bot plans (or different bundles)
                        }
                    },
                    include: { plan: true }
                });

                for (const sub of activeSubscriptions) {
                    // Check if this subscription's plan includes any of the new bots
                    // Note: We check if plan name or category matches any of the new botsToCreate
                    const subPlanName = sub.plan.name;
                    const subCategory = sub.plan.category;

                    // Simple check: Is the plan name or category in our new list?
                    // E.g. Old Plan: "Smart Timer DCA", New Bundle has "Smart Timer DCA - Starter"
                    const isOverlapping = botsToCreate.some((newBotName: string) =>
                        newBotName.includes(subCategory) || newBotName.includes(subPlanName)
                    );

                    if (isOverlapping) {
                        console.log(`⚠️ Canceling overlapping subscription ${sub.id} (${sub.plan.name}) due to Bundle purchase`);
                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: {
                                status: 'CANCELLED',
                                endDate: new Date() // End immediately
                            }
                        });
                    }
                }
            }

            console.log(`📦 New Subscription Processing: ${botsToCreate.length} bots for bundle ${planName}`);

            const createdBotIds: string[] = [];
            for (const botName of botsToCreate) {
                const finalBotName = isTrial ? `${botName} (Trial)` : botName;

                // 1. Try to find existing trial bot to convert (If buying paid version)
                let existingTrialBot = null;
                if (!isTrial) {
                    const trialName = `${botName} (Trial)`;
                    existingTrialBot = await prisma.bot.findFirst({
                        where: { userId: user.id, name: trialName }
                    });
                }

                if (existingTrialBot) {
                    // Convert trial bot to regular bot
                    console.log(`🔄 Converting trial bot '${existingTrialBot.name}' to paid bot '${finalBotName}'`);
                    await prisma.bot.update({
                        where: { id: existingTrialBot.id },
                        data: {
                            name: finalBotName // Remove (Trial) suffix
                        }
                    });
                    createdBotIds.push(existingTrialBot.id);
                } else {
                    // 2. Check if bot with exact name already exists (Duplicate Prevention)
                    const existingBot = await prisma.bot.findFirst({
                        where: { userId: user.id, name: finalBotName }
                    });

                    if (existingBot) {
                        console.log(`♻️  Reusing existing bot '${finalBotName}' for user ${user.id}`);
                        createdBotIds.push(existingBot.id);
                    } else {
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
                        createdBotIds.push(newBot.id);
                    }
                }
            }
            bot = createdBotIds;
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
            botIds: Array.isArray(bot) ? bot : [bot.id]
        });

    } catch (error: any) {
        console.error('[VERIFY_PAYMENT_ERROR]', error);
        return new NextResponse(error?.message || 'Internal Error', { status: 500 });
    }
}
