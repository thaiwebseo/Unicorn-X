import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch plans and recent manual subscriptions
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const plans = await prisma.plan.findMany({
            where: { isActive: true }
        });

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ plans, users });
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}

// POST: Manually assign a plan to a user
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId, planId, months } = await req.json();

        if (!userId || !planId || !months) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const plan = await prisma.plan.findUnique({ where: { id: planId } });
        if (!plan) return new NextResponse('Plan not found', { status: 404 });

        // Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + parseInt(months));

        // Create the subscription
        const subscription = await prisma.subscription.create({
            data: {
                userId,
                planId,
                status: 'ACTIVE',
                startDate,
                endDate,
                activatedAt: startDate, // Manual activation
                stripeSessionId: `MANUAL_${Date.now()}` // Mark as manual
            } as any
        });

        // === CREATE BOT(S) FOR THE USER ===
        // Determine which bots to create based on plan type
        let botNamesToCreate: string[] = [];

        if (plan.category === 'Bundles') {
            // Bundle: Create multiple bots
            if (plan.includedBots && plan.includedBots.length > 0) {
                botNamesToCreate = plan.includedBots;
            } else {
                // Fallback for bundles without includedBots configured
                const tier = plan.tier.toLowerCase();
                if (tier.includes('starter')) {
                    botNamesToCreate = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
                } else if (tier.includes('pro')) {
                    botNamesToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
                } else if (tier.includes('expert')) {
                    botNamesToCreate = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro'];
                }
            }
        } else {
            // Single plan: Create one bot with the plan name
            botNamesToCreate = [plan.name];
        }

        // Create bot records
        for (const botName of botNamesToCreate) {
            await prisma.bot.create({
                data: {
                    userId,
                    name: botName,
                    status: 'WAITING_FOR_SETUP',
                    apiKey: '',
                    secretKey: ''
                }
            });
        }

        return NextResponse.json({
            subscription,
            botsCreated: botNamesToCreate.length,
            botNames: botNamesToCreate
        });
    } catch (error: any) {
        console.error("Error creating manual subscription:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
