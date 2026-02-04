import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new NextResponse('User ID required', { status: 400 });
        }

        // 1. Find user and verify existence
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Use transaction to ensure all or nothing
        await prisma.$transaction([
            // Delete bots
            prisma.bot.deleteMany({
                where: { userId }
            }),
            // Delete subscriptions
            prisma.subscription.deleteMany({
                where: { userId }
            }),
            // Delete orders
            prisma.order.deleteMany({
                where: { userId }
            }),
            // Reset trial history and status
            prisma.user.update({
                where: { id: userId },
                data: {
                    trialUsedCategories: [],
                    status: 'ACTIVE'
                } as any
            })
        ]);

        return NextResponse.json({ message: 'User data reset successfully' });
    } catch (error: any) {
        console.error("Error resetting user data:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
