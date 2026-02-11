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
            let minTimeDiff = Infinity;

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
                    // Match found! Identify closest creation time (optional, but good for accuracy)
                    // But simplified: just take the most recent active one if multiple match
                    // Since subs are ordered by endDate desc, the first one is usually the active/renewed one.

                    // Simple logic: If we haven't found a match yet, or this one ends later?
                    // Let's stick to the time diff logic if we want parity, 
                    // or just take the first matching Active one.

                    if (!bestSub) bestSub = sub;
                }
            });

            // If no match by name, fallback to first active sub (legacy behavior) 
            // OR leave empty? Better leave empty to avoid confusion.
            // But for safety, let's allow fallback if it's a single bot plan
            if (!bestSub && userSubs.length > 0) {
                // Try loose matching
            }

            return {
                ...bot,
                startDate: bestSub?.startDate || null,
                endDate: bestSub?.endDate || null,
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
            // Empty plans go last? Or first? Let's say last for consistency
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

        // 1. Get the Bot and its User's Active Subscription
        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: {
                user: {
                    include: {
                        subscriptions: {
                            where: { status: 'ACTIVE' },
                            include: { plan: true },
                            orderBy: { endDate: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!bot) return new NextResponse('Bot not found', { status: 404 });

        // Logic Implementation:
        // A. Handle Expiration Date Update
        if (endDate) {
            const subscription = bot.user.subscriptions[0];
            if (subscription) {
                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { endDate: new Date(endDate) }
                });
            } else {
                return new NextResponse('No active subscription found to update date', { status: 400 });
            }
        }

        // B. Handle Status Update
        if (status) {
            if (status === 'RUNNING') {
                const subscription = bot.user.subscriptions[0] as any;
                if (subscription && !subscription.activatedAt) {
                    const now = new Date();
                    const originalDuration = subscription.endDate.getTime() - subscription.startDate.getTime();
                    const newEndDate = new Date(now.getTime() + originalDuration);

                    await prisma.subscription.update({
                        where: { id: subscription.id },
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
