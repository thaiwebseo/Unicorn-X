"use client";

import Image from 'next/image';
import Link from 'next/link';

const features = [
    {
        icon: '/images/Advanced-Indicators-Filters.png',
        title: 'Advanced Indicators & Filters',
        description: 'RSI, MACD, MA Cross, OBV, Bollinger Bands, MVRV Z-Score — plus the exclusive UnicornX Signal. Fully customizable: set parameters, timeframes, and conditions to match your edge.'
    },
    {
        icon: '/images/Customizable-Strategies-Risk-Control.png',
        title: 'Customizable Strategies & Risk Control',
        description: 'Define dip levels, safety orders, position sizing, take-profits, and stop-losses. Full flexibility to shape risk/reward exactly as you want.'
    },
    {
        icon: '/images/Powerful-Backtesting.png',
        title: 'Powerful Backtesting (No Repaint)',
        description: 'Run strategies on complete historical data right inside TradingView. What you test is what you trade — no repaint, no guesswork.'
    },
    {
        icon: '/images/Seamless-TradingView-Integration.png',
        title: 'Seamless TradingView Integration',
        description: 'Build, backtest, and automate — all inside TradingView. Multi-timeframe analysis, alerts, and execution in one place.'
    },
    {
        icon: '/images/Multi-Asset-Exchange-Ready.png',
        title: 'Multi-Asset & Exchange Ready',
        description: 'Trade Crypto, Forex, and Commodities. Direct integration with Binance, OKX, and more.'
    },
    {
        icon: '/images/24-7-Automated-Execution.png',
        title: '24/7 Automated Execution',
        description: 'Bots never sleep. Trades execute the moment conditions are met — no missed signals, no manual stress.'
    }
];

const CoreFeatures = () => {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900">Core Features</h2>
                    <p className="mt-4 text-lg text-slate-600">What Makes UnicornX Powerful</p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Smart DCA Engine */}
                    <div className="lg:row-span-3 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
                        <div className="mb-6">
                            <Image
                                src="/images/smart-dca-engine.png"
                                alt="Smart DCA Engine"
                                width={120}
                                height={120}
                                className="w-28 h-auto"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart DCA Engine</h3>
                        <p className="text-slate-600 mb-6 flex-grow">
                            Beyond blind scheduling — UnicornX lets you enter and exit with precision using indicators, on-chain metrics, and volatility signals.
                        </p>
                        <Link href="/register" className="inline-block bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg text-center hover:bg-cyan-700 transition-colors">
                            Start Free Trial<br />
                            <span className="text-sm font-normal">7 Days Free</span>
                        </Link>
                    </div>

                    {/* Right Grid - 6 Features (2 columns x 3 rows) */}
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12"
                                />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                            <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default CoreFeatures;
