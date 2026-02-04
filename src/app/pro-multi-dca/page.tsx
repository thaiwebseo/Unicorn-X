"use client";

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';

const steps = [
    {
        number: 1,
        title: 'Buy in Multiple Stages',
        description: 'Place several safety orders, each with your own dip percentages and adjustable order sizes.',
        className: 'lg:col-span-6'
    },
    {
        number: 2,
        title: 'Smarter Triggers',
        description: 'Link each buy to indicators like RSI, MACD, or MA Cross for precision timing. Every indicator can be fully customized with your preferred timeframes, thresholds, and conditions.',
        className: 'lg:col-span-2'
    },
    {
        number: 3,
        title: 'Adaptive Order Sizing',
        description: 'Increase order size at deeper dips to maximize recovery potential, or scale down in high-risk market conditions.',
        className: 'lg:col-span-2'
    },
    {
        number: 4,
        title: 'Profit & Risk Protection',
        description: 'Secure profits with smart trailing stops, limit downside with stop-loss, and lower your average entry price through smart safety orders.',
        className: 'lg:col-span-2'
    }
];


const features = [
    {
        title: 'Pinpoint Entries',
        description: 'Spot the market\'s best buying opportunities with leading indicators like RSI, MACD, MA Cross, plus our exclusive UnicornX Signal (available in the Pro plan) for even greater accuracy.'
    },
    {
        title: 'Full Customization',
        description: 'Adjust dip levels, order sizes, indicators, and risk controls to fit your strategy.'
    },
    {
        title: 'Smart Profit Lock',
        description: 'Automatically trail your stop-loss as prices rise to lock in gains without limiting upside potential.'
    },
    {
        title: 'Advanced Risk Management',
        description: 'Use tools like Stop-Loss and Safety Orders to protect capital and lower your average entry price.'
    },
    {
        title: 'TradingView Integration',
        description: 'Build, backtest, and manage your strategies directly within the TradingView platform.'
    }
];

const whoIsFor = [
    {
        title: 'Proactive Traders',
        description: 'You want to invest based on what the market is actually doing, not a fixed schedule.'
    },
    {
        title: 'Data-Driven Investors',
        description: 'You prefer to use clear market signals to guide your investment decisions.'
    },
    {
        title: 'Strategic Investors',
        description: 'You want precision and flexibility to achieve better returns over time.'
    }
];

const comparisonData = [
    { feature: 'Fixed schedule buys', traditional: true, timer: false },
    { feature: 'Market signal checks', traditional: false, timer: true, note: '(RSI, MACD, MA Cross, UnicornX Signal)' },
    { feature: 'Volatility-based dip entries', traditional: false, timer: true },
    { feature: 'On-chain cycle awareness', traditional: false, timer: true },
    { feature: 'Flexible order sizing', traditional: false, timer: true, note: '(dynamic scaling by dip or risk)' },
    { feature: 'Safety orders (FO/SO)', traditional: false, timer: true },
    { feature: 'Profit-taking / trailing stops', traditional: false, timer: true },
    { feature: 'Risk management tools', traditional: false, timer: true, note: '(stop-loss, adaptive sizing, multi-stage buys)' },
    { feature: 'Runs fully inside TradingView', traditional: false, timer: true },
];

export default function ProMultiDCAPage() {
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
                            <span className="text-slate-600">Pro Multi-DCA</span>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 pt-10">
                            <div className="lg:w-5/12 space-y-5 z-10 relative pl-4 lg:pl-12">
                                <span className="inline-block px-3 py-1 bg-cyan-100/50 text-slate-800 rounded-full text-xs font-bold tracking-wide">
                                    UnicornX Bot
                                </span>
                                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#00C2CC] leading-tight tracking-tight">
                                    Pro Multi-DCA
                                </h1>
                                <p className="text-xl text-slate-800 font-normal max-w-lg leading-snug">
                                    Full-stack DCA engine with auto sizing & safety orders.
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
                                    src="/images/Pro Multi-DCA 1.png"
                                    alt="Pro Multi-DCA Hero"
                                    width={800}
                                    height={600}
                                    className="w-full max-w-md lg:max-w-2xl h-auto object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </section>

                    {/* What is Pro Multi-DCA? */}
                    <section className="py-20 px-4">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">What is Pro Multi-DCA?</h2>
                            <p className="text-slate-600 leading-loose text-lg">
                                The pinnacle of smart DCA trading. Pro Multi-DCA combines real-time market intelligence, advanced technical indicators, and fully customizable strategies to deliver precision entries, dynamic risk control, and maximum profitability. Perfect for traders who demand the very best.
                            </p>
                        </div>
                    </section>
                </div>

                {/* How Does It Work? */}
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-[#0B0F19]">How Does It Work?</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
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

                {/* Why Choose Pro Multi-DCA? */}
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
                                Why Choose<br />Pro Multi-DCA?
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
                        <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center lg:justify-end">
                            {/* Chart Image (Back) */}
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[90%] h-auto z-0">
                                <Image
                                    src="/images/Pro Multi-DCA 2.png"
                                    alt="Pro Multi-DCA Chart"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-contain rounded-xl shadow-lg"
                                />
                            </div>
                            {/* Overlay Image (Front) */}
                            <div className="relative z-10 w-[75%] -translate-x-12 translate-y-12">
                                <Image
                                    src="/images/Pro Multi-DCA 3.png"
                                    alt="Pro Multi-DCA Feature"
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-contain drop-shadow-2xl rounded-lg border border-white/20"
                                />
                            </div>
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
                                            src="/images/Pro Multi-DCA 4.png"
                                            alt="Chart Background"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    {/* Man Image (Front) */}
                                    <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-start">
                                        <Image
                                            src="/images/Pro Multi-DCA 5.png"
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
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-extrabold text-[#0B0F19] mb-8">Real-Life Example</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Instead of buying gold every month on a fixed schedule, the bot waits for strong buy signals—such as an oversold RSI and a bullish MACD crossover. When these signals align, it executes a precise buy automatically. You can even set larger orders when the dip is deeper. This approach improves your average entry price and boosts profit potential, because you're investing at moments when the market is in your favor—not just by the calendar.
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
                            Traditional DCA & Pro Multi-DCA
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-50 py-6 px-6 border-b border-slate-200 font-bold text-slate-900">
                            <div className="col-span-6 md:col-span-6">Feature</div>
                            <div className="col-span-3 md:col-span-3 text-center text-slate-500">Traditional DCA</div>
                            <div className="col-span-3 md:col-span-3 text-center text-[#00C2CC]">Pro Multi-DCA</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {comparisonData.map((row, idx) => (
                                <div key={idx} className="grid grid-cols-12 py-5 px-6 items-center hover:bg-slate-50 transition-colors">
                                    <div className="col-span-6 md:col-span-6 text-sm font-bold text-slate-900">
                                        {row.feature}
                                    </div>
                                    <div className="col-span-3 md:col-span-3 flex justify-center">
                                        {row.traditional ? (
                                            <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white stroke-[3]" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-3 md:col-span-3 flex justify-center items-center gap-2">
                                        {row.timer ? (
                                            <>
                                                <div className="w-6 h-6 flex-shrink-0 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white stroke-[3]" />
                                                </div>
                                                {/* @ts-ignore */}
                                                {row.note && (
                                                    <span className="text-[10px] md:text-xs font-medium text-slate-500 text-left leading-tight hidden md:block max-w-[120px]">
                                                        {/* @ts-ignore */}
                                                        {row.note}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
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
