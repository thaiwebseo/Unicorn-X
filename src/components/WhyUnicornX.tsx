"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Check, X, ChevronDown, Star, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

// Comparison data
const comparisonData = {
    entryLogic: {
        title: "Entry Logic",
        features: [
            { name: "Fixed schedule buys", traditional: true, unicornx: true },
            { name: "Signal-based entries (RSI, MACD, MA, OBV)", traditional: false, unicornx: true },
            { name: "Volatility-aware dips (Bollinger Bands)", traditional: false, unicornx: true },
            { name: "On-chain cycle awareness (MVRV)", traditional: false, unicornx: true },
            { name: "UnicornX proprietary signals", traditional: false, unicornx: true },
            { name: "Multi-timeframe signal filter", traditional: false, unicornx: true },
        ]
    },
    orderControl: {
        title: "Order Control",
        features: [
            { name: "Basic buy orders", traditional: true, unicornx: true },
            { name: "Safety orders on dips", traditional: false, unicornx: true },
            { name: "Dynamic position sizing", traditional: false, unicornx: true },
        ]
    },
    profitRisk: {
        title: "Profit & Risk",
        features: [
            { name: "Manual take profit", traditional: true, unicornx: true },
            { name: "Trailing take profit", traditional: false, unicornx: true },
            { name: "Multi-level TP", traditional: false, unicornx: true },
        ]
    },
    automation: {
        title: "Automation & Platform",
        features: [
            { name: "Runs in TradingView", traditional: false, unicornx: true },
            { name: "Cloud execution 24/7", traditional: false, unicornx: true },
            { name: "Binance + OKX support", traditional: false, unicornx: true },
        ]
    }
};

type CategoryKey = keyof typeof comparisonData;

const WhyUnicornX = () => {
    const [openCategory, setOpenCategory] = useState<CategoryKey | null>('entryLogic');

    const toggleCategory = (key: CategoryKey) => {
        setOpenCategory(openCategory === key ? null : key);
    };

    return (
        <section id="why-unicornx" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900">Why <span className="text-cyan-600">UnicornX</span></h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Traditional DCA builds discipline. UnicornX adds intelligence.
                    </p>
                </div>

                {/* Top Section: Text + Image */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">DCA works because it removes emotion.</h3>
                            <p className="text-slate-600">
                                UnicornX keeps that discipline and upgrades it with market context, execution logic, and risk management.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">You still invest on schedule.</h3>
                            <p className="text-slate-600">
                                But now your entries avoid expensive moments, your exits react to trend shifts, and your capital compounds smarter over time. No guessing. No manual checking. Everything runs directly inside TradingView.
                            </p>
                        </div>
                        <p className="text-slate-800 font-medium">
                            Consistent habit → optimized with signal-based logic.
                        </p>
                        <Link href="/register" className="inline-block px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors">
                            Start Free Trial - 7 Days Free
                        </Link>
                    </div>
                    <div className="relative">
                        <Image
                            src="/images/why-unicornx.png"
                            alt="UnicornX Trading Charts"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-xl shadow-lg"
                        />
                    </div>
                </div>

                {/* Comparison Table Header */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Traditional DCA vs UnicornX Smart DCA</h3>
                    <div className="mt-2 flex items-center justify-center gap-4 text-sm">
                        <span className="flex items-center"><Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" /> 4.9 (5,000+ traders)</span>
                        <span className="text-cyan-600 font-semibold">+22% better entry</span>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-600">
                        <span>Category/Feature</span>
                        <span className="text-center">Traditional DCA</span>
                        <span className="text-center text-cyan-600">UnicornX</span>
                    </div>

                    {/* Accordion Categories */}
                    {(Object.keys(comparisonData) as CategoryKey[]).map((key) => {
                        const category = comparisonData[key];
                        const isOpen = openCategory === key;
                        return (
                            <div key={key} className="border-b border-slate-200 last:border-b-0">
                                <button
                                    onClick={() => toggleCategory(key)}
                                    className="w-full grid grid-cols-3 gap-4 p-4 items-center text-left hover:bg-slate-100 transition-colors"
                                >
                                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                                        {isOpen ? <Minus className="h-4 w-4 text-cyan-600" /> : <Plus className="h-4 w-4 text-cyan-600" />}
                                        {category.title}
                                    </span>
                                    <span></span>
                                    <span></span>
                                </button>
                                {isOpen && (
                                    <div className="bg-white">
                                        {category.features.map((feature, idx) => (
                                            <div key={idx} className="grid grid-cols-3 gap-4 p-4 pl-10 border-t border-slate-100 text-sm">
                                                <span className="text-slate-700">{feature.name}</span>
                                                <span className="flex justify-center">
                                                    {feature.traditional ? <Check className="h-5 w-5 text-cyan-500" /> : <X className="h-5 w-5 text-slate-300" />}
                                                </span>
                                                <span className="flex justify-center">
                                                    {feature.unicornx ? <Check className="h-5 w-5 text-cyan-500" /> : <X className="h-5 w-5 text-slate-300" />}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default WhyUnicornX;
