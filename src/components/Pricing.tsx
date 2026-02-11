
"use client";

import { useState, useEffect } from 'react';
import { Check, MonitorPlay, Clock, Link2, Infinity } from 'lucide-react';

type PlanTier = {
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    highlight?: boolean;
};

type PricingCategory = 'Smart Timer DCA' | 'Bollinger Band DCA' | 'MVRV Smart DCA' | 'Ultimate DCA Max' | 'Bundles';

const categories: PricingCategory[] = [
    'Smart Timer DCA',
    'Bollinger Band DCA',
    'MVRV Smart DCA',
    'Ultimate DCA Max',
    'Bundles'
];

const categoryDescriptions: Record<PricingCategory, string> = {
    'Smart Timer DCA': 'Best for traders who want disciplined investing, with optional signals.',
    'Bollinger Band DCA': 'Great for dip-hunters who want to buy when markets are statistically cheap.',
    'MVRV Smart DCA': 'Perfect for long-term holders using on-chain data for optimal entries.',
    'Ultimate DCA Max': 'Maximum control with safety orders and multi-level take profits.',
    'Bundles': 'Bundle Plans – All Bots, One Subscription save 30-40%'
};

// Data from seeding script
const pricingData: Record<PricingCategory, PlanTier[]> = {
    'Smart Timer DCA': [
        { name: 'Starter', priceMonthly: 14, priceYearly: 134, features: ['Time-based DCA (daily/weekly/monthly)', 'Indicators (RSI)', 'Binance'] },
        { name: 'Pro', priceMonthly: 19, priceYearly: 182, features: ['Time-based DCA (daily/weekly/monthly)', 'Indicators (RSI, MACD, MA)', 'Binance + OKX', 'Customizable schedule'], highlight: true },
    ],
    'Bollinger Band DCA': [
        { name: 'Starter', priceMonthly: 22, priceYearly: 211, features: ['BB Logic', 'Band level selection', 'Binance'] },
        { name: 'Pro', priceMonthly: 35, priceYearly: 336, features: ['Fully customizable bands', 'Confirmation indicators', 'Binance + OKX'], highlight: true },
    ],
    'MVRV Smart DCA': [
        { name: 'Starter', priceMonthly: 29, priceYearly: 278, features: ['On-chain MVRV', 'Pre-set thresholds', 'Binance'] },
        { name: 'Pro', priceMonthly: 45, priceYearly: 430, features: ['Customizable thresholds', 'Confirmation indicators', 'Binance + OKX'], highlight: true },
    ],
    'Ultimate DCA Max': [
        { name: 'Starter', priceMonthly: 47, priceYearly: 451, features: ['4 Safety Orders', 'Single-level TP', 'Binance'] },
        { name: 'Pro', priceMonthly: 77, priceYearly: 739, features: ['8 Safety Orders', 'Two-level TP', 'Basic trailing profit'], highlight: true },
        { name: 'Expert', priceMonthly: 127, priceYearly: 1219, features: ['14 Safety Orders', '3-level TP', 'Smart Trailing Profit', 'Binance + OKX'] },
    ],
    'Bundles': [
        { name: 'Starter Bundle', priceMonthly: 49, priceYearly: 470, features: ['Smart Timer/Bollinger/MVRV Starter versions'] },
        { name: 'Pro Bundle', priceMonthly: 79, priceYearly: 758, features: ['Pro versions of above + OKX support'], highlight: true },
        { name: 'Expert Bundle', priceMonthly: 149, priceYearly: 1430, features: ['All Bots Pro + Ultimate DCA Max Pro + UnicornX Signal'] },
    ]
};

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [activeCategory, setActiveCategory] = useState<string>('Smart Timer DCA');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [dbPlans, setDbPlans] = useState<any[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Plans
                const plansRes = await fetch('/api/plans');
                if (plansRes.ok) {
                    const data = await plansRes.json();
                    setDbPlans(data);
                }

                // Fetch Categories
                const catsRes = await fetch('/api/pricing-categories');
                if (catsRes.ok) {
                    const data = await catsRes.json();
                    setDbCategories(data);
                }
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = (plan: PlanTier, isTrial = false) => {
        setLoadingPlan(plan.name);

        // Combine category with tier for full plan name (e.g., "Smart Timer DCA - Starter")
        // Find the actual plan ID from the database plans
        const dbPlan = dbPlans.find(p => {
            const matchesCategory = p.category === activeCategory;
            const tierMatches = p.tier.toLowerCase() === plan.name.toLowerCase() ||
                p.tier.toLowerCase().replace(' bundle', '') === plan.name.toLowerCase().replace(' bundle', '') ||
                p.tier.toLowerCase().includes(plan.name.toLowerCase()) ||
                plan.name.toLowerCase().includes(p.tier.toLowerCase());
            return matchesCategory && tierMatches;
        });

        // Use real DB name if found, otherwise fallback to hardcoded string
        const finalPlanName = dbPlan ? dbPlan.name : `${activeCategory} - ${plan.name}`;

        // Redirect to intermediate checkout page
        const params = new URLSearchParams({
            plan: finalPlanName,
            price: isTrial ? '0.00' : (billingCycle === 'monthly' ? plan.priceMonthly.toString() : plan.priceYearly.toString()),
            type: billingCycle,
            id: dbPlan?.id || 'monthly',
            isTrial: isTrial ? 'true' : 'false'
        });

        window.location.href = `/checkout?${params.toString()}`;
    };

    const currentCategoryData = dbCategories.find(c => c.name === activeCategory);
    const displayDescription = currentCategoryData?.description || (categoryDescriptions[activeCategory as PricingCategory] || '');
    const displayCategories = dbCategories.length > 0 ? dbCategories.map(c => c.name) : categories;

    // Safely get plan data for categories
    const currentPricingData = pricingData[activeCategory as PricingCategory] || [];

    return (
        <section id="pricing" className="pt-12 pb-24 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-slate-900">Pricing</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Choose the plan that fits your trading style.
                        <br />
                        Simple monthly pricing with 20% off when you pay yearly.
                    </p>
                </div>

                {/* Category Selector - Separate Pills */}
                <div className="mt-10 flex justify-center">
                    <div className="inline-flex flex-wrap justify-center gap-2">
                        {displayCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-3 text-sm font-medium transition-all rounded-lg ${activeCategory === cat
                                    ? 'bg-white text-cyan-600 border-l-4 border-cyan-500 shadow-md'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Header */}
                <div className="mt-10 text-center">
                    <h3 className="text-xl font-bold italic text-cyan-600">{activeCategory} - Pricing & Features</h3>
                    <p className="text-slate-600 mt-2">
                        {displayDescription}
                    </p>
                    <div className="mt-3">
                        {activeCategory !== 'Bundles' && (
                            <a
                                href={
                                    activeCategory === 'Smart Timer DCA' ? '/timer-dca' :
                                        activeCategory === 'Bollinger Band DCA' ? '/bollinger-dca' :
                                            activeCategory === 'MVRV Smart DCA' ? '/mvrv-cycle-dca' :
                                                activeCategory === 'Ultimate DCA Max' ? '/pro-multi-dca' : '#'
                                }
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-500 hover:text-cyan-600 transition-colors group"
                            >
                                Learn more about {activeCategory}
                                <Link2 size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Billing Toggle - Pill Button Style */}
                <div className="mt-8 flex justify-center items-center">
                    <div className="inline-flex items-center bg-slate-200 rounded-full p-1">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billingCycle === 'monthly'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'bg-cyan-500 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Yearly
                            <span className={`text-xs px-2 py-0.5 rounded-full ${billingCycle === 'yearly'
                                ? 'bg-white/20 text-white'
                                : 'bg-cyan-100 text-cyan-700'
                                }`}>
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className={`mt-12 grid grid-cols-1 gap-8 justify-items-center ${currentPricingData.length === 2
                    ? 'lg:grid-cols-2 max-w-4xl mx-auto'
                    : 'lg:grid-cols-3'
                    }`}>
                    {currentPricingData.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 flex flex-col bg-white w-full max-w-sm lg:max-w-none min-h-[420px] ${plan.highlight
                                ? 'border-2 border-cyan-500 shadow-lg'
                                : 'border border-slate-200'
                                }`}
                        >
                            {/* Best Value Badge */}
                            {plan.highlight && (
                                <div className="absolute -top-3 right-6 inline-flex items-center rounded-full bg-cyan-500 px-4 py-1 text-xs font-semibold text-white">
                                    Best Value
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-cyan-600">{plan.name}</h3>

                            {/* Price */}
                            <div className="mt-4">
                                <div className="flex items-baseline text-slate-900">
                                    <span className="text-5xl font-extrabold tracking-tight">
                                        ${(() => {
                                            const dbPlan = dbPlans.find(p => {
                                                const matchesCategory = p.category === activeCategory;
                                                const tierMatches = p.tier.toLowerCase() === plan.name.toLowerCase() ||
                                                    p.tier.toLowerCase().replace(' bundle', '') === plan.name.toLowerCase().replace(' bundle', '') ||
                                                    p.tier.toLowerCase().includes(plan.name.toLowerCase()) ||
                                                    plan.name.toLowerCase().includes(p.tier.toLowerCase());
                                                return matchesCategory && tierMatches;
                                            });
                                            if (dbPlan) {
                                                return billingCycle === 'monthly' ? dbPlan.priceMonthly.toFixed(2) : dbPlan.priceYearly.toFixed(2);
                                            }
                                            return billingCycle === 'monthly' ? plan.priceMonthly.toFixed(2) : plan.priceYearly.toFixed(2);
                                        })()}
                                    </span>
                                </div>
                                <p className="mt-1 text-slate-500">
                                    {billingCycle === 'monthly' ? 'Per Month' : 'Per Year'}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={loadingPlan === plan.name}
                                className={`mt-6 w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${plan.highlight
                                    ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                                    : 'bg-white text-cyan-600 border-2 border-cyan-500 hover:bg-cyan-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loadingPlan === plan.name ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Get Started'
                                )}
                            </button>

                            {/* Free Trial Button */}
                            {activeCategory !== 'Bundles' && (
                                <button
                                    onClick={() => handleSubscribe(plan, true)}
                                    className="w-full mt-3 py-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-all"
                                >
                                    Start 7-Day Free Trial
                                </button>
                            )}

                            {/* Features */}
                            <div className="mt-8">
                                <p className="font-bold text-slate-900 mb-4">Features</p>
                                <ul className="space-y-3">
                                    {(() => {
                                        const dbPlan = dbPlans.find(p => {
                                            const matchesCategory = p.category === activeCategory;
                                            const tierMatches = p.tier.toLowerCase() === plan.name.toLowerCase() ||
                                                p.tier.toLowerCase().replace(' bundle', '') === plan.name.toLowerCase().replace(' bundle', '') ||
                                                p.tier.toLowerCase().includes(plan.name.toLowerCase()) ||
                                                plan.name.toLowerCase().includes(p.tier.toLowerCase());
                                            return matchesCategory && tierMatches;
                                        });
                                        const features = (dbPlan && dbPlan.features && dbPlan.features.length > 0)
                                            ? dbPlan.features
                                            : plan.features;

                                        return features.map((feature: string) => (
                                            <li key={feature} className="flex items-start text-sm text-slate-600">
                                                <Check className="mr-3 h-5 w-5 flex-shrink-0 text-cyan-500" />
                                                {feature}
                                            </li>
                                        ));
                                    })()}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Plans Include Section */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-cyan-600 italic text-center mb-8">All Plans Include</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                        {/* Feature 1 */}
                        <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-cyan-600">
                                <MonitorPlay className="w-8 h-8" />
                            </div>
                            <span className="text-slate-900 font-medium">Works directly inside TradingView</span>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-cyan-600">
                                <Clock className="w-8 h-8" />
                            </div>
                            <span className="text-slate-900 font-medium">24/7 automated execution</span>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-cyan-600">
                                <Link2 className="w-8 h-8" />
                            </div>
                            <span className="text-slate-900 font-medium">Connects to major exchanges (Binance, OKX, etc.)</span>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-cyan-600">
                                <Infinity className="w-8 h-8" />
                            </div>
                            <span className="text-slate-900 font-medium">Unlimited market pairs & timeframes</span>
                        </div>
                    </div>

                    {/* Fair Usage Note */}
                    <div className="mt-8 max-w-4xl mx-auto">
                        <p className="text-sm font-bold text-slate-900 mb-1">Fair Usage Note</p>
                        <p className="text-sm text-slate-600">
                            We prioritize providing an excellent trading experience. While we don't restrict trading pairs for individual users, excessive server usage may require adjustments in active trading pairs. We appreciate your understanding.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
