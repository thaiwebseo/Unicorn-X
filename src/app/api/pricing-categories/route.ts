
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Publically fetch pricing categories and descriptions
export async function GET() {
    try {
        const categories = await prisma.pricingCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching pricing categories (public):', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
