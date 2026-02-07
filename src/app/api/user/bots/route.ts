import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // OPTIMIZED: Single query with includes instead of 3 separate queries
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                bots: {
                    orderBy: { createdAt: 'desc' }
                },
                subscriptions: {
                    where: {
                        status: {
                            in: ['ACTIVE', 'CANCELLED']
                        }
                    },
                    include: {
                        plan: true
                    },
                    orderBy: {
                        endDate: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const bots = user.bots;
        const subscriptions = user.subscriptions;

        // Match bots to subscriptions (1-to-1 logic)
        const remainingSubs = [...subscriptions];
        const botsWithExpiry = bots.map(bot => {
            // Find a subscription that could contain this bot
            // 1. Matches plan name exactly
            // 2. OR bot name is in includedBots

            let bestSubIndex = -1;
            let minTimeDiff = Infinity;

            remainingSubs.forEach((sub, index) => {
                let targets = sub.plan.includedBots && sub.plan.includedBots.length > 0
                    ? [...sub.plan.includedBots]
                    : [];

                // Fallback for Bundles if includedBots is empty (Matches verification logic)
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

                // Normalize bot name for matching (strip " (Trial)" suffix if present)
                const normalizedBotName = bot.name.replace(/\s\(Trial\)$/, '');

                if (targets.includes(normalizedBotName)) {
                    const botTime = new Date(bot.createdAt).getTime();
                    const subTime = new Date(sub.createdAt).getTime();
                    const diff = Math.abs(botTime - subTime);

                    if (diff < minTimeDiff) {
                        minTimeDiff = diff;
                        bestSubIndex = index;
                    }
                }
            });

            if (bestSubIndex !== -1) {
                const sub = remainingSubs[bestSubIndex];
                // We don't splice remainingSubs here because a bundle sub can have multiple bots.
                // Instead, we just use it. If multiple bots match, they'll all pick the closest sub.
                // Since we order subs by endDate desc, this is usually what we want.

                return {
                    ...bot,
                    expirationDate: sub.endDate || null,
                    isActivated: !!sub.activatedAt
                };
            }

            return {
                ...bot,
                expirationDate: null,
                isActivated: false
            };
        });

        return NextResponse.json(botsWithExpiry);
    } catch (error) {
        console.error('[BOTS_GET_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const body = await req.json();
        const { name, apiKey, secretKey, tradingViewEmail } = body;

        const bot = await prisma.bot.create({
            data: {
                userId: user.id,
                name: name || 'New Bot',
                apiKey: apiKey || '',
                secretKey: secretKey || '',
                tradingViewEmail: tradingViewEmail || null,
                status: 'SETTING_UP'
            }
        });

        return NextResponse.json(bot);
    } catch (error) {
        console.error('[BOTS_POST_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { id, apiKey, secretKey, tradingViewEmail, webhookUrl, status } = body;

        if (!id) {
            return new NextResponse('Bot ID required', { status: 400 });
        }

        const updateData: any = {};
        if (apiKey !== undefined) updateData.apiKey = apiKey;
        if (secretKey !== undefined) updateData.secretKey = secretKey;
        if (tradingViewEmail !== undefined) updateData.tradingViewEmail = tradingViewEmail;
        if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
        if (status !== undefined) updateData.status = status;

        const bot = await prisma.bot.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(bot);
    } catch (error) {
        console.error('[BOTS_PUT_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
