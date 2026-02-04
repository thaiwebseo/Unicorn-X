"use client";

import Link from "next/link";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

const STRATEGIES = [
    {
        id: "timer-dca",
        name: "Timer DCA",
        description: "Buy at fixed intervals regardless of price.",
        icon: "⏱️"
    },
    {
        id: "bollinger-dca",
        name: "Bollinger DCA",
        description: "Buy when price hits lower Bollinger Band.",
        icon: "📉"
    },
    {
        id: "mvrv-dca",
        name: "MVRV Cycle DCA",
        description: "Buy based on on-chain MVRV Z-Score valuation.",
        icon: "📊"
    },
    {
        id: "pro-multi",
        name: "Pro Multi-DCA",
        description: "Advanced strategy mixing multiple indicators.",
        icon: "🚀"
    }
];

export default function CreateBotPage() {
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link href="/dashboard/bots" className="text-slate-500 hover:text-slate-700 inline-flex items-center text-sm mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to My Bots
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Create New Bot</h1>
                <p className="text-slate-600 mt-2">Select a strategy to start configuring your automated trader.</p>
            </div>

            {/* Step 1: Strategy Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">1. Choose Strategy</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STRATEGIES.map((strategy) => (
                        <button
                            key={strategy.id}
                            onClick={() => setSelectedStrategy(strategy.id)}
                            className={`relative text-left p-6 rounded-xl border-2 transition-all ${selectedStrategy === strategy.id
                                    ? "border-[#00C2CC] bg-cyan-50/50"
                                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-3xl mb-3 block">{strategy.icon}</span>
                                {selectedStrategy === strategy.id && (
                                    <div className="h-6 w-6 bg-[#00C2CC] rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <h3 className={`font-bold ${selectedStrategy === strategy.id ? "text-[#00C2CC]" : "text-slate-900"}`}>
                                {strategy.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">{strategy.description}</p>
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        disabled={!selectedStrategy}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#00C2CC] hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Step
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
