import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch unique categories from plans, excluding "Bundles"
        const plans = await prisma.plan.findMany({
            where: {
                category: {
                    not: 'Bundles'
                },
                isActive: true
            },
            select: {
                category: true
            },
            distinct: ['category'],
            orderBy: {
                category: 'asc'
            }
        });

        // Extract unique category names
        const categories = plans.map(plan => plan.category);

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching bot categories:', error);
        return NextResponse.json({ error: 'Failed to fetch bot categories' }, { status: 500 });
    }
}
