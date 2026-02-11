import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const timerDcaContent = {
    slug: 'timer-dca',
    name: 'Smart Timer DCA',
    heroTitle: 'Timer DCA',
    heroDescription: 'Scheduled auto-investment with smart signals.',
    heroImage: '/images/timer-dca-hero-new.png',
    whatIs: {
        title: 'What is Smart Timer DCA?',
        description: 'Smart Time-Based DCA upgrades the traditional fixed investment schedule—daily, weekly or monthly—by adding the power of real-time market analysis. Before each scheduled buy, the bot checks your chosen indicators (RSI, MACD, MA Cross, etc.) to confirm market conditions. If signals match your criteria, the buy is placed automatically; if not, it can skip or wait until the conditions align. This keeps your DCA habit intact while targeting stronger entry points and improving long-term results. You can also disable indicator checks entirely if you want to stick to pure fixed-schedule DCA.'
    },
    howItWorks: [
        { number: 1, title: 'Choose Your Schedule', description: 'Pick DCA frequency (daily, weekly, monthly).' },
        { number: 2, title: 'Pre-Buy Check', description: 'Bot scans the market using RSI, MACD, or MA Cross.' },
        { number: 3, title: 'Smart Execution', description: 'If conditions are right → buy executes. If not → bot waits.' },
        { number: 4, title: 'No-Indicator Mode', description: 'Turn off checks for pure fixed-schedule DCA.' },
        { number: 5, title: 'Flexible Order Sizing', description: 'Run DCA checks on multiple timeframes for smarter confirmation.' }
    ],
    features: [
        { title: 'Keep Your DCA Habit', description: "Funding, saving, and discipline rules still apply, but entries are smarter. No more buying the exact top of the candle just because \"it's Monday morning\"." },
        { title: 'Optional Signal Filters', description: 'Add technical filters (RSI, MACD, EMA Cross, etc.) to skip buying if the market is extremely overbought or bearish.' },
        { title: 'Multi-Timeframe Support', description: 'Run DCA checks on 1h, 4h, or 1D frames for major trend confirmation.' },
        { title: 'Accumulate Unused Funds', description: 'Carry forward unused capital to the next cycle or reinvest at better price opportunities.' },
        { title: 'TradingView Integration', description: 'Automate trades directly via TradingView alerts.' }
    ],
    whoIsFor: [
        { title: 'Routine Investors', description: 'You want the discipline of scheduled investing.' },
        { title: 'Signal-Conscious Buyers', description: 'You prefer to buy only when conditions look favorable.' },
        { title: 'Adaptive Traders', description: 'You like the option to toggle between fixed-schedule and signal-filtered buying.' },
        { title: 'Long-Term Builders', description: 'You care about improving your average entry price over months and years.' }
    ],
    comparison: [
        { feature: 'Fixed schedule buys', traditional: true, timer: true },
        { feature: 'Market cond filters (RSI, MACD, EMA Cross)', traditional: false, timer: true },
        { feature: 'Skip overbought entries', traditional: false, timer: true },
        { feature: 'Flexible order sizing', traditional: false, timer: true },
        { feature: 'Instant Exec (Testing) in TradingView', traditional: false, timer: true }
    ],
    realLifeExamples: [
        { description: 'If you plan to buy Bitcoin every Monday, the bot first checks your indicators—say, RSI below 40 or a bullish MACD crossover. If it is true, it executes the buy as planned. If not, it waits until the conditions are met within the week. Over time, this leads to better average entry prices compared to blindly buying every Monday, increasing potential long-term gains.' }
    ],
    seoTitle: 'Smart Timer DCA Bot | UnicornX - Scheduled Auto-Investment with Smart Signals',
    seoDescription: 'Upgrade your fixed-schedule DCA with real-time market analysis. Timer DCA checks RSI, MACD, MA Cross before each buy for smarter entries.'
};

