import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🗑️  Clearing test data...')

    // Delete Subscriptions
    const deletedSubs = await prisma.subscription.deleteMany({})
    console.log(`✅ Deleted ${deletedSubs.count} subscriptions`)

    // Delete Bots
    const deletedBots = await prisma.bot.deleteMany({})
    console.log(`✅ Deleted ${deletedBots.count} bots`)

    // Note: Orders are kept for billing history records unless requested otherwise
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
