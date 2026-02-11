import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch all published guides that have bot categories assigned
        const guides = await prisma.guide.findMany({
            where: {
                isPublished: true
            },
            select: {
                slug: true,
                title: true,
                botNames: true // This contains the category names like "Smart Timer DCA"
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });

        // Group guides by bot category
        const guidesByCategory: { [category: string]: { slug: string, title: string }[] } = {};

        guides.forEach(guide => {
            if (guide.botNames && guide.botNames.length > 0) {
                // Add this guide to each of its assigned categories
                guide.botNames.forEach(category => {
                    if (!guidesByCategory[category]) {
                        guidesByCategory[category] = [];
                    }
                    guidesByCategory[category].push({
                        slug: guide.slug,
                        title: guide.title
                    });
                });
            }
        });

        return NextResponse.json(guidesByCategory);
    } catch (error) {
        console.error('Error fetching guides by category:', error);
        return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
    }
}
