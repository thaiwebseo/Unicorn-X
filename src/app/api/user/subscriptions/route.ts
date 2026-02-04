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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const subscriptions = await prisma.subscription.findMany({
            where: { userId: user.id },
            include: {
                plan: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('[SUBSCRIPTIONS_GET_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
