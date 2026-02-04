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

        return NextResponse.json(subscription);
    } catch (error: any) {
        console.error("Error creating manual subscription:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
