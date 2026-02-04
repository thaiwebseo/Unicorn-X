"use client";

import { Check, CreditCard, Shield, Zap } from "lucide-react";

const PLANS = [
    {
        name: "Starter",
        price: "$29",
        period: "/month",
        features: ["5 Active Bots", "Basic Indicators", "Daily Reports", "Email Support"],
        current: false,
        recommended: false
    },
    {
        name: "Pro",
        price: "$79",
        period: "/month",
        features: ["15 Active Bots", "Advanced Indicators", "Real-time Alerts", "Priority Support", "Strategy Backtesting"],
        current: true, // Mock current plan
        recommended: true
    },
    {
        name: "Expert",
        price: "$149",
        period: "/month",
        features: ["Unlimited Bots", "All Indicators", "API Access", "Dedicated Account Manager", "Custom Strategy Scripting"],
        current: false,
        recommended: false
    }
];

export default function SubscriptionPage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
                <p className="text-slate-500 mt-2">Manage your plan and billing details.</p>
            </div>

            {/* Current Plan Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Shield className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Current Plan: Pro</h2>
                        <p className="text-slate-500 text-sm">Renews on Feb 28, 2026</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-xl transition-colors">
                        Cancel Subscription
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-xl transition-colors shadow-sm">
                        Update Payment Method
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-2xl border p-6 md:p-8 flex flex-col ${plan.current
                                    ? "border-blue-500 ring-4 ring-blue-500/10 shadow-lg"
                                    : "border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                                }`}
                        >
                            {plan.recommended && !plan.current && (
                                <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-[#00C2CC] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500 ml-1">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                                        <span className="text-slate-600 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={plan.current}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${plan.current
                                        ? "bg-slate-100 text-slate-400 cursor-default"
                                        : "bg-slate-900 text-white hover:bg-slate-800"
                                    }`}
                            >
                                {plan.current ? "Current Plan" : "Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment History (Placeholder) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-3 text-sm font-semibold text-slate-500">Date</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Description</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Amount</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Status</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1].map((_, i) => (
                                <tr key={i}>
                                    <td className="py-4 text-sm text-slate-900">Jan 28, 2026</td>
                                    <td className="py-4 text-sm text-slate-900">Pro Plan - Monthly</td>
                                    <td className="py-4 text-sm text-slate-900">$79.00</td>
                                    <td className="py-4 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-right text-blue-600 hover:underline cursor-pointer">Download</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
