import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch all bots with user info and subscription status
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const bots = await prisma.bot.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        subscriptions: {
                            where: {
                                status: { in: ['ACTIVE', 'CANCELLED'] } // Get both so we can find expiry for cancelled ones too
                            },
                            include: { plan: true },
                            orderBy: { endDate: 'desc' },
                            // take: 1  <-- REMOVE THIS to get all subs for matching
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Match bots to their correct subscription (Same logic as user/bots/route.ts)
        const botsWithDates = bots.map(bot => {
            const userSubs = bot.user.subscriptions || [];

            // Find best matching subscription
            let bestSub: any = null;

            userSubs.forEach((sub: any) => {
                let targets = sub.plan.includedBots && sub.plan.includedBots.length > 0
                    ? [...sub.plan.includedBots]
                    : [];

                // Fallback for Bundles
                if (targets.length === 0 && sub.plan.category === 'Bundles') {
                    const tier = sub.plan.tier.toLowerCase();
                    if (tier.includes('starter')) {
                        targets = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
                    } else if (tier.includes('pro')) {
                        targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
                    } else if (tier.includes('expert')) {
                        targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro'];
                    }
                }
                if (targets.length === 0) targets = [sub.plan.name];

                // Normalize bot name
                const normalizedBotName = bot.name.replace(/\s\(Trial\)$/, '');

                if (targets.includes(normalizedBotName)) {
                    if (!bestSub) bestSub = sub;
                }
            });

            // Fallback for Trial bots in 'RUNNING' state that might be matched to CANCELLED/EXPIRED subs
            // or if no match found yet.
            if (!bestSub && bot.status === 'RUNNING') {
                // If it's a Trial bot, try to find ANY active subscription that matches the plan name
                // ignoring the specific "Trial" part if needed
                const normalizedName = bot.name.replace(/\s\(Trial\)$/, '');
                bestSub = userSubs.find((s: any) =>
                    s.status === 'ACTIVE' &&
                    (s.plan.name === bot.name || s.plan.name === normalizedName)
                );
            }

            // Determine if we should show dates
            // 1. If ActivatedAt is present, ALWAYS show dates (Time is ticking)
            // 2. If Bot is RUNNING, ALWAYS show dates (Legacy/Trial support where activatedAt might be missing)
            // 3. User requested "This one hasn't set API yet" -> If status is WAITING_FOR_SETUP, maybe hide it?
            //    BUT if the subscription is ticking (activatedAt exists), we MUST show it because it expires.
            //    The user's confusion comes from "Waiting for Setup" + "Dates".
            //    However, from a billing perspective, if they bought it and activated it, it expires.
            //    Let's trust `activatedAt`.

            let startDate = null;
            let endDate = null;

            if (bestSub) {
                if (bestSub.activatedAt) {
                    startDate = bestSub.startDate;
                    endDate = bestSub.endDate;
                } else if (bot.status === 'RUNNING') { // Fallback for running bots without activatedAt
                    startDate = bestSub.startDate;
                    endDate = bestSub.endDate;
                }
            }

            return {
                ...bot,
                startDate,
                endDate,
                sourcePlan: bestSub?.plan?.name || 'Unknown',
                isBundle: bestSub?.plan?.category === 'Bundles' || false
            };
        });

        // 3. Sort Logic to Group Bundles
        // - Sort by User Email (Group users together)
        // - Sort by Source Plan (Group bundles together)
        // - Sort by Bot Name (Alphabetical)
        botsWithDates.sort((a, b) => {
            // Primary: User Email
            const emailComparison = a.user.email.localeCompare(b.user.email);
            if (emailComparison !== 0) return emailComparison;

            // Secondary: Source Plan (Bundle)
            const planA = a.sourcePlan || '';
            const planB = b.sourcePlan || '';
            const planComparison = planA.localeCompare(planB);
            if (planComparison !== 0) return planComparison;

            // Tertiary: Bot Name
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(botsWithDates);
    } catch (error) {
        console.error("Admin Bots Fetch Error:", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// PUT: Activate Bot / Update Status
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { botId, status, endDate } = await req.json();

        // 1. Get the Bot and its User's Active/Cancelled Subscriptions
        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: {
                user: {
                    include: {
                        subscriptions: {
                            where: { status: { in: ['ACTIVE', 'CANCELLED'] } },
                            include: { plan: true },
                            orderBy: { endDate: 'desc' }
                        }
                    }
                }
            }
        });

        if (!bot) return new NextResponse('Bot not found', { status: 404 });

        // Find the specific matching subscription for this bot
        let matchedSub: any = null;
        const userSubs = bot.user.subscriptions || [];

        userSubs.forEach((sub: any) => {
            let targets = sub.plan.includedBots && sub.plan.includedBots.length > 0
                ? [...sub.plan.includedBots]
                : [];

            if (targets.length === 0 && sub.plan.category === 'Bundles') {
                const tier = sub.plan.tier.toLowerCase();
                if (tier.includes('starter')) {
                    targets = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
                } else if (tier.includes('pro')) {
                    targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
                } else if (tier.includes('expert')) {
                    targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro'];
                }
            }
            if (targets.length === 0) targets = [sub.plan.name];

            const normalizedBotName = bot.name.replace(/\s\(Trial\)$/, '');
            if (targets.includes(normalizedBotName)) {
                if (!matchedSub) matchedSub = sub;
            }
        });

        if (!matchedSub) {
            // Fallback: If no direct match, try active one
            matchedSub = userSubs.find(s => s.status === 'ACTIVE');
        }

        // Logic Implementation:
        // A. Handle Expiration Date Update
        if (endDate && matchedSub) {
            await prisma.subscription.update({
                where: { id: matchedSub.id },
                data: { endDate: new Date(endDate) }
            });
        }

        // B. Handle Status Update
        if (status) {
            if (status === 'RUNNING' && matchedSub && !matchedSub.activatedAt) {
                const now = new Date();
                // Ensure startDate and endDate are valid Date objects
                const startDate = new Date(matchedSub.startDate);
                const endDate = new Date(matchedSub.endDate);

                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    const originalDuration = endDate.getTime() - startDate.getTime();
                    // Default to 30 days if duration calculation fails or is zero/negative (sanity check)
                    const durationToAdd = originalDuration > 0 ? originalDuration : 30 * 24 * 60 * 60 * 1000;
                    const newEndDate = new Date(now.getTime() + durationToAdd);

                    await prisma.subscription.update({
                        where: { id: matchedSub.id },
                        data: {
                            startDate: now,
                            endDate: newEndDate,
                            activatedAt: now
                        }
                    });
                }
            }

            await prisma.bot.update({
                where: { id: botId },
                data: { status }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error updating bot:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
