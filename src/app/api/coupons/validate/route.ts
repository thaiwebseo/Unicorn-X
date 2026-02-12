import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { code } = await req.json();

        if (!code) {
            return new NextResponse('Coupon code is required', { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return new NextResponse('Invalid coupon code', { status: 404 });
        }

        if (!coupon.isActive) {
            return new NextResponse('This coupon is no longer active', { status: 400 });
        }

        // Check Expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return new NextResponse('This coupon has expired', { status: 400 });
        }

        // Check Usage Limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return new NextResponse('This coupon has reached its usage limit', { status: 400 });
        }

        // Check Per-User Limit
        if (coupon.limitPerUser) {
            // Need session to verify user
            const { getServerSession } = await import('next-auth');
            const { authOptions } = await import('@/lib/auth');
            const session = await getServerSession(authOptions);
            const userId = (session?.user as any)?.id;

            if (!userId) {
                return new NextResponse('You must be logged in to use this coupon', { status: 401 });
            }

            const userUsageCount = await prisma.couponUsage.count({
                where: {
                    couponId: coupon.id,
                    userId: userId
                }
            });

            if (userUsageCount >= coupon.limitPerUser) {
                return new NextResponse(`You have already used this coupon (Limit: ${coupon.limitPerUser} per user)`, { status: 400 });
            }
        }

        return NextResponse.json({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            stripeCouponId: coupon.stripeCouponId
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
