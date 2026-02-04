// Script สำหรับสร้าง Plans ใน Database
// รันด้วย: node scripts/seed-plans.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Plans...');

    // Create Plans
    const plans = [
        {
            name: 'Timer DCA Bot - Monthly',
            description: 'Monthly subscription for Timer DCA trading bot',
            price: 199.00,
            type: 'MONTHLY',
            category: 'CRYPTO',
            tier: 'STANDARD',
            features: JSON.stringify([
                'Timer DCA Strategy',
                'Unlimited Trades',
                '24/7 Bot Running',
                'Email Support'
            ])
        },
        {
            name: 'Timer DCA Bot - Yearly',
            description: 'Yearly subscription for Timer DCA trading bot',
            price: 1990.00,
            type: 'YEARLY',
            category: 'CRYPTO',
            tier: 'STANDARD',
            features: JSON.stringify([
                'Timer DCA Strategy',
                'Unlimited Trades',
                '24/7 Bot Running',
                'Priority Support',
                '2 Months Free'
            ])
        },
        {
            name: 'Bollinger DCA Bot - Monthly',
            description: 'Monthly subscription for Bollinger DCA trading bot',
            price: 299.00,
            type: 'MONTHLY',
            category: 'CRYPTO',
            tier: 'PRO',
            features: JSON.stringify([
                'Bollinger DCA Strategy',
                'Advanced Analytics',
                'Unlimited Trades',
                '24/7 Bot Running',
                'Priority Support'
            ])
        },
        {
            name: 'Forex Bot - Lifetime',
            description: 'One-time payment for Forex trading bot',
            price: 999.00,
            type: 'ONETIME',
            category: 'FOREX',
            tier: 'ULTIMATE',
            features: JSON.stringify([
                'Forex Trading Strategy',
                'Lifetime Access',
                'All Future Updates',
                'Premium Support'
            ])
        }
    ];

    for (const plan of plans) {
        const existing = await prisma.plan.findFirst({
            where: { name: plan.name }
        });

        if (!existing) {
            await prisma.plan.create({ data: plan });
            console.log(`✅ Created: ${plan.name}`);
        } else {
            console.log(`⏭️ Already exists: ${plan.name}`);
        }
    }

    console.log('\n🎉 Plans seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
