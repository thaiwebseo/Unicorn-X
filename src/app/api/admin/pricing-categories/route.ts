
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all categories
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const categories = await prisma.pricingCategory.findMany({
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching pricing categories:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// POST: Create a new category
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name, description, sortOrder } = body;

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        const category = await prisma.pricingCategory.create({
            data: {
                name,
                description,
                sortOrder: sortOrder || 0
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error creating pricing category:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// PUT: Update category (sort order, description, etc.)
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { id, name, description, sortOrder } = body;

        if (!id) {
            return new NextResponse('ID is required', { status: 400 });
        }

        const category = await prisma.pricingCategory.update({
            where: { id },
            data: {
                name,
                description,
                sortOrder
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating pricing category:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// DELETE: Remove category info
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse('ID is required', { status: 400 });
        }

        await prisma.pricingCategory.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting pricing category:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
