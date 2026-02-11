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
        number: 1,
        title: 'Buy in Multiple Stages',
        description: 'Place several safety orders, each with your own dip percentages and adjustable order sizes.',
        className: 'lg:col-span-3'
    },
    {
        number: 2,
        title: 'Smarter Triggers',
        description: 'Link each buy to indicators like RSI, MACD, or MA Cross for precision timing. Every indicator can be fully customized with your preferred timeframes, thresholds, and conditions.',
        className: 'lg:col-span-1'
    },
    {
        number: 3,
        title: 'Adaptive Order Sizing',
        description: 'Increase order size at deeper dips to maximize recovery potential, or scale down in high-risk market conditions.',
        className: 'lg:col-span-1'
    },
    {
        number: 4,
        title: 'Profit & Risk Protection',
        description: 'Secure profits with smart trailing stops, limit downside with stop-loss, and lower your average entry price through smart safety orders.',
        className: 'lg:col-span-1'
    }
];

const defaultFeatures = [
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

const defaultWhoIsFor = [
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

const defaultComparisonData = [
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
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content/bots/pro-multi-dca');
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

    const safeContent = {
        ...content,
        heroTitle: content?.heroTitle || "Pro Multi-DCA",
        heroDescription: content?.heroDescription || "Full-stack DCA engine with auto sizing & safety orders.",
        ctaText: content?.ctaText || "Start Free Trial",
        ctaLink: content?.ctaLink || "/register",
        whatIs: {
            title: content?.whatIs?.title || "What is Pro Multi-DCA?",
            description: content?.whatIs?.description || "The pinnacle of smart DCA trading. Pro Multi-DCA combines real-time market intelligence, advanced technical indicators, and fully customizable strategies to deliver precision entries, dynamic risk control, and maximum profitability. Perfect for traders who demand the very best."
        },
        howItWorks: content?.howItWorks || defaultSteps,
        features: content?.features || defaultFeatures,
        whoIsFor: content?.whoIsFor || defaultWhoIsFor,
        comparison: content?.comparison || defaultComparisonData,
        // Images
        heroImage: content?.heroImage || "/images/Pro Multi-DCA 1.png",
        featuresImage: content?.featuresImage || "/images/Pro Multi-DCA.png",
        whoIsForImage1: content?.whoIsForImage1 || "/images/Pro Multi-DCA 4.png", // Back
        whoIsForImage2: content?.whoIsForImage2 || "/images/Pro Multi-DCA 5.png", // Front
    };

    return (
        <InlineEditProvider
            initialData={safeContent}
            apiEndpoint="/api/content/bots/pro-multi-dca"
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
                            <span className="text-slate-600">Pro Multi-DCA</span>
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
                                    placeholder="Bot Name"
                                />
                                <EditableText
                                    path="heroDescription"
                                    tagName="p"
                                    className="text-xl text-slate-800 font-normal max-w-lg leading-snug"
                                    placeholder="Bot Description"
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
                                    fallbackSrc="/images/Pro Multi-DCA 1.png"
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
                            <EditableText
                                path="whatIs.title"
                                tagName="h2"
                                className="text-4xl font-extrabold text-[#0B0F19]"
                                placeholder="Section Title"
                            />
                            <EditableText
                                path="whatIs.description"
                                tagName="p"
                                className="text-slate-600 leading-loose text-lg"
                                placeholder="Description"
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
                        {safeContent.howItWorks.map((step: any, idx: number) => (
                            <div
                                key={idx}
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
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0B0F19] leading-tight">
                                Why Choose<br />Pro Multi-DCA?
                            </h2>
                            <div className="space-y-6">
                                {safeContent.features.map((feature: any, idx: number) => (
                                    <div key={idx}>
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
                                fallbackSrc="/images/Pro Multi-DCA.png"
                                alt="Why Choose Pro Multi-DCA Chart"
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
                                        <EditableImage
                                            path="whoIsForImage1"
                                            fallbackSrc="/images/Pro Multi-DCA 4.png"
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
                                            fallbackSrc="/images/Pro Multi-DCA 5.png"
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

                {/* Comparison Table */}
                <section className="py-24 px-4 bg-slate-50/50">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <div className="inline-block px-4 py-1.5 bg-cyan-100/50 text-cyan-600 rounded-full text-sm font-bold border border-cyan-100 mb-2">
                                Comparison
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-[#0B0F19]">Traditional DCA & Pro Multi-DCA</h2>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="p-8 text-lg font-bold text-slate-400 w-1/3">Feature</th>
                                        <th className="p-8 text-lg font-bold text-slate-800 text-center w-1/3 border-l border-slate-100">Traditional DCA</th>
                                        <th className="p-8 text-lg font-bold text-cyan-500 text-center w-1/3 border-l border-slate-100">Pro Multi-DCA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeContent.comparison.map((row: any, idx: number) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-8 font-extrabold text-[#0B0F19] text-lg">
                                                <EditableText path={`comparison[${idx}].feature`} tagName="span" />
                                            </td>
                                            <td className="p-8 text-center border-l border-slate-100">
                                                <div className="flex items-center justify-center">
                                                    {row.traditional ? (
                                                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-sm">
                                                            <Check className="w-5 h-5 text-white stroke-[3px]" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-slate-300 stroke-[3px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-8 text-center bg-cyan-50/5 border-l border-slate-100">
                                                <div className="flex items-center gap-4 justify-center">
                                                    {row.timer ? (
                                                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-sm flex-shrink-0">
                                                            <Check className="w-5 h-5 text-white stroke-[3px]" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-5 h-5 text-slate-300 stroke-[3px]" />
                                                        </div>
                                                    )}
                                                    {/* Optional Note - Editable if it exists or we want to allow adding it? 
                                                        For now, render if exists. Making it editable might be tricky if it doesn't exist initially.
                                                        But EditableText handles empty/missing paths gracefully if we provide one.
                                                        Let's assume row.note is editable.
                                                    */}
                                                    <div className="text-xs text-slate-600 font-bold text-left max-w-[150px] leading-tight">
                                                        <EditableText
                                                            path={`comparison[${idx}].note`}
                                                            tagName="span"
                                                            placeholder={row.note ? "" : "Add note..."}
                                                            className="min-w-[50px] inline-block" // Ensure clickable area if empty
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>


            </main>
            <Footer />
        </InlineEditProvider>
    );
}
