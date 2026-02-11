import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch single guide by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const guide = await prisma.guide.findUnique({
            where: { id }
        });

        if (!guide) {
            return new NextResponse('Guide not found', { status: 404 });
        }

        return NextResponse.json(guide);
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}

// PUT: Update guide
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { title, slug, content, category, botNames, isPublished, sortOrder } = await req.json();

        // Check if slug is taken by another guide
        if (slug) {
            const existingGuide = await prisma.guide.findFirst({
                where: {
                    slug,
                    NOT: { id }
                }
            });

            if (existingGuide) {
                return new NextResponse('A guide with this slug already exists', { status: 400 });
            }
        }

        const guide = await prisma.guide.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(slug !== undefined && { slug }),
                ...(content !== undefined && { content }),
                ...(category !== undefined && { category }),
                ...(botNames !== undefined && { botNames }),
                ...(isPublished !== undefined && { isPublished }),
                ...(sortOrder !== undefined && { sortOrder })
            }
        });

        return NextResponse.json(guide);
    } catch (error: any) {
        console.error('Error updating guide:', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}

// DELETE: Delete guide
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await prisma.guide.delete({
            where: { id }
        });

        return new NextResponse('Deleted', { status: 200 });
    } catch (error: any) {
        console.error('Error deleting guide:', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
