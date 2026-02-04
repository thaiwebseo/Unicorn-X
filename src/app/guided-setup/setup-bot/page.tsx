"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';

function SetupBotContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const webhookUrl = searchParams.get('webhook') || 'https://unicornxbot.com/api/webhook/sample-id';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl);
    };

    const handleFinish = () => {
        router.push('/dashboard');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How to Setup</h2>
                <p className="text-slate-500">Follow the instructions below to connect your bot.</p>
            </div>

            {/* Step 1: Copy Link */}
            <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl font-bold font-mono">
                    1
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Copy Link</h3>
                    <p className="text-slate-500 text-sm">Start by copying the Webhook Link you received and save it.</p>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <code className="text-sm text-slate-500 font-mono break-all flex-1 bg-white p-3 rounded-lg border border-slate-100 block w-full">
                            {webhookUrl}
                        </code>
                        <button
                            onClick={copyToClipboard}
                            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-white border-2 border-cyan-100 text-cyan-600 font-bold rounded-xl hover:bg-cyan-50 hover:border-cyan-200 transition-colors shadow-sm"
                        >
                            <Copy size={18} />
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Step 2: Go to TradingView */}
            <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl font-bold font-mono">
                    2
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Go to Tradingview Website</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Go to <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="text-cyan-500 font-bold hover:underline inline-flex items-center gap-1">Tradingview.com <ExternalLink size={12} /></a> and log in to your account and paste the Webhook link you copied.<br />
                        Please read the details and setup steps carefully.
                    </p>

                    <div className="pt-2">
                        <button className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20">
                            Go to Document Center
                        </button>
                    </div>
                </div>
            </div>

            {/* Finish Action */}
            <div className="pt-12 flex justify-end">
                <button
                    onClick={handleFinish}
                    className="px-10 py-4 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-xl shadow-cyan-500/20 flex items-center gap-2 text-lg"
                >
                    Finish Guide
                </button>
            </div>
        </div>
    );
}

function SetupBotLoading() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How to Setup</h2>
                <p className="text-slate-500">Follow the instructions below to connect your bot.</p>
            </div>
            <div className="flex items-center justify-center py-12 text-slate-400">
                <Loader2 size={20} className="animate-spin mr-2" />
                Loading...
            </div>
        </div>
    );
}

export default function SetupBotPage() {
    return (
        <Suspense fallback={<SetupBotLoading />}>
            <SetupBotContent />
        </Suspense>
    );
}
