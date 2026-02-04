"use client";

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

type FAQCategory = 'General Question' | 'Pricing & Plans' | 'Features & Performance' | 'Security & Support';

const categories: FAQCategory[] = [
    'General Question',
    'Pricing & Plans',
    'Features & Performance',
    'Security & Support'
];

type FAQItem = {
    question: string;
    answer: string;
};

const faqData: Record<FAQCategory, FAQItem[]> = {
    'General Question': [
        {
            question: "What is UnicornX?",
            answer: "UnicornX provides smart Dollar-Cost Averaging (DCA) trading bots built on TradingView. They automate your investment using advanced market indicators, on-chain data, and risk management tools—across Crypto, Forex, and Commodities."
        },
        {
            question: "Do I need a TradingView subscription to use UnicornX bots?",
            answer: "Yes, you need at least a TradingView Pro subscription to use our bots with alerts functionality."
        },
        {
            question: "What exchanges are supported?",
            answer: "Currently we support Binance and OKX exchanges, with more coming soon."
        }
    ],
    'Pricing & Plans': [
        {
            question: "Do you offer a free trial?",
            answer: "Yes. Selected bots include a free trial with Pro-level features so you can test before committing."
        },
        {
            question: "Can I change my plan later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
        },
        {
            question: "Do you offer yearly discounts?",
            answer: "Yes, we offer 20% off when you pay yearly instead of monthly."
        },
        {
            question: "How do I start using a bot?",
            answer: "Simply choose a plan, subscribe, connect your exchange API, and the bot will start trading according to your settings."
        },
        {
            question: "Do I need coding skills?",
            answer: "No coding skills required. Our bots are pre-configured and ready to use out of the box."
        },
        {
            question: "Can I use multiple bots at the same time?",
            answer: "Yes, you can run multiple bots simultaneously on different trading pairs or strategies."
        }
    ],
    'Features & Performance': [
        {
            question: "How is UnicornX different from exchange DCA?",
            answer: "Our bots go beyond fixed-time DCA by adding smart entry/exit filters, indicators, and market signals for better timing."
        },
        {
            question: "Can I backtest before going live?",
            answer: "Yes, all our strategies can be backtested on TradingView before you deploy them live."
        },
        {
            question: "Do you guarantee profits?",
            answer: "No, we cannot guarantee profits. Trading involves risk and past performance is not indicative of future results."
        }
    ],
    'Security & Support': [
        {
            question: "Is my API key safe?",
            answer: "Yes. We use secure webhook connections and never request withdrawal permissions."
        },
        {
            question: "What happens if the bot or server goes down?",
            answer: "Our infrastructure is designed for high availability. If issues occur, your positions remain safe on the exchange."
        },
        {
            question: "How do I get support?",
            answer: "You can reach us via email, Discord, or the support section in your dashboard. We typically respond within 24 hours."
        }
    ]
};

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState<FAQCategory>('General Question');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="bg-slate-100 pt-8 pb-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-cyan-600 italic mb-2">
                        Question & Answer
                    </h2>
                    <h3 className="text-4xl font-extrabold text-slate-900 italic">
                        Frequently Asked Questions
                    </h3>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center flex-wrap gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setOpenIndex(0);
                            }}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                ? 'bg-cyan-500 text-white'
                                : 'bg-transparent text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-300 mb-6"></div>

                {/* FAQ Items */}
                <div className="space-y-0">
                    {faqData[activeCategory].map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-200 py-4"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-slate-500">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <span className={`text-base font-semibold ${openIndex === index ? 'text-cyan-600' : 'text-slate-900'}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <span className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === index ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {openIndex === index ? (
                                        <Minus className="h-4 w-4" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                </span>
                            </button>

                            {openIndex === index && (
                                <div className="mt-3 pl-12">
                                    <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
