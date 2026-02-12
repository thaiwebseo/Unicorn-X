import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { code, discountType, discountValue, expiryDate, usageLimit, limitPerUser } = body;

        // 1. Create Coupon in Stripe
        let stripeCouponId = null;
        try {
            const stripeCoupon = await stripe.coupons.create({
                id: code, // Use the code as ID for clarity
                duration: 'once', // As per user requirement: discount once per payment
                percent_off: discountType === 'PERCENTAGE' ? discountValue : undefined,
                amount_off: discountType === 'FIXED' ? Math.round(discountValue * 100) : undefined,
                currency: discountType === 'FIXED' ? 'usd' : undefined,
                max_redemptions: usageLimit || undefined,
                redeem_by: expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : undefined,
                // Note: Stripe 'max_redemptions_per_customer' is only available for Promotion Codes, not base Coupons.
                // We will handle per-user limits in our own application logic.
            });
            stripeCouponId = stripeCoupon.id;
        } catch (error: any) {
            console.error('Stripe Coupon Creation Error:', error);
            return new NextResponse(`Stripe Error: ${error.message}`, { status: 400 });
        }

        // 2. Save in Database
        const coupon = await prisma.coupon.create({
            data: {
                code,
                discountType,
                discountValue,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                usageLimit,
                limitPerUser, // Add this
                stripeCouponId,
                isActive: true
            }
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error creating coupon:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { id, isActive } = body;

        const coupon = await prisma.coupon.update({
            where: { id },
            data: { isActive }
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return new NextResponse('ID required', { status: 400 });

        const coupon = await prisma.coupon.findUnique({ where: { id } });

        if (coupon?.stripeCouponId) {
            try {
                await stripe.coupons.del(coupon.stripeCouponId);
            } catch (error) {
                console.warn('Stripe Coupon deletion failed or already deleted');
            }
        }

        await prisma.coupon.delete({ where: { id } });

        return new NextResponse('Deleted', { status: 200 });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
