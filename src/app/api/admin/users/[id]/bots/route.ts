import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userId = params.id;

        const bots = await prisma.bot.findMany({
            where: { userId },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { updatedAt: 'desc' }
        });

        // Fetch all subscriptions for this user
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId,
                status: { in: ['ACTIVE', 'CANCELLED'] }
            },
            include: { plan: true },
            orderBy: { endDate: 'desc' }
        });

        // Match bots to their correct subscription
        const botsWithDates = bots.map(bot => {
            // Find best matching subscription
            let bestSub: any = null;
            let minTimeDiff = Infinity;

            subscriptions.forEach((sub: any) => {
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

            return {
                ...bot,
                startDate: bestSub?.startDate || null,
                endDate: bestSub?.endDate || null,
                sourcePlan: bestSub?.plan?.name || 'Unknown',
                isBundle: bestSub?.plan?.category === 'Bundles' || false
            };
        });

        // Sort Logic
        botsWithDates.sort((a, b) => {
            // Primary: Source Plan (Bundle)
            const planA = a.sourcePlan || '';
            const planB = b.sourcePlan || '';
            const planComparison = planA.localeCompare(planB);
            if (planComparison !== 0) return planComparison;

            // Secondary: Bot Name
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(botsWithDates);
    } catch (error: any) {
        console.error("Error fetching user bots:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
