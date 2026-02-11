"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';

const steps = [
    {
        number: 1,
        title: 'Market Monitoring',
        description: 'The bot continuously tracks price movement relative to the Bollinger Bands.',
        className: 'lg:col-span-1'
    },
    {
        number: 2,
        title: 'Dip Detection',
        description: 'When the price approaches or dips below your selected band threshold, the bot triggers a buy order.',
        className: 'lg:col-span-1'
    },
    {
        number: 3,
        title: 'Hybrid Mode',
        description: 'Optionally, keep your regular DCA schedule active while adding bonus buys during dips.',
        className: 'lg:col-span-1'
    },
    {
        number: 4,
        title: 'Flexible Order Sizing',
        description: 'Allocate larger orders during deeper dips for maximum impact.',
        className: 'lg:col-span-1'
    },
    {
        number: 5,
        title: 'Sell Conditions',
        description: 'You can configure the bot to take profits when prices hit the upper band or other specified levels.',
        className: 'lg:col-span-1'
    },
    {
        number: 6,
        title: 'Indicator Confirmation (Optional)',
        description: 'Add filters like RSI, MACD, or moving averages to confirm market conditions before executing a trade.',
        className: 'lg:col-span-1'
    }
];


const features = [
    {
        title: 'Precision Dip Buying',
        description: 'Enter the market at statistically low-price points for better value.'
    },
    {
        title: 'Customizable Bands & Settings',
        description: 'Choose your band threshold, order size, and frequency.'
    },
    {
        title: 'Better Average Entry',
        description: 'Reduce your cost per unit over time by capturing market dips.'
    },
    {
        title: 'Optional Signal Confirmation',
        description: 'Add extra confidence with your preferred indicators such as RSI, MACD, or MA Cross—plus the exclusive UnicornX Signal (Pro plan) for unmatched precision.'
    },
    {
        title: 'TradingView Integration',
        description: 'Build, backtest, and automate directly on TradingView.'
    }
];

const whoIsFor = [
    {
        title: 'Dip Hunters',
        description: 'You want to buy only when the market gives you a clear discount.'
    },
    {
        title: 'Value Investors',
        description: 'You aim to lower your average entry price and boost long-term returns.'
    },
    {
        title: 'Strategic DCA Users',
        description: 'You still like a fixed DCA schedule but want to enhance it with dip-based buys.'
    }
];

const comparisonData = [
    { feature: 'Fixed schedule buys', traditional: true, timer: true, timerLabel: '(with Hybrid Mode)' },
    { feature: 'Responds to volatility', traditional: false, timer: true },
    { feature: 'Targets dips at lower band', traditional: false, timer: true },
    { feature: 'Flexible order sizing', traditional: false, timer: true },
    { feature: 'Optional profit-taking at upper band', traditional: false, timer: true },
    { feature: 'Runs fully inside TradingView', traditional: false, timer: true },
];


