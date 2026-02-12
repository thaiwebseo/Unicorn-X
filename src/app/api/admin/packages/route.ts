import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch all packages
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const plans = await prisma.plan.findMany({
            orderBy: [
                { category: 'asc' },
                { priceMonthly: 'asc' }
            ]
        });

        return NextResponse.json(plans);
    } catch (error: any) {
        console.error("Error fetching plans:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}

// POST: Create a new package
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name, category, tier, priceMonthly, priceYearly, features, isActive, isHighlighted } = body;

        // Basic validation
        if (!name || !category || !tier || priceMonthly === undefined || priceYearly === undefined) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const newPlan = await prisma.plan.create({
            data: {
                name,
                category,
                tier,
                priceMonthly: parseFloat(priceMonthly),
                priceYearly: parseFloat(priceYearly),
                features: features || [],
                includedBots: body.includedBots || [],
                isHighlighted: isHighlighted || false,
                isActive: isActive ?? true
            }
        });

        return NextResponse.json(newPlan);
    } catch (error: any) {
        console.error("Error creating plan:", error);
        // Handle unique constraint violation if necessary
        if (error.code === 'P2002') {
            return new NextResponse('Plan with this name/category/tier already exists', { status: 409 });
        }
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}

// PUT: Update an existing package
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { id, name, category, tier, priceMonthly, priceYearly, features, includedBots, isActive, isHighlighted } = body;

        if (!id) {
            return new NextResponse('Plan ID required', { status: 400 });
        }

        const updatedPlan = await prisma.plan.update({
            where: { id },
            data: {
                name,
                category,
                tier,
                priceMonthly: priceMonthly !== undefined ? parseFloat(priceMonthly) : undefined,
                priceYearly: priceYearly !== undefined ? parseFloat(priceYearly) : undefined,
                features,
                includedBots,
                isHighlighted,
                isActive
            }
        });

        return NextResponse.json(updatedPlan);
    } catch (error: any) {
        console.error("Error updating plan:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}

// DELETE: Remove a package
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse('Plan ID required', { status: 400 });
        }

        // Check for dependencies (Subscriptions)
        const subCount = await prisma.subscription.count({
            where: { planId: id }
        });

        if (subCount > 0) {
            // If subscriptions exist, we can't delete it due to foreign key constraints
            // Instead, we mark it as Inactive so it's hidden from users
            await prisma.plan.update({
                where: { id },
                data: { isActive: false }
            });
            return new NextResponse('Plan has existing subscriptions. It has been deactivated instead of deleted to preserve history.', { status: 409 });
        }

        await prisma.plan.delete({
            where: { id }
        });

        return new NextResponse('Deleted successfully', { status: 200 });
    } catch (error: any) {
        console.error("Error deleting plan:", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