const mvrvCycleDcaContent = {
    slug: 'mvrv-cycle-dca',
    name: 'MVRV Cycle DCA',
    heroTitle: 'MVRV Cycle DCA',
    heroDescription: 'On-chain cycle-based DCA for long-term growth',
    heroImage: '/images/MVRV Cycle DCA 1.png',
    whatIs: {
        title: 'What is MVRV Cycle DCA?',
        description: 'MVRV Cycle DCA upgrades your regular investment schedule by adding on-chain market intelligence. You still buy on your chosen schedule—daily, weekly, or monthly—but the order size is automatically adjusted based on the MVRV ratio or MVRV Z-Score, proven on-chain metrics that reveal whether the market is undervalued or overvalued.',
        bullets: [
            'Bigger buys when the market is cheap.',
            "Smaller buys when it's expensive.",
            "Optional sells when it's overheated. You can also add technical indicators like RSI, MACD, MA cross etc. for extra confirmation before each trade."
        ]
    },
    howItWorks: [
        { number: 1, title: 'Choose Your Schedule', description: 'Daily, weekly, or monthly buy frequency.' },
        { number: 2, title: 'MVRV-Based Sizing', description: 'Deep Undervaluation: Larger buy size. Neutral Zone: Normal buy size. Overvaluation: Smaller buy or skip.' },
        { number: 3, title: 'Profit-Taking', description: 'Option to trigger partial or full sells in overvalued zones.' },
        { number: 4, title: 'Optional Indicator Filters', description: 'Add RSI, MACD, or MA cross to confirm before each buy/sell.' },
        { number: 5, title: 'Multi-Asset Support', description: 'Works with any asset that has reliable MVRV data (e.g., BTC, ETH).' }
    ],
    features: [
        { title: 'Regular Schedule + Smart Adjustments', description: 'Stay consistent while optimizing your allocations based on real market conditions.' },
        { title: 'Lower Risk Entries', description: 'Avoid heavy buys at market tops.' },
        { title: 'Smart Exits', description: 'Option to sell fully or partially when MVRV signals market overheating.' },
        { title: 'Flexible Rules', description: 'Adjust buy sizes, thresholds, and profit-taking levels to fit your risk profile.' },
        { title: 'Customizable Strategy', description: 'Optionally add indicators like RSI or MACD for more accurate entries—plus our exclusive UnicornX Signal (Pro plan) for unmatched precision.' },
        { title: 'TradingView Integration', description: 'Automate and manage directly on TradingView.' }
    ],
    whoIsFor: [
        { title: 'Disciplined Investors', description: 'You want a schedule but also want smarter allocation.' },
        { title: 'On-Chain Analysts', description: 'You value blockchain metrics in your investment decisions.' },
        { title: 'Strategic DCA Users', description: 'You want to optimize buy amounts without abandoning your regular plan.' }
    ],
    comparison: [
        { feature: 'Fixed schedule buys', traditional: true, timer: true },
        { feature: 'On-chain cycle awareness', traditional: false, timer: true },
        { feature: 'Adjusts buy size by valuation', traditional: false, timer: true },
        { feature: 'Skips/limits buys in overheated zones', traditional: false, timer: true },
        { feature: 'Optional profit-taking', traditional: false, timer: true },
        { feature: 'Runs fully inside TradingView', traditional: false, timer: true }
    ],
    realLifeExamples: [
        { description: 'If MVRV is deep in the undervalued zone, the bot buys 3× your base amount.' },
        { description: 'If MVRV is near neutral, it buys your normal amount.' },
        { description: 'If MVRV signals extreme overvaluation, it buys a smaller amount—or sells a portion of holdings.' }
    ],
    seoTitle: 'MVRV Cycle DCA Bot | UnicornX - On-Chain Cycle-Based DCA',
    seoDescription: 'Leverage on-chain MVRV data to optimize your DCA strategy. Buy more when markets are undervalued, less when overheated.'
};

