
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch content for a specific bot page
export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { slug } = await params;
        const content = await prisma.botContent.findUnique({
            where: { slug }
        });

        if (!content) {
            return new NextResponse('Content not found', { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching bot content:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// PUT: Update content
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { slug } = await params;
        const body = await req.json();

        // Remove immutable fields from update payload
        const { id, slug: _slug, updatedAt, ...updateData } = body;

        const content = await prisma.botContent.update({
            where: { slug },
            data: updateData
        });

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error updating bot content:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
