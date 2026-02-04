import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const plans = await prisma.plan.findMany({
        where: { category: 'Bundles', isActive: true },
        select: { id: true, name: true, tier: true, category: true, isActive: true, includedBots: true }
    });
    console.log(JSON.stringify(plans, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
