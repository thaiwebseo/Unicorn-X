import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch all guides
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const guides = await prisma.guide.findMany({
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(guides);
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}

// POST: Create new guide
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { title, slug, content, category, botNames, isPublished, sortOrder } = await req.json();

        if (!title || !slug) {
            return new NextResponse('Title and slug are required', { status: 400 });
        }

        // Check if slug already exists
        const existingGuide = await prisma.guide.findUnique({
            where: { slug }
        });

        if (existingGuide) {
            return new NextResponse('A guide with this slug already exists', { status: 400 });
        }

        const guide = await prisma.guide.create({
            data: {
                title,
                slug,
                content: content || '',
                category: category || 'getting-started',
                botNames: botNames || [],
                isPublished: isPublished || false,
                sortOrder: sortOrder || 0
            }
        });

        return NextResponse.json(guide);
    } catch (error: any) {
        console.error('Error creating guide:', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
