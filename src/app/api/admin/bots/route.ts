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
                            where: { status: 'ACTIVE' },
                            include: { plan: true },
                            orderBy: { endDate: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const botsWithDates = bots.map(bot => {
            const activeSub = bot.user.subscriptions[0];
            return {
                ...bot,
                startDate: activeSub?.startDate || null,
                endDate: activeSub?.endDate || null,
            };
        });

        return NextResponse.json(botsWithDates);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// PUT: Activate Bot / Update Status
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
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
