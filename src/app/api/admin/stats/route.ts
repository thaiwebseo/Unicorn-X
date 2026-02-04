import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const totalUsers = await prisma.user.count();
        const activeSub = await prisma.subscription.count({
            where: { status: 'ACTIVE' }
        });
        const activeBots = await prisma.bot.count({
            where: { status: 'RUNNING' }
        });

        return NextResponse.json({
            totalUsers,
            activeSub,
            activeBots
        });
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
