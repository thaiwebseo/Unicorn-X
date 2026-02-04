"use client";

import Image from 'next/image';

const steps = [
    {
        number: 1,
        icon: '/images/Choose Plan.png',
        title: 'Choose Plan',
        description: 'Select the subscription that matches your trading style.'
    },
    {
        number: 2,
        icon: '/images/Get Access.png',
        title: 'Get Access',
        description: 'Instantly receive your setup guide and TradingView invite link.'
    },
    {
        number: 3,
        icon: '/images/Install & Configure.png',
        title: 'Install & Configure',
        description: 'Add UnicornX to your TradingView chart and customize your strategy.'
    },
    {
        number: 4,
        icon: '/images/Automate & Trade.png',
        title: 'Automate & Trade',
        description: "Let your bot run 24/7, executing trades exactly as you've designed."
    }
];

const HowItWork = () => {
    return (
        <section id="how-it-works" className="pt-24 pb-6 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900">How it Work</h2>
                </div>

                {/* Progress Line */}
                <div className="relative mb-12 hidden md:block">
                    <div className="flex items-center justify-between max-w-4xl mx-auto px-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-center flex-1 last:flex-none">
                                {/* Dot */}
                                <div className="w-3 h-3 rounded-full bg-cyan-500 z-10 flex-shrink-0"></div>
                                {/* Dotted Line */}
                                {idx < steps.length - 1 && (
                                    <div
                                        className="flex-1 h-0 mx-2"
                                        style={{
                                            borderTop: '2px dotted #64748b'
                                        }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            {/* Large Number Background */}
                            <div className="absolute top-2 right-2 text-8xl font-black text-transparent bg-clip-text select-none pointer-events-none"
                                style={{
                                    WebkitTextStroke: '2px #e2e8f0',
                                    lineHeight: '1'
                                }}>
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div className="relative z-10 flex items-center justify-start mb-4">
                                <Image
                                    src={step.icon}
                                    alt={step.title}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-left">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HowItWork;