export default function BollingerDCAPage() {
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content/bots/bollinger-dca');
                if (res.ok) {
                    const data = await res.json();
                    setContent(data);
                }
            } catch (error) {
                console.error('Error fetching bot content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    // Default fallbacks if content not found or still using some hardcoded parts
    const displayHeroTitle = content?.heroTitle || "Bollinger DCA";
    const displayHeroDesc = content?.heroDescription || "Buy the dip with volatility-based entry logic.";
    const displayCtaText = content?.ctaText || "Start Free Trial";
    const displayCtaLink = content?.ctaLink || "/register";

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
                            <span className="text-slate-600">Bollinger DCA</span>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 pt-10">
                            <div className="lg:w-5/12 space-y-5 z-10 relative pl-4 lg:pl-12">
                                <span className="inline-block px-3 py-1 bg-cyan-100/50 text-slate-800 rounded-full text-xs font-bold tracking-wide">
                                    UnicornX Bot
                                </span>
                                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#00C2CC] leading-tight tracking-tight">
                                    {displayHeroTitle}
                                </h1>
                                <p className="text-xl text-slate-800 font-normal max-w-lg leading-snug">
                                    {displayHeroDesc}
                                </p>
                                <div className="pt-4">
                                    <Link
                                        href={displayCtaLink}
                                        className="inline-block px-8 py-3 bg-[#00C2CC] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                    >
                                        {displayCtaText}
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-7/12 relative flex justify-center lg:justify-end">
                                <Image
                                    src={content?.heroImage || "/images/Bollinger DCA 1.png"}
                                    alt="Bollinger DCA Hero"
                                    width={600}
                                    height={600}
                                    className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </section>


                    {/* What is Bollinger DCA? */}
                    <section className="py-20 px-4">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">What is Bollinger DCA?</h2>
                            <p className="text-slate-600 leading-loose text-lg">
                                Bollinger DCA takes your Dollar-Cost Averaging strategy beyond fixed schedules by using a proven volatility indicator—Bollinger Bands—to identify statistically "cheap" prices. Instead of buying blindly at regular intervals, it waits for the price to approach or break below the lower band, signaling a potential dip, and executes your orders with precision.
                            </p>
                            <p className="text-slate-600 leading-loose text-lg">
                                You can also run it in hybrid mode: maintain your regular DCA schedule while adding extra buys when prices hit your chosen Bollinger Band level. This way, you consistently invest while capturing deep-value opportunities for better average entry prices.
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

                {/* Why Choose Bollinger DCA? */}
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
                                Why Choose<br />Bollinger DCA?
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
                        <div className="lg:w-1/2 relative">
                            <div className="relative w-full perspective-1000">
                                {/* Base Image (2) */}
                                <div className="relative z-0 transform transition-transform hover:scale-[1.02] duration-500">
                                    <Image
                                        src="/images/Bollinger DCA 2.png"
                                        alt="Bollinger Market View"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-contain rounded-2xl shadow-sm"
                                    />
                                </div>
                                {/* Overlay Image (3) */}
                                <div className="absolute inset-0 z-10 flex items-center justify-center translate-y-24">
                                    <Image
                                        src="/images/Bollinger DCA 3.png"
                                        alt="Bollinger Signals Overlay"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-contain drop-shadow-2xl"
                                    />
                                </div>
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
                                            src="/images/Bollinger DCA 4.png"
                                            alt="Chart Background"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    {/* Man Image (Front) */}
                                    <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-start">
                                        <Image
                                            src="/images/Bollinger DCA 5.png"
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
                                            href={displayCtaLink}
                                            className="inline-block w-full text-center px-12 py-4 bg-[#00C2CC] text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                        >
                                            {displayCtaText}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-Life Example */}
                <section className="bg-slate-50 pb-24 pt-0 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">Real-Life Example</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                            {/* Case 1 */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0B0F19]">Case 1 – Buying at the Right Time</h3>
                                <p className="text-slate-600 leading-loose text-lg">
                                    Normally, you might buy Bitcoin every week no matter the price. With this bot, it waits until the price touches the lower Bollinger Band (a signal the price might be cheap) and—if you want—checks another indicator like RSI to confirm. Then it buys automatically. Over time, this results in better average prices and higher potential profits compared to basic DCA..
                                </p>
                            </div>
                            {/* Case 2 */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0B0F19]">Case 2 – Buying More Only at Your Set Price Level</h3>
                                <p className="text-slate-600 leading-loose text-lg">
                                    Let’s say you usually buy 0.01 BTC each week. You set the bot so that if the price hits your chosen lower Bollinger Band, it increases that week’s buy to 0.02 BTC. This extra buy size only happens when the price reaches your set band, giving you a simple, rule-based way to grab more when prices are low. Over time, this strategy lowers your average cost and can increase profit potential compared to fixed-size DCA alone.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-20 px-4 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            Comparison
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            Traditional DCA & Bollinger DCA
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-50 py-6 px-6 border-b border-slate-200 font-bold text-slate-900">
                            <div className="col-span-6 md:col-span-6">Feature</div>
                            <div className="col-span-3 md:col-span-3 text-center text-slate-500">Traditional DCA</div>
                            <div className="col-span-3 md:col-span-3 text-center text-[#00C2CC]">Bollinger DCA</div>
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
                                    <div className="col-span-3 md:col-span-3 flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                        {/* @ts-ignore */}
                                        {row.timerLabel && (
                                            <span className="text-xs text-slate-500 font-medium hidden lg:inline-block">
                                                {row.timerLabel}
                                            </span>
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
