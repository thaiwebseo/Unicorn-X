
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Publically fetch content for a specific bot page
export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const content = await prisma.botContent.findUnique({
            where: { slug }
        });

        if (!content) {
            return new NextResponse('Content not found', { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching bot content (public):', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
