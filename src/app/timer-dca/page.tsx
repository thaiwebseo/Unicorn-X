"use client";

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';

const steps = [
    {
        number: 1,
        title: 'Choose Your Schedule',
        description: 'Pick DCA frequency (daily, weekly, monthly).',
        className: 'lg:col-span-2'
    },
    {
        number: 2,
        title: 'Pre-Buy Check',
        description: 'Bot scans the market using RSI, MACD, or MA Cross.',
        className: 'lg:col-span-1'
    },
    {
        number: 3,
        title: 'Smart Execution',
        description: 'If conditions are right → buy executes. If not → bot waits.',
        className: 'lg:col-span-1'
    },
    {
        number: 4,
        title: 'No-Indicator Mode',
        description: 'Turn off checks for pure fixed-schedule DCA.',
        className: 'lg:col-span-1'
    },
    {
        number: 5,
        title: 'Flexible Order Sizing',
        description: 'Run DCA checks on multiple timeframes for smarter confirmation.',
        className: 'lg:col-span-1'
    }
];


const features = [
    {
        title: 'Keep Your DCA Habit',
        description: 'Funding, saving, and discipline rules still apply, but entries are smarter. No more buying the exact top of the candle just because "it\'s Monday morning".'
    },
    {
        title: 'Optional Signal Filters',
        description: 'Add technical filters (RSI, MACD, EMA Cross, etc.) to skip buying if the market is extremely overbought or bearish.'
    },
    {
        title: 'Multi-Timeframe Support',
        description: 'Run DCA checks on 1h, 4h, or 1D frames for major trend confirmation.'
    },
    {
        title: 'Accumulate Unused Funds',
        description: 'Carry forward unused capital to the next cycle or reinvest at better price opportunities.'
    },
    {
        title: 'TradingView Integration',
        description: 'Automate trades directly via TradingView alerts.'
    }
];

const whoIsFor = [
    {
        title: 'Routine Investors',
        description: 'You want the discipline of scheduled investing.'
    },
    {
        title: 'Signal-Conscious Buyers',
        description: 'You prefer to buy only when conditions look favorable.'
    },
    {
        title: 'Adaptive Traders',
        description: 'You like the option to toggle between fixed-schedule and signal-filtered buying.'
    },
    {
        title: 'Long-Term Builders',
        description: 'You care about improving your average entry price over months and years.'
    }
];

const comparisonData = [
    { feature: 'Fixed schedule buys', traditional: true, timer: true },
    { feature: 'Market cond filters (RSI, MACD, EMA Cross)', traditional: false, timer: true },
    { feature: 'Skip overbought entries', traditional: false, timer: true },
    { feature: 'Flexible order sizing', traditional: false, timer: true },
    { feature: 'Instant Exec (Testing) in TradingView', traditional: false, timer: true },
];

