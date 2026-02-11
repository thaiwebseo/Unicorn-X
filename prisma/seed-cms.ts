
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pricingCategories = [
    {
        name: 'Smart Timer DCA',
        description: 'Best for traders who want disciplined investing, with optional signals.',
        sortOrder: 1
    },
    {
        name: 'Bollinger Band DCA',
        description: 'Great for dip-hunters who want to buy when markets are statistically cheap.',
        sortOrder: 2
    },
    {
        name: 'MVRV Smart DCA',
        description: 'Perfect for long-term holders using on-chain data for optimal entries.',
        sortOrder: 3
    },
    {
        name: 'Ultimate DCA Max',
        description: 'Maximum control with safety orders and multi-level take profits.',
        sortOrder: 4
    },
    {
        name: 'Bundles',
        description: 'Bundle Plans – All Bots, One Subscription save 30-40%',
        sortOrder: 5
    }
];

const bollingerContent = {
    slug: 'bollinger-dca',
    name: 'Bollinger Band DCA',
    heroTitle: 'Bollinger DCA',
    heroDescription: 'Buy the dip with volatility-based entry logic.',
    whatIs: {
        title: 'What is Bollinger DCA?',
        description: "Bollinger DCA takes your Dollar-Cost Averaging strategy beyond fixed schedules by using a proven volatility indicator—Bollinger Bands—to identify statistically \"cheap\" prices. Instead of buying blindly at regular intervals, it waits for the price to approach or break below the lower band, signaling a potential dip, and executes your orders with precision.\n\nYou can also run it in hybrid mode: maintain your regular DCA schedule while adding extra buys when prices hit your chosen Bollinger Band level. This way, you consistently invest while capturing deep-value opportunities for better average entry prices."
    },
    howItWorks: [
        { number: 1, title: 'Market Monitoring', description: 'The bot continuously tracks price movement relative to the Bollinger Bands.' },
        { number: 2, title: 'Dip Detection', description: 'When the price approaches or dips below your selected band threshold, the bot triggers a buy order.' },
        { number: 3, title: 'Hybrid Mode', description: 'Optionally, keep your regular DCA schedule active while adding bonus buys during dips.' },
        { number: 4, title: 'Flexible Order Sizing', description: 'Allocate larger orders during deeper dips for maximum impact.' },
        { number: 5, title: 'Sell Conditions', description: 'You can configure the bot to take profits when prices hit the upper band or other specified levels.' },
        { number: 6, title: 'Indicator Confirmation (Optional)', description: 'Add filters like RSI, MACD, or moving averages to confirm market conditions before executing a trade.' }
    ],
    features: [
        { title: 'Precision Dip Buying', description: 'Enter the market at statistically low-price points for better value.' },
        { title: 'Customizable Bands & Settings', description: 'Choose your band threshold, order size, and frequency.' },
        { title: 'Better Average Entry', description: 'Reduce your cost per unit over time by capturing market dips.' },
        { title: 'Optional Signal Confirmation', description: 'Add extra confidence with your preferred indicators such as RSI, MACD, or MA Cross—plus the exclusive UnicornX Signal (Pro plan) for unmatched precision.' },
        { title: 'TradingView Integration', description: 'Build, backtest, and automate directly on TradingView.' }
    ],
    whoIsFor: [
        { title: 'Dip Hunters', description: 'You want to buy only when the market gives you a clear discount.' },
        { title: 'Value Investors', description: 'You aim to lower your average entry price and boost long-term returns.' },
        { title: 'Strategic DCA Users', description: 'You still like a fixed DCA schedule but want to enhance it with dip-based buys.' }
    ],
    comparison: [
        { feature: 'Fixed schedule buys', traditional: true, timer: true, timerLabel: '(with Hybrid Mode)' },
        { feature: 'Responds to volatility', traditional: false, timer: true },
        { feature: 'Targets dips at lower band', traditional: false, timer: true },
        { feature: 'Flexible order sizing', traditional: false, timer: true },
        { feature: 'Optional profit-taking at upper band', traditional: false, timer: true },
        { feature: 'Runs fully inside TradingView', traditional: false, timer: true },
    ],
    realLifeExamples: [
        { title: 'Case 1 – Buying at the Right Time', description: "Normally, you might buy Bitcoin every week no matter the price. With this bot, it waits until the price touches the lower Bollinger Band (a signal the price might be cheap) and—if you want—checks another indicator like RSI to confirm. Then it buys automatically. Over time, this results in better average prices and higher potential profits compared to basic DCA.." },
        { title: 'Case 2 – Buying More Only at Your Set Price Level', description: "Let’s say you usually buy 0.01 BTC each week. You set the bot so that if the price hits your chosen lower Bollinger Band, it increases that week’s buy to 0.02 BTC. This extra buy size only happens when the price reaches your set band, giving you a simple, rule-based way to grab more when prices are low. Over time, this strategy lowers your average cost and can increase profit potential compared to fixed-size DCA alone." }
    ],
    seoTitle: 'Bollinger Band DCA Bot - Automate Dip Buying',
    seoDescription: 'Automate your crypto trading with Bollinger Band strategies. Buy the dip automatically when prices hit lower bands.'
};

async function main() {
    console.log('Start seeding CMS content...');

    // Seed Categories
    for (const cat of pricingCategories) {
        await prisma.pricingCategory.upsert({
            where: { name: cat.name },
            update: { description: cat.description, sortOrder: cat.sortOrder },
            create: cat,
        });
    }
    console.log('Seeded Pricing Categories.');

    // Seed Bollinger Content
    await prisma.botContent.upsert({
        where: { slug: bollingerContent.slug },
        update: {
            heroTitle: bollingerContent.heroTitle,
            heroDescription: bollingerContent.heroDescription,
            whatIs: bollingerContent.whatIs,
            howItWorks: bollingerContent.howItWorks,
            features: bollingerContent.features,
            whoIsFor: bollingerContent.whoIsFor,
            comparison: bollingerContent.comparison,
            realLifeExamples: bollingerContent.realLifeExamples,
            seoTitle: bollingerContent.seoTitle,
            seoDescription: bollingerContent.seoDescription
        },
        create: bollingerContent,
    });
    console.log('Seeded Bollinger Bot Content.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
