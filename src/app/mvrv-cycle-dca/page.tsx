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
        title: 'Choose Your Schedule',
        description: 'Daily, weekly, or monthly buy frequency.',
        className: 'lg:col-span-3'
    },
    {
        number: 2,
        title: 'MVRV-Based Sizing',
        bullets: [
            'Deep Undervaluation: Larger buy size.',
            'Neutral Zone: Normal buy size.',
            'Overvaluation: Smaller buy or skip.'
        ],
        className: 'lg:col-span-3'
    },
    {
        number: 3,
        title: 'Profit-Taking',
        description: 'Option to trigger partial or full sells in overvalued zones.',
        className: 'lg:col-span-2'
    },
    {
        number: 4,
        title: 'Optional Indicator Filters',
        description: 'Add RSI, MACD, or MA cross to confirm before each buy/sell.',
        className: 'lg:col-span-2'
    },
    {
        number: 5,
        title: 'Multi-Asset Support',
        description: 'Works with any asset that has reliable MVRV data (e.g., BTC, ETH).',
        className: 'lg:col-span-2'
    }
];


const features = [
    {
        title: 'Regular Schedule + Smart Adjustments',
        description: 'Stay consistent while optimizing your allocations based on real market conditions.'
    },
    {
        title: 'Lower Risk Entries',
        description: 'Avoid heavy buys at market tops.'
    },
    {
        title: 'Smart Exits',
        description: 'Option to sell fully or partially when MVRV signals market overheating.'
    },
    {
        title: 'Flexible Rules',
        description: 'Adjust buy sizes, thresholds, and profit-taking levels to fit your risk profile.'
    },
    {
        title: 'Customizable Strategy',
        description: 'Optionally add indicators like RSI or MACD for more accurate entries—plus our exclusive UnicornX Signal (Pro plan) for unmatched precision.'
    },
    {
        title: 'TradingView Integration',
        description: 'Automate and manage directly on TradingView.'
    }
];

const whoIsFor = [
    {
        title: 'Disciplined Investors',
        description: 'You want a schedule but also want smarter allocation.'
    },
    {
        title: 'On-Chain Analysts',
        description: 'You value blockchain metrics in your investment decisions.'
    },
    {
        title: 'Strategic DCA Users',
        description: 'You want to optimize buy amounts without abandoning your regular plan.'
    }
];

const comparisonData = [
    { feature: 'Fixed schedule buys', traditional: true, timer: true },
    { feature: 'On-chain cycle awareness', traditional: false, timer: true },
    { feature: 'Adjusts buy size by valuation', traditional: false, timer: true },
    { feature: 'Skips/limits buys in overheated zones', traditional: false, timer: true },
    { feature: 'Optional profit-taking', traditional: false, timer: true },
    { feature: 'Runs fully inside TradingView', traditional: false, timer: true },
];

export default function MvrvCycleDCAPage() {
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content/bots/mvrv-cycle-dca');
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

    const displayHeroTitle = content?.heroTitle || "MVRV Cycle DCA";
    const displayHeroDesc = content?.heroDescription || "On-chain cycle-based DCA for long-term growth";
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
                            <span className="text-slate-600">MVRV Cycle DCA</span>
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
                                    src={content?.heroImage || "/images/MVRV Cycle DCA 1.png"}
                                    alt="MVRV Cycle DCA Hero"
                                    width={800}
                                    height={600}
                                    className="w-full max-w-md lg:max-w-2xl h-auto object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </section>

                    {/* What is MVRV Cycle DCA? */}
                    <section className="py-20 px-4">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">What is MVRV Cycle DCA?</h2>
                            <p className="text-slate-600 leading-loose text-lg">
                                MVRV Cycle DCA upgrades your regular investment schedule by adding on-chain market intelligence. You still buy on your chosen schedule—daily, weekly, or monthly—but the order size is automatically adjusted based on the MVRV ratio or MVRV Z-Score, proven on-chain metrics that reveal whether the market is undervalued or overvalued.
                            </p>

                            <div className="mt-12">
                                <h3 className="text-lg font-extrabold text-[#0B0F19] mb-8 uppercase tracking-wide">This means:</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex-shrink-0 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                        <span className="text-slate-800 font-bold text-base">Bigger buys when the market is cheap.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex-shrink-0 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                        <span className="text-slate-800 font-bold text-base">Smaller buys when it's expensive.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex-shrink-0 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                        <span className="text-slate-800 font-bold text-base">
                                            Optional sells when it's overheated. You can also add technical indicators like RSI, MACD, MA cross etc. for extra confirmation before each trade.
                                        </span>
                                    </div>
                                </div>
                            </div>
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
                                    {/* @ts-ignore */}
                                    {step.bullets ? (
                                        <ul className="text-slate-600 font-medium leading-relaxed list-disc list-inside space-y-1">
                                            {/* @ts-ignore */}
                                            {step.bullets.map((bullet, idx) => (
                                                <li key={idx}>{bullet}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-600 font-medium leading-relaxed">{step.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose MVRV Cycle DCA? */}
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

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="mb-16">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19] leading-tight">
                                Why Choose<br />MVRV Cycle DCA?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                            {features.map((feature, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="text-xl font-bold text-[#0B0F19]">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
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
                                            src="/images/MVRV Cycle DCA 2.png"
                                            alt="Chart Background"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    {/* Man Image (Front) */}
                                    <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-start">
                                        <Image
                                            src="/images/MVRV Cycle DCA 3.png"
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
                            <h2 className="text-4xl font-extrabold text-[#0B0F19] mb-4">Real-Life Example</h2>
                            <p className="text-slate-600 text-lg font-medium">You set a weekly buy every Monday.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-center min-h-[160px]">
                                <p className="text-[#0B0F19] font-bold text-lg leading-snug">
                                    If MVRV is deep in the undervalued zone, the bot buys 3× your base amount.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-center min-h-[160px]">
                                <p className="text-[#0B0F19] font-bold text-lg leading-snug">
                                    If MVRV is near neutral, it buys your normal amount.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-center min-h-[160px]">
                                <p className="text-[#0B0F19] font-bold text-lg leading-snug">
                                    If MVRV signals extreme overvaluation, it buys a smaller amount—or sells a portion of holdings.
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-600 font-medium text-sm lg:text-base">
                                Add RSI confirmation to filter out weak signals, so every move is backed by both on-chain and technical strength.
                            </p>
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
                            Traditional DCA & MVRV Cycle DCA
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-50 py-6 px-6 border-b border-slate-200 font-bold text-slate-900">
                            <div className="col-span-6 md:col-span-6">Feature</div>
                            <div className="col-span-3 md:col-span-3 text-center text-slate-500">Traditional DCA</div>
                            <div className="col-span-3 md:col-span-3 text-center text-[#00C2CC]">MVRV Cycle DCA</div>
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
                                    <div className="col-span-3 md:col-span-3 flex justify-center">
                                        {row.timer ? (
                                            <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white stroke-[3]" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
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