const proMultiDcaContent = {
    slug: 'pro-multi-dca',
    name: 'Pro Multi-DCA (Ultimate DCA Max)',
    heroTitle: 'Pro Multi-DCA',
    heroDescription: 'Full-stack DCA engine with auto sizing & safety orders.',
    heroImage: '/images/Pro Multi-DCA 1.png',
    whatIs: {
        title: 'What is Pro Multi-DCA?',
        description: 'The pinnacle of smart DCA trading. Pro Multi-DCA combines real-time market intelligence, advanced technical indicators, and fully customizable strategies to deliver precision entries, dynamic risk control, and maximum profitability. Perfect for traders who demand the very best.'
    },
    howItWorks: [
        { number: 1, title: 'Buy in Multiple Stages', description: 'Place several safety orders, each with your own dip percentages and adjustable order sizes.' },
        { number: 2, title: 'Smarter Triggers', description: 'Link each buy to indicators like RSI, MACD, or MA Cross for precision timing. Every indicator can be fully customized with your preferred timeframes, thresholds, and conditions.' },
        { number: 3, title: 'Adaptive Order Sizing', description: 'Increase order size at deeper dips to maximize recovery potential, or scale down in high-risk market conditions.' },
        { number: 4, title: 'Profit & Risk Protection', description: 'Secure profits with smart trailing stops, limit downside with stop-loss, and lower your average entry price through smart safety orders.' }
    ],
    features: [
        { title: 'Pinpoint Entries', description: "Spot the market's best buying opportunities with leading indicators like RSI, MACD, MA Cross, plus our exclusive UnicornX Signal (available in the Pro plan) for even greater accuracy." },
        { title: 'Full Customization', description: 'Adjust dip levels, order sizes, indicators, and risk controls to fit your strategy.' },
        { title: 'Smart Profit Lock', description: 'Automatically trail your stop-loss as prices rise to lock in gains without limiting upside potential.' },
        { title: 'Advanced Risk Management', description: 'Use tools like Stop-Loss and Safety Orders to protect capital and lower your average entry price.' },
        { title: 'TradingView Integration', description: 'Build, backtest, and manage your strategies directly within the TradingView platform.' }
    ],
    whoIsFor: [
        { title: 'Proactive Traders', description: 'You want to invest based on what the market is actually doing, not a fixed schedule.' },
        { title: 'Data-Driven Investors', description: 'You prefer to use clear market signals to guide your investment decisions.' },
        { title: 'Strategic Investors', description: 'You want precision and flexibility to achieve better returns over time.' }
    ],
    comparison: [
        { feature: 'Fixed schedule buys', traditional: true, timer: false },
        { feature: 'Market signal checks (RSI, MACD, MA Cross, UnicornX Signal)', traditional: false, timer: true },
        { feature: 'Volatility-based dip entries', traditional: false, timer: true },
        { feature: 'On-chain cycle awareness', traditional: false, timer: true },
        { feature: 'Flexible order sizing (dynamic scaling by dip or risk)', traditional: false, timer: true },
        { feature: 'Safety orders (FO/SO)', traditional: false, timer: true },
        { feature: 'Profit-taking / trailing stops', traditional: false, timer: true },
        { feature: 'Risk management tools (stop-loss, adaptive sizing, multi-stage buys)', traditional: false, timer: true },
        { feature: 'Runs fully inside TradingView', traditional: false, timer: true }
    ],
    realLifeExamples: [
        { description: 'Instead of buying gold every month on a fixed schedule, the bot waits for strong buy signals—such as an oversold RSI and a bullish MACD crossover. When these signals align, it executes a precise buy automatically. You can even set larger orders when the dip is deeper. This approach improves your average entry price and boosts profit potential, because you\'re investing at moments when the market is in your favor—not just by the calendar.' }
    ],
    seoTitle: 'Pro Multi-DCA Bot | UnicornX - Ultimate DCA Engine with Safety Orders',
    seoDescription: 'The most advanced DCA bot with safety orders, trailing stops, multi-stage entries, and full TradingView integration.'
};

async function main() {
    console.log('Seeding remaining bot content pages...');

    const bots = [timerDcaContent, mvrvCycleDcaContent, proMultiDcaContent];

    for (const bot of bots) {
        await prisma.botContent.upsert({
            where: { slug: bot.slug },
            update: {
                name: bot.name,
                heroTitle: bot.heroTitle,
                heroDescription: bot.heroDescription,
                heroImage: bot.heroImage,
                whatIs: bot.whatIs,
                howItWorks: bot.howItWorks,
                features: bot.features,
                whoIsFor: bot.whoIsFor,
                comparison: bot.comparison,
                realLifeExamples: bot.realLifeExamples,
                seoTitle: bot.seoTitle,
                seoDescription: bot.seoDescription
            },
            create: bot
        });
        console.log(`  ✅ Seeded: ${bot.name} (/${bot.slug})`);
    }

    console.log('Done! All bot pages seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
