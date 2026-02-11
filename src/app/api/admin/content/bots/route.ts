
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all bot content pages
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const contents = await prisma.botContent.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                slug: true,
                name: true,
                updatedAt: true
            }
        });

        return NextResponse.json(contents);
    } catch (error) {
        console.error('Error fetching bot contents:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
