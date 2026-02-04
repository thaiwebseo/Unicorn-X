import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch all users with bot statistics
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const users = await prisma.user.findMany({
            include: {
                bots: {
                    select: {
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const usersWithStats = users.map(user => {
            const totalBots = user.bots.length;
            const runningBots = user.bots.filter(bot => (bot.status as string) === 'RUNNING').length;
            const expiredBots = user.bots.filter(bot => (bot.status as string) === 'SUSPENDED').length;

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                totalBots,
                runningBots,
                expiredBots,
                status: (user as any).status || 'ACTIVE',
                adminNotes: (user as any).adminNotes || '',
                createdAt: user.createdAt
            };
        });

        return NextResponse.json(usersWithStats);
    } catch (error: any) {
        console.error("Error fetching admin users:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}

// PUT: Update user profile / status / notes
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId, name, email, status, adminNotes } = await req.json();

        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                status,
                adminNotes
            } as any
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error("Error updating admin user:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
