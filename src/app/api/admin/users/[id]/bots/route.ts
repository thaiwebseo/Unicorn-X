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

        // Add subscription dates to each bot (similar to main bots API)
        const activeSub = await prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            orderBy: { endDate: 'desc' }
        });

        const botsWithDates = bots.map(bot => ({
            ...bot,
            startDate: activeSub?.startDate || null,
            endDate: activeSub?.endDate || null,
        }));

        return NextResponse.json(botsWithDates);
    } catch (error: any) {
        console.error("Error fetching user bots:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