export default function TimerDCAPage() {
    return (
        <>
            <Navbar />
            <main className="bg-white">
                {/* Unified Background for Hero and What is Section */}
                <div className="bg-[#F8F9FB]">
                    {/* Hero Section */}
                    <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">

                        {/* Breadcrumb */}
                        <div className="absolute top-24 left-4 sm:left-6 lg:left-8 text-sm text-cyan-500 font-medium z-20">
                            <Link href="/" className="hover:underline">Home</Link>
                            <span className="mx-2 text-slate-400">/</span>
                            <span className="text-slate-600">Timer DCA</span>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 pt-10">
                            <div className="lg:w-5/12 space-y-5 z-10 relative pl-4 lg:pl-12">
                                <span className="inline-block px-3 py-1 bg-cyan-100/50 text-slate-800 rounded-full text-xs font-bold tracking-wide">
                                    UnicornX Bot
                                </span>
                                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#00C2CC] leading-tight tracking-tight">
                                    Timer DCA
                                </h1>
                                <p className="text-xl text-slate-800 font-normal max-w-lg leading-snug">
                                    Scheduled auto-investment with smart signals.
                                </p>
                                <div className="pt-4">
                                    <Link
                                        href="/register"
                                        className="inline-block px-8 py-3 bg-[#00C2CC] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                    >
                                        Start Free Trial
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-7/12 relative flex justify-center lg:justify-end">
                                <Image
                                    src="/images/timer-dca-hero-new.png"
                                    alt="Timer DCA Hero"
                                    width={600}
                                    height={600}
                                    className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </section>

                    {/* What is Smart Timer DCA? */}
                    <section className="py-20 px-4">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">What is Smart Timer DCA?</h2>
                            <p className="text-slate-600 leading-loose text-lg">
                                Smart Time-Based DCA upgrades the traditional fixed investment schedule—daily, weekly or monthly—by adding the power of real-time market analysis. Before each scheduled buy, the bot checks your chosen indicators (RSI, MACD, MA Cross, etc.) to confirm market conditions.
                                If signals match your criteria, the buy is placed automatically; if not, it can skip or wait until the conditions align. This keeps your DCA habit intact while targeting stronger entry points and improving long-term results. You can also disable indicator checks entirely if you want to stick to pure fixed-schedule DCA.
                            </p>
                        </div>
                    </section>
                </div>

                {/* How Does It Work? */}
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-[#0B0F19]">How Does It Work?</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className={`bg-white border-[1.5px] border-cyan-300 rounded-[2rem] p-8 relative overflow-hidden group hover:shadow-lg transition-shadow ${step.className || ''}`}
                                style={{
                                    backgroundImage: "url('/images/Timer DCA 6.png')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                <div className="relative z-10 flex flex-col h-full items-start">
                                    <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                                        <span className="text-3xl font-bold text-[#00C2CC]">{step.number}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0B0F19] mb-3">{step.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Timer DCA? */}
                <section className="relative py-24 px-4 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/BG product.png"
                            alt="Background"
                            fill
                            className="object-cover object-center opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/80"></div>
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl font-extrabold text-slate-900">
                                Why Choose<br />Timer DCA?
                            </h2>
                            <div className="space-y-6">
                                {features.map((feature, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <Image
                                src="/images/Timer DCA 2.png"
                                alt="Why Choose Timer DCA Chart"
                                width={800}
                                height={600}
                                className="w-full h-auto rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </section>

                {/* Who is This Bot For? */}
                <section className="bg-slate-50 py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">Who is This Bot For?</h2>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                                {/* Images Section */}
                                <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center lg:justify-start">
                                    {/* Chart Image (Back) */}
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[90%] h-auto z-0 opacity-90">
                                        <Image
                                            src="/images/Timer DCA 4.png"
                                            alt="Chart Background"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    {/* Man Image (Front) */}
                                    <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-start">
                                        <Image
                                            src="/images/Timer DCA 5.png"
                                            alt="Persona"
                                            width={500}
                                            height={700}
                                            className="w-auto h-[110%] object-contain -mb-12"
                                        />
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="lg:w-1/2 space-y-8 z-10">
                                    <div className="space-y-6">
                                        {whoIsFor.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-10 h-10 rounded-full bg-[#00C2CC] flex items-center justify-center shadow-md">
                                                        <Check className="w-5 h-5 text-white stroke-[3]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0B0F19] text-lg">{item.title}</h3>
                                                    <p className="text-slate-600 text-base">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <Link
                                            href="/register"
                                            className="inline-block w-full text-center px-12 py-4 bg-[#00C2CC] text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                        >
                                            Start Free Trial
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-Life Example */}
                <section className="bg-slate-50 pb-24 pt-0 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-[#0B0F19] mb-8">Real-Life Example</h2>
                        <p className="text-slate-600 font-medium leading-loose text-lg max-w-4xl mx-auto">
                            If you plan to buy Bitcoin every Monday, the bot first checks your indicators—say, RSI below 40 or a bullish MACD crossover. If it is true, it executes the buy as planned. If not, it waits until the conditions are met within the week. Over time, this leads to better average entry prices compared to blindly buying every Monday, increasing potential long-term gains.
                        </p>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-20 px-4 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            Comparison
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            Traditional DCA & Timer DCA
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-50 py-4 px-6 border-b border-slate-200 font-bold text-slate-900">
                            <div className="col-span-6 md:col-span-8">Feature</div>
                            <div className="col-span-3 md:col-span-2 text-center text-slate-500">Traditional DCA</div>
                            <div className="col-span-3 md:col-span-2 text-center text-cyan-600">Timer DCA</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {comparisonData.map((row, idx) => (
                                <div key={idx} className="grid grid-cols-12 py-4 px-6 items-center hover:bg-slate-50 transition-colors">
                                    <div className="col-span-6 md:col-span-8 text-sm font-semibold text-slate-900">
                                        {row.feature}
                                    </div>
                                    <div className="col-span-3 md:col-span-2 flex justify-center">
                                        {row.traditional ? (
                                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            /* Note: UI shows checkmarks for both but maybe different colors or 'X'? 
                                               Looking at the UI image, it seems Traditional DCA has grey checkmarks and Timer DCA has cyan checkmarks 
                                               Or maybe 'X' for unsupported.
                                               Let's look at the UI closer. 
                                               Traditional DCA has some items unchecked/greyed out?
                                               Actually the UI shows: 
                                               Feature | Traditional DCA | Timer DCA
                                               Fixed schedule buys | (cyan check) | (cyan check)
                                               The rest traditional has (grey check) or maybe empty circle?
                                               Let's use Grey Check for Traditional "No" (or X) and Cyan Check for Timer "Yes".
                                               Wait, usually comparison shows what is supported.
                                               If Traditional DOES NOT have "Market cond filters", it should be X or empty.
                                               The UI shows ticks for Timer DCA on all.
                                               For Traditional, it seems to have grey ticks on the first one, and grey "empty" circles on others?
                                               Let's implement logic: if true -> Cyan Check. If false -> Grey Circle.
                                            */
                                        )}
                                    </div>
                                    <div className="col-span-3 md:col-span-2 flex justify-center">
                                        {row.timer ? (
                                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                <X className="w-4 h-4 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}
