import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                category: true,
                tier: true,
                priceMonthly: true,
                priceYearly: true,
                features: true,
                includedBots: true
            }
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error('[PLANS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
