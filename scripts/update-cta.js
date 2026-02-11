const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.botContent.updateMany({
        data: {
            ctaText: 'Start Free Trial',
            ctaLink: '/register'
        }
    });
    console.log('Updated', result.count, 'bots with default CTA values');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
