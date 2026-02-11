const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updates = [
        {
            slug: 'bollinger-dca',
            link: '/checkout?plan=Bollinger%20Band%20DCA%20-%20Starter&price=0.00&type=monthly&isTrial=true'
        },
        {
            slug: 'timer-dca',
            link: '/checkout?plan=Smart%20Timer%20DCA%20-%20Starter&price=0.00&type=monthly&isTrial=true'
        },
        {
            slug: 'mvrv-cycle-dca',
            link: '/checkout?plan=MVRV%20Smart%20DCA%20-%20Starter&price=0.00&type=monthly&isTrial=true'
        },
        {
            slug: 'pro-multi-dca',
            link: '/checkout?plan=Ultimate%20DCA%20Max%20-%20Starter&price=0.00&type=monthly&isTrial=true'
        }
    ];

    console.log('Updating specific trial links for bots...');

    for (const item of updates) {
        const result = await prisma.botContent.update({
            where: { slug: item.slug },
            data: { ctaLink: item.link }
        });
        console.log(`  ✅ Updated ${item.slug} -> ${item.link}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
