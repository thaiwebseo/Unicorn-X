"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HelpCircle, Copy, Check, Loader2 } from 'lucide-react';

// Inner component that uses useSearchParams
function CreateKeyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [email, setEmail] = useState('');

    // Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Bundle / Multi-bot state
    const [waitingBots, setWaitingBots] = useState<any[]>([]);
    const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
    const [setupCompleteCount, setSetupCompleteCount] = useState(0);
    const [setupBotName, setSetupBotName] = useState('');
    const [remainingModalCount, setRemainingModalCount] = useState(0);

    // Webhook generation
    const [webhookUrl, setWebhookUrl] = useState('');

    // Payment verification state
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [botId, setBotId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Verify payment on page load
    useEffect(() => {
        if (sessionId && !verified) {
            verifyPayment();
        }
        // Fetch waiting bots regardless of session verify to support direct entry
        fetchWaitingBots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const fetchWaitingBots = async () => {
        try {
            const res = await fetch('/api/user/bots');
            if (res.ok) {
                const bots = await res.json();
                // Filter only bots that need setup
                const pending = bots.filter((b: any) => b.status === 'WAITING_FOR_SETUP');
                setWaitingBots(pending);
                // Default select all
                setSelectedBotIds(pending.map((b: any) => b.id));
            }
        } catch (error) {
            console.error('Error fetching bots:', error);
        }
    };

    const verifyPayment = async () => {
        setVerifying(true);
        try {
            const res = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });

            if (res.ok) {
                const data = await res.json();
                console.log('✅ Payment verified', data);
                setVerified(true);
                // Refresh waiting bots after verification (in case they were just created)
                fetchWaitingBots();
            } else {
                console.error('Failed to verify payment');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        } finally {
            setVerifying(false);
        }
    };

    const toggleBotSelection = (botId: string) => {
        setSelectedBotIds(prev =>
            prev.includes(botId)
                ? prev.filter(id => id !== botId)
                : [...prev, botId]
        );
    };

    const handleSave = async () => {
        if (selectedBotIds.length === 0) {
            alert('Please select at least one bot to setup.');
            return;
        }

        setSaving(true);
        try {
            let successCount = 0;
            // Generate 15-character unique random string
            const generateRandomString = (length: number) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };

            // Loop through selected bots
            for (const targetBotId of selectedBotIds) {
                // Generate webhook URL with new format
                const randomToken = generateRandomString(15);
                const generatedWebhook = `https://u2qkzg3.execute-api.ap-northeast-1.amazonaws.com/${targetBotId}/webhook/${randomToken}`;

                // Save API keys to bot
                console.log('🔄 Updating bot:', targetBotId);
                const res = await fetch('/api/user/bots', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: targetBotId,
                        apiKey,
                        secretKey,
                        tradingViewEmail: email,
                        webhookUrl: generatedWebhook,
                        status: 'SETTING_UP'
                    })
                });

                if (res.ok) {
                    successCount++;
                    // If this is a single selection, keep the webhook and name to show
                    if (selectedBotIds.length === 1) {
                        setWebhookUrl(generatedWebhook);
                        const bot = waitingBots.find(b => b.id === targetBotId);
                        if (bot) setSetupBotName(bot.name);
                    }
                } else {
                    console.error('Failed to update bot', targetBotId);
                }
            }

            if (successCount > 0) {
                console.log(`✅ Updated ${successCount} bots successfully`);

                // Calculate remaining BEFORE refresh
                const unselectedCount = waitingBots.filter(b => !selectedBotIds.includes(b.id)).length;
                setRemainingModalCount(unselectedCount);

                setSetupCompleteCount(successCount);
                setShowSuccessModal(true);
                // Refresh list to remove setup bots
                fetchWaitingBots();
            } else {
                alert('Failed to save API keys. Please try again.');
            }

        } catch (error) {
            console.error('Error saving keys:', error);
            alert('Error saving API keys. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        router.push('/dashboard');
    };

    const handleNextStep = () => {
        router.push('/dashboard');
    };

    // Determine if we are in "Bulk/Selective" mode
    // Meaning we have waiting bots, and either multiple are waiting OR we just finished a batch and have leftovers
    const remainingBotsCount = waitingBots.filter(b => !selectedBotIds.includes(b.id)).length; // Logic check: waitingBots is refreshed AFTER save, so it excludes processed ones.

    // Actually, fetchWaitingBots clears the processed ones from 'waitingBots' state? 
    // Yes, because status changes to SETTING_UP.
    // So 'waitingBots.length' will decrease.

    const handleContinueSetup = () => {
        // Reset form for next batch
        setApiKey('');
        setSecretKey('');
        // email might remain same? let's keep it for convenience
        setShowSuccessModal(false);
        setSetupCompleteCount(0);
        // waitingBots is already refreshed in handleSave -> fetchWaitingBots
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl);
    };

    return (
        <div className="relative">
            {/* Main Content */}
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Create API & Secret Key</h2>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

                {/* Bot Selection List (Only if needed) */}
                {waitingBots.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center text-xs font-black">{waitingBots.length}</span>
                                Select Bots to Setup
                            </h3>
                            <button
                                onClick={() => setSelectedBotIds(waitingBots.map(b => b.id))}
                                className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                            >
                                Select All
                            </button>
                        </div>
                        <div className="space-y-2">
                            {waitingBots.map(bot => (
                                <div
                                    key={bot.id}
                                    onClick={() => toggleBotSelection(bot.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedBotIds.includes(bot.id)
                                        ? 'bg-white border-cyan-500 shadow-sm'
                                        : 'bg-slate-100/50 border-transparent hover:bg-slate-100 border-slate-200'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBotIds.includes(bot.id) ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'
                                        }`}>
                                        {selectedBotIds.includes(bot.id) && <Check size={14} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800 text-sm">{bot.name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Status: {bot.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                            Select which bots you want to use with the API Key below. Each bot will get its own unique Webhook automatically.
                        </p>
                    </div>
                )}

                {/* API Key Input */}
                <div>
                    <label className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                        API Key
                        <span title="Enter your exchange API Key for bot connection">
                            <HelpCircle size={16} className="text-slate-400 cursor-pointer hover:text-cyan-500" />
                        </span>
                    </label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Exchange API Key"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none transition-colors"
                    />
                </div>

                {/* Secret Key Input */}
                <div>
                    <label className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                        Secret Key
                        <span title="Enter your exchange Secret Key for bot connection">
                            <HelpCircle size={16} className="text-slate-400 cursor-pointer hover:text-cyan-500" />
                        </span>
                    </label>
                    <input
                        type="text"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter your Exchange Secret Key"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none transition-colors"
                    />
                </div>

                {/* Email Input (TradingView Email) */}
                <div>
                    <label className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                        TradingView email
                        <span title="Enter your TradingView email (to receive the script invite)">
                            <HelpCircle
                                size={16}
                                className="text-slate-400 cursor-pointer hover:text-cyan-500"
                            />
                        </span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your TradingView email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none transition-colors"
                    />
                </div>

                {/* Actions */}
                <div className="pt-6 flex justify-between items-center">
                    <button
                        onClick={handleSkip}
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!apiKey || !secretKey || !email || saving || selectedBotIds.length === 0}
                        className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            selectedBotIds.length > 1 ? `Save to ${selectedBotIds.length} Bots` : 'Save Key'
                        )}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-in fade-in zoom-in duration-300">

                        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/30">
                            <Check size={40} className="text-white border-4 border-white rounded-full bg-cyan-500 w-full h-full p-2" />
                        </div>

                        <h3 className="text-3xl font-extrabold text-cyan-500 mb-2">Setup Successful!</h3>
                        <p className="text-slate-600 mb-8">
                            {setupCompleteCount > 1
                                ? `You have successfully configured ${setupCompleteCount} bots.`
                                : `You have successfully added the API Key.`}
                            <br />
                            {remainingModalCount > 0
                                ? <span className="font-bold text-amber-500">You still have {remainingModalCount} bot{remainingModalCount > 1 ? 's' : ''} waiting for setup.</span>
                                : setupCompleteCount > 1
                                    ? <span>Please view individual Webhooks in the Dashboard.</span>
                                    : <span>And here is the <span className="font-bold text-slate-900">Webhook</span> for connecting.</span>
                            }
                        </p>

                        {/* Show Webhook ONLY if single bot was setup AND no bulk context to confuse */}
                        {setupCompleteCount === 1 && webhookUrl && (
                            <>
                                <p className="text-sm font-bold text-slate-900 mb-2">
                                    Your Webhook LinkBot {setupBotName && <span className="text-cyan-600">[{setupBotName}]</span>}
                                </p>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-2 mb-8">
                                    <code className="text-xs text-slate-500 flex-1 break-all text-left">
                                        {webhookUrl}
                                    </code>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white border border-cyan-200 text-cyan-600 text-xs font-bold rounded-lg hover:bg-cyan-50 transition-colors"
                                    >
                                        <Copy size={14} />
                                        Copy Link
                                    </button>
                                </div>
                            </>
                        )}

                        {/* If multiple bots were setup, show hint effectively */}
                        {setupCompleteCount > 1 && (
                            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-8 text-left space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <p className="text-xs text-cyan-800">Your bots have <span className="font-bold">different Webhooks</span>. Please find them in the Dashboard.</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <p className="text-xs text-cyan-800">You can use this same API Key for all of them, or edit them later.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {remainingModalCount > 0 ? (
                                <button
                                    onClick={handleContinueSetup}
                                    className="w-full py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    Setup Next Bot ({remainingModalCount} Remaining)
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextStep}
                                    className="w-full py-3.5 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
                                >
                                    {setupCompleteCount > 1 ? 'Go to My Dashboard' : 'Click to Next Step'}
                                </button>
                            )}

                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Close this modal
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

// Loading fallback for Suspense
function CreateKeyLoading() {
    return (
        <div className="relative">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Create API & Secret Key</h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px]">
                <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 size={20} className="animate-spin" />
                    Loading...
                </div>
            </div>
        </div>
    );
}

// Main export with Suspense wrapper
export default function CreateKeyPage() {
    return (
        <Suspense fallback={<CreateKeyLoading />}>
            <CreateKeyContent />
        </Suspense>
    );
}
