// Script สำหรับสร้างข้อมูลทดสอบใน Dashboard
// รันด้วย: node scripts/seed-test-data.js <email>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log('❌ กรุณาระบุ email ของ user ที่ต้องการสร้างข้อมูล');
        console.log('   Usage: node scripts/seed-test-data.js your@email.com');
        process.exit(1);
    }

    console.log(`🔍 ค้นหา user: ${email}`);

    // Find user
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('❌ ไม่พบ user นี้ในระบบ');
        process.exit(1);
    }

    console.log(`✅ พบ user: ${user.id}`);

    // Check for existing Plan or create one
    let plan = await prisma.plan.findFirst({
        where: { name: 'Crypto Trading' }
    });

    if (!plan) {
        console.log('📦 สร้าง Plan: Crypto Trading');
        plan = await prisma.plan.create({
            data: {
                name: 'Crypto Trading',
                description: 'Monthly crypto trading bot subscription',
                price: 199.00,
                type: 'MONTHLY',
                category: 'CRYPTO',
                features: JSON.stringify([
                    'Timer DCA Bot',
                    'Bollinger DCA Bot',
                    '24/7 Support',
                    'Unlimited Trades'
                ])
            }
        });
    }
    console.log(`✅ Plan ID: ${plan.id}`);

    // Create Subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    console.log('📝 สร้าง Subscription...');
    const subscription = await prisma.subscription.create({
        data: {
            userId: user.id,
            planId: plan.id,
            status: 'ACTIVE',
            startDate,
            endDate,
            stripeSessionId: `test_session_${Date.now()}`
        }
    });
    console.log(`✅ Subscription ID: ${subscription.id}`);

    // Create Order
    console.log('💳 สร้าง Order...');
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            amount: 199.00,
            planName: 'Crypto Trading - Monthly Plan',
            paymentMethod: 'card',
            stripeSessionId: `test_order_${Date.now()}`,
            status: 'PAID'
        }
    });
    console.log(`✅ Order ID: ${order.id}`);

    // Create Bot
    console.log('🤖 สร้าง Bot...');
    const bot = await prisma.bot.create({
        data: {
            userId: user.id,
            name: 'Timer DCA Bot',
            apiKey: '',
            secretKey: '',
            status: 'ACTIVATING'
        }
    });
    console.log(`✅ Bot ID: ${bot.id}`);

    console.log('\n🎉 สร้างข้อมูลทดสอบเรียบร้อยแล้ว!');
    console.log('   ลอง Refresh หน้า Dashboard ดูได้เลยครับ');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
