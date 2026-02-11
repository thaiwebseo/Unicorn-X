"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Copy, ExternalLink, Loader2, Check, Bot } from 'lucide-react';

interface BotWithWebhook {
    id: string;
    name: string;
    webhookUrl: string;
}

function SetupBotContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get bot IDs from query params (comma-separated)
    const botIdsParam = searchParams.get('botIds');
    const targetBotIds = botIdsParam ? botIdsParam.split(',') : [];

    const [bots, setBots] = useState<BotWithWebhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

    // Fetch only the bots that were just configured
    useEffect(() => {
        const fetchBots = async () => {
            try {
                const res = await fetch('/api/user/bots');
                if (res.ok) {
                    const data = await res.json();

                    let filteredBots: BotWithWebhook[] = [];

                    if (targetBotIds.length > 0) {
                        // Filter by specific bot IDs from the recent payment
                        filteredBots = data
                            .filter((bot: any) => targetBotIds.includes(bot.id) && bot.webhookUrl)
                            .map((bot: any) => ({
                                id: bot.id,
                                name: bot.name,
                                webhookUrl: bot.webhookUrl
                            }));
                    } else {
                        // Fallback: Show bots in SETTING_UP status (most recently configured)
                        filteredBots = data
                            .filter((bot: any) => bot.webhookUrl && bot.status === 'SETTING_UP')
                            .map((bot: any) => ({
                                id: bot.id,
                                name: bot.name,
                                webhookUrl: bot.webhookUrl
                            }));
                    }

                    setBots(filteredBots);
                }
            } catch (error) {
                console.error('Error fetching bots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBots();
    }, [targetBotIds.join(',')]); // Re-fetch if bot IDs change

    const copyToClipboard = (webhook: string, botId: string) => {
        navigator.clipboard.writeText(webhook);
        setCopiedStates(prev => ({ ...prev, [botId]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [botId]: false }));
        }, 2000);
    };

    const handleFinish = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How to Setup</h2>
                    <p className="text-slate-500">Follow the instructions below to connect your bot.</p>
                </div>
                <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Loading your bots...
                </div>
            </div>
        );
    }

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
                    <h3 className="text-xl font-bold text-slate-900">Copy Webhook Link</h3>
                    <p className="text-slate-500 text-sm">
                        Copy the Webhook Link for each bot and use it in TradingView alerts.
                        {bots.length > 1 && (
                            <span className="text-amber-600 font-medium ml-1">
                                (Bundle: {bots.length} bots - each has a unique webhook!)
                            </span>
                        )}
                    </p>

                    {/* Webhook List for Each Bot */}
                    <div className="space-y-3">
                        {bots.map((bot, index) => (
                            <div
                                key={bot.id}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                            >
                                {/* Bot Name Header */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-cyan-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="font-bold text-slate-800 flex items-center gap-2">
                                        <Bot size={16} className="text-cyan-500" />
                                        {bot.name}
                                    </span>
                                </div>

                                {/* Webhook URL */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                    <code className="text-xs text-slate-500 font-mono break-all flex-1 bg-white p-3 rounded-lg border border-slate-100 block w-full">
                                        {bot.webhookUrl}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(bot.webhookUrl, bot.id)}
                                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 font-bold rounded-xl transition-colors shadow-sm text-sm ${copiedStates[bot.id]
                                            ? 'bg-green-500 text-white border-2 border-green-500'
                                            : 'bg-white border-2 border-cyan-100 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-200'
                                            }`}
                                    >
                                        {copiedStates[bot.id] ? (
                                            <>
                                                <Check size={16} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                Copy Link
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {bots.length === 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
                                No bots found. Please complete the API Key setup first.
                            </div>
                        )}
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
                        <a
                            href="/guides"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
                        >
                            Go to Document Center
                        </a>
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
