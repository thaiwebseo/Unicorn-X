
import { prisma } from './src/lib/prisma';

async function main() {
    const userEmail = 'test02@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            bots: true,
            subscriptions: {
                include: { plan: true }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User:', user.name, user.email);
    console.log('--- Subscriptions ---');

    const subs = user.subscriptions.map(sub => ({
        id: sub.id,
        plan: sub.plan.name,
        category: sub.plan.category,
        tier: sub.plan.tier,
        status: sub.status,
        activatedAt: sub.activatedAt,
        startDate: sub.startDate,
        endDate: sub.endDate,
        includedBots: sub.plan.includedBots
    }));
    console.log(JSON.stringify(subs, null, 2));

    console.log('--- Bots ---');
    const bots = user.bots.map(bot => ({
        name: bot.name,
        status: bot.status
    }));
    console.log(JSON.stringify(bots, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
