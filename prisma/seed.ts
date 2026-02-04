
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const plans = [
    // Group 1: Smart Timer DCA
    {
      name: 'Smart Timer DCA - Starter',
      category: 'Smart Timer DCA',
      tier: 'Starter',
      priceMonthly: 14,
      priceYearly: 134,
      features: ['Time-based DCA', 'RSI', 'Binance'],
    },
    {
      name: 'Smart Timer DCA - Pro',
      category: 'Smart Timer DCA',
      tier: 'Pro',
      priceMonthly: 19,
      priceYearly: 182,
      features: ['RSI/MACD/MA', 'Binance+OKX', 'Customizable schedule'],
    },

    // Group 2: Bollinger Band DCA
    {
      name: 'Bollinger Band DCA - Starter',
      category: 'Bollinger Band DCA',
      tier: 'Starter',
      priceMonthly: 22,
      priceYearly: 211,
      features: ['BB Logic', 'Band level selection', 'Binance'],
    },
    {
      name: 'Bollinger Band DCA - Pro',
      category: 'Bollinger Band DCA',
      tier: 'Pro',
      priceMonthly: 35,
      priceYearly: 336,
      features: ['Fully customizable bands', 'Confirmation indicators', 'Binance+OKX'],
    },

    // Group 3: MVRV Smart DCA
    {
      name: 'MVRV Smart DCA - Starter',
      category: 'MVRV Smart DCA',
      tier: 'Starter',
      priceMonthly: 29,
      priceYearly: 278,
      features: ['On-chain MVRV', 'Pre-set thresholds', 'Binance'],
    },
    {
      name: 'MVRV Smart DCA - Pro',
      category: 'MVRV Smart DCA',
      tier: 'Pro',
      priceMonthly: 45,
      priceYearly: 430,
      features: ['Customizable thresholds', 'Confirmation indicators', 'Binance+OKX'],
    },

    // Group 4: Ultimate DCA Max
    {
      name: 'Ultimate DCA Max - Starter',
      category: 'Ultimate DCA Max',
      tier: 'Starter',
      priceMonthly: 47,
      priceYearly: 451,
      features: ['4 Safety Orders', 'Single-level TP', 'Binance'],
    },
    {
      name: 'Ultimate DCA Max - Pro',
      category: 'Ultimate DCA Max',
      tier: 'Pro',
      priceMonthly: 77,
      priceYearly: 739,
      features: ['8 Safety Orders', 'Two-level TP', 'Basic trailing profit'],
    },
    {
      name: 'Ultimate DCA Max - Expert',
      category: 'Ultimate DCA Max',
      tier: 'Expert',
      priceMonthly: 127,
      priceYearly: 1219,
      features: ['14 Safety Orders', '3-level TP', 'Smart Trailing Profit', 'Binance+OKX'],
    },

    // Group 5: Bundles
    {
      name: 'Combine Bundle - Starter',
      category: 'Bundles',
      tier: 'Starter Bundle',
      priceMonthly: 49,
      priceYearly: 470,
      features: ['Smart Timer/Bollinger/MVRV Starter versions'],
    },
    {
      name: 'Combine Bundle - Pro',
      category: 'Bundles',
      tier: 'Pro Bundle',
      priceMonthly: 79,
      priceYearly: 758,
      features: ['Pro versions of above + OKX support'],
    },
    {
      name: 'Combine Bundle - Expert',
      category: 'Bundles',
      tier: 'Expert Bundle',
      priceMonthly: 149,
      priceYearly: 1430,
      features: ['All Bots Pro + Ultimate DCA Max Pro + UnicornX Signal'],
    },
  ]

  console.log('Start seeding...')
  for (const plan of plans) {
    const result = await prisma.plan.upsert({
      where: {
        name_category_tier: {
          name: plan.name,
          category: plan.category,
          tier: plan.tier,
        },
      },
      update: plan,
      create: plan,
    })
    console.log(`Upserted plan: ${result.name}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
