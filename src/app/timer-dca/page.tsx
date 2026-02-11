"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';
import { InlineEditProvider } from '@/components/inline-edit/InlineEditProvider';
import { EditableText } from '@/components/inline-edit/EditableText';
import { EditableImage } from '@/components/inline-edit/EditableImage';
import { EditableLink } from '@/components/inline-edit/EditableLink';
import { AdminToolbar } from '@/components/inline-edit/AdminToolbar';

const defaultSteps = [
    {
        title: 'Choose Your Schedule',
        description: 'Pick DCA frequency (daily, weekly, monthly).',
    },
    {
        title: 'Pre-Buy Check',
        description: 'Bot scans the market using RSI, MACD, or MA Cross.',
    },
    {
        title: 'Smart Execution',
        description: 'If conditions are right → buy executes. If not → bot waits.',
    },
    {
        title: 'No-Indicator Mode',
        description: 'Turn off checks for pure fixed-schedule DCA.',
    },
    {
        title: 'Flexible Order Sizing',
        description: 'Run DCA checks on multiple timeframes for smarter confirmation.',
    }
];

const defaultFeatures = [
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

const defaultWhoIsFor = [
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

const defaultComparisonData = [
    { feature: 'Fixed schedule buys', traditional: true, timer: true },
    { feature: 'Market cond filters (RSI, MACD, EMA Cross)', traditional: false, timer: true },
    { feature: 'Skip overbought entries', traditional: false, timer: true },
    { feature: 'Flexible order sizing', traditional: false, timer: true },
    { feature: 'Instant Exec (Testing) in TradingView', traditional: false, timer: true },
];

export default function TimerDCAPage() {
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content/bots/timer-dca');
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

    // Merge fetched content with defaults to ensure all fields exist
    // This allows InlineEditProvider to serve default values if DB is empty/partial
    const safeContent = {
        ...content,
        heroTitle: content?.heroTitle || "Timer DCA",
        heroDescription: content?.heroDescription || "Scheduled auto-investment with smart signals.",
        ctaText: content?.ctaText || "Start Free Trial",
        ctaLink: content?.ctaLink || "/register",
        whatIs: {
            title: content?.whatIs?.title || "What is Smart Timer DCA?",
            description: content?.whatIs?.description || "Smart Time-Based DCA upgrades the traditional fixed investment schedule—daily, weekly or monthly—by adding the power of real-time market analysis. Before each scheduled buy, the bot checks your chosen indicators (RSI, MACD, MA Cross, etc.) to confirm market conditions.\n\nIf signals match your criteria, the buy is placed automatically; if not, it can skip or wait until the conditions align. This keeps your DCA habit intact while targeting stronger entry points and improving long-term results. You can also disable indicator checks entirely if you want to stick to pure fixed-schedule DCA."
        },
        howItWorks: content?.howItWorks || defaultSteps,
        features: content?.features || defaultFeatures,
        featuresImage: content?.featuresImage || "/images/Timer DCA 2.png",
        whoIsFor: content?.whoIsFor || defaultWhoIsFor,
        whoIsForImage1: content?.whoIsForImage1 || "/images/Timer DCA 4.png",
        whoIsForImage2: content?.whoIsForImage2 || "/images/Timer DCA 5.png",
        realLifeExamples: content?.realLifeExamples || [{
            title: "Real-Life Example",
            description: "If you plan to buy Bitcoin every Monday, the bot first checks your indicators—say, RSI below 40 or a bullish MACD crossover. If it is true, it executes the buy as planned. If not, it waits until the conditions are met within the week. Over time, this leads to better average entry prices compared to blindly buying every Monday, increasing potential long-term gains."
        }],
        comparison: content?.comparison || defaultComparisonData
    };

    return (
        <InlineEditProvider
            initialData={safeContent}
            apiEndpoint="/api/content/bots/timer-dca"
            onSaveSuccess={(newData) => setContent(newData)}
        >
            <Navbar />
            <AdminToolbar />

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
                                <EditableText
                                    path="heroTitle"
                                    tagName="h1"
                                    className="text-5xl lg:text-6xl font-extrabold text-[#00C2CC] leading-tight tracking-tight"
                                    placeholder="Timer DCA"
                                />
                                <EditableText
                                    path="heroDescription"
                                    tagName="p"
                                    className="text-xl text-slate-800 font-normal max-w-lg leading-snug"
                                    placeholder="Scheduled auto-investment with smart signals."
                                />
                                <div className="pt-4">
                                    <EditableLink
                                        textPath="ctaText"
                                        hrefPath="ctaLink"
                                        className="inline-block px-8 py-3 bg-[#00C2CC] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-7/12 relative flex justify-center lg:justify-end">
                                <EditableImage
                                    path="heroImage"
                                    fallbackSrc="/images/timer-dca-hero-new.png"
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
                            <EditableText
                                path="whatIs.title"
                                tagName="h2"
                                className="text-4xl font-extrabold text-[#0B0F19]"
                                placeholder="What is Smart Timer DCA?"
                            />
                            <EditableText
                                path="whatIs.description"
                                tagName="p"
                                className="text-slate-600 leading-loose text-lg whitespace-pre-line"
                                placeholder={"Smart Time-Based DCA upgrades..."}
                            />
                        </div>
                    </section>
                </div>

                {/* How Does It Work? */}
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-[#0B0F19]">How Does It Work?</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {safeContent.howItWorks.map((step: any, idx: number) => {
                            const className = idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1';
                            return (
                                <div
                                    key={idx}
                                    className={`bg-white border-[1.5px] border-cyan-300 rounded-[2rem] p-8 relative overflow-hidden group hover:shadow-lg transition-shadow ${className}`}
                                    style={{
                                        backgroundImage: "url('/images/Timer DCA 6.png')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    <div className="relative z-10 flex flex-col h-full items-start">
                                        <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                                            <span className="text-3xl font-bold text-[#00C2CC]">{idx + 1}</span>
                                        </div>
                                        <EditableText
                                            path={`howItWorks[${idx}].title`}
                                            tagName="h3"
                                            className="text-xl font-bold text-[#0B0F19] mb-3"
                                            placeholder="Step Title"
                                        />
                                        <EditableText
                                            path={`howItWorks[${idx}].description`}
                                            tagName="p"
                                            className="text-slate-600 font-medium leading-relaxed"
                                            placeholder="Step Description"
                                        />
                                    </div>
                                </div>
                            );
                        })}
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
                                {safeContent.features.map((feature: any, idx: number) => (
                                    <div key={idx} className="group">
                                        <EditableText
                                            path={`features[${idx}].title`}
                                            tagName="h3"
                                            className="text-lg font-bold text-slate-900 mb-1"
                                            placeholder="Feature Title"
                                        />
                                        <EditableText
                                            path={`features[${idx}].description`}
                                            tagName="p"
                                            className="text-sm text-slate-600 leading-relaxed"
                                            placeholder="Feature Description"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <EditableImage
                                path="featuresImage"
                                fallbackSrc="/images/Timer DCA 2.png"
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
                                {/* Images Section - Maintaining Dual Image Structure as requested */}
                                <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center lg:justify-start">
                                    {/* Chart Image (Back) */}
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[90%] h-auto z-0 opacity-90">
                                        <EditableImage
                                            path="whoIsForImage1"
                                            fallbackSrc="/images/Timer DCA 4.png"
                                            alt="Chart Background"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    {/* Man Image (Front) */}
                                    <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-start">
                                        <EditableImage
                                            path="whoIsForImage2"
                                            fallbackSrc="/images/Timer DCA 5.png"
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
                                        {safeContent.whoIsFor.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-10 h-10 rounded-full bg-[#00C2CC] flex items-center justify-center shadow-md">
                                                        <Check className="w-5 h-5 text-white stroke-[3]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <EditableText
                                                        path={`whoIsFor[${idx}].title`}
                                                        tagName="h3"
                                                        className="font-bold text-[#0B0F19] text-lg"
                                                        placeholder="Title"
                                                    />
                                                    <EditableText
                                                        path={`whoIsFor[${idx}].description`}
                                                        tagName="p"
                                                        className="text-slate-600 text-base"
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <EditableLink
                                            textPath="ctaText"
                                            hrefPath="ctaLink"
                                            className="inline-block w-full text-center px-12 py-4 bg-[#00C2CC] text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-Life Example */}
                <section className="bg-slate-50 pb-24 pt-0 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <EditableText
                            path="realLifeExamples[0].title"
                            tagName="h2"
                            className="text-3xl font-extrabold text-[#0B0F19] mb-8"
                            placeholder="Real-Life Example"
                        />
                        <EditableText
                            path="realLifeExamples[0].description"
                            tagName="p"
                            className="text-slate-600 font-medium leading-loose text-lg max-w-4xl mx-auto whitespace-pre-line"
                            placeholder="Example description..."
                        />
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
                            {safeContent.comparison.map((row: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-12 py-4 px-6 items-center hover:bg-slate-50 transition-colors">
                                    <div className="col-span-6 md:col-span-8 text-sm font-semibold text-slate-900">
                                        <EditableText path={`comparison[${idx}].feature`} tagName="span" />
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
        </InlineEditProvider>
    );
}
