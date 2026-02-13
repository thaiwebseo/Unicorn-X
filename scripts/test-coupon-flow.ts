
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Starting Coupon Flow Test ---');

        // 1. Create a Test User
        const userEmail = 'test_coupon_user@example.com';
        let user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    passwordHash: 'dummy',
                    name: 'Test Setup User'
                }
            });
            console.log('✅ Created Test User:', user.id);
        } else {
            console.log('ℹ️ Using Existing Test User:', user.id);
        }

        // 2. Create a Test Coupon
        const couponCode = 'TEST-FLOW-50';
        let coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
        if (!coupon) {
            coupon = await prisma.coupon.create({
                data: {
                    code: couponCode,
                    discountType: 'PERCENTAGE',
                    discountValue: 50,
                    isActive: true,
                    limitPerUser: 1,
                    usageLimit: 100
                }
            });
            console.log('✅ Created Test Coupon:', coupon.code);
        } else {
            // Reset usage for test
            await prisma.couponUsage.deleteMany({ where: { couponId: coupon.id, userId: user.id } });
            console.log('ℹ️ Reset Coupon Usage for User');
        }

        // 3. Simulate Checkout Logic (Pre-computation)
        const planPrice = 1000;
        let finalPrice = planPrice;

        // Simulate validation logic from /api/coupons/validate
        if (coupon.isActive) {
            // Mock session check
            const userUsage = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId: user.id } });
            if (userUsage < (coupon.limitPerUser || 999)) {
                if (coupon.discountType === 'PERCENTAGE') {
                    finalPrice = planPrice * (1 - coupon.discountValue / 100);
                } else {
                    finalPrice = Math.max(0, planPrice - coupon.discountValue);
                }
                console.log(`✅ Coupon Valid. Original: ${planPrice}, Final: ${finalPrice}`);
            } else {
                console.error('❌ Coupon Limit Reached (Simulation)');
            }
        }

        console.log('--- Test Finished ---');

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
