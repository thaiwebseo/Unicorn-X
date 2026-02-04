"use client";

import { useState, useEffect } from 'react';
import { Play, Pause, Settings, ChevronDown, ChevronUp, Copy, Check, Info, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import PasswordVerificationModal from '@/components/PasswordVerificationModal';

interface Bot {
    id: string;
    name: string;
    apiKey: string;
    secretKey: string;
    tradingViewEmail: string | null;
    webhookUrl: string | null;
    status: string;
    isActivated: boolean;
    createdAt: string;
    expirationDate: string | null;
}

export default function MyBotsView() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedBotId, setExpandedBotId] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingBotId, setPendingBotId] = useState<string | null>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

    // State for Safe Mode
    const [editingStates, setEditingStates] = useState<{ [key: string]: boolean }>({});
    const [botConfigs, setBotConfigs] = useState<{ [key: string]: { apiKey: string, secretKey: string, email: string } }>({});

    // State for Secure Edit
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [botIdToEdit, setBotIdToEdit] = useState<string | null>(null);
    const [revealedStates, setRevealedStates] = useState<{ [key: string]: boolean }>({});
    const [pendingAction, setPendingAction] = useState<'EDIT' | 'REVEAL' | null>(null);

    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const showToast = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 3000);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchBots(true), fetchSubscriptions()]);
            setLoading(false);
        };
        init();

        // Poll every 5 seconds to update status (only when tab is active)
        const intervalId = setInterval(() => {
            if (!document.hidden) {
                fetchBots(false);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchBots = async (initialLoad = false) => {
        try {
            const res = await fetch('/api/user/bots');
            if (res.ok) {
                const data = await res.json();
                setBots(data);

                // Only initialize configs on first load to prevent overwriting user input while editing
                if (initialLoad) {
                    const configs: { [key: string]: { apiKey: string, secretKey: string, email: string } } = {};
                    data.forEach((bot: Bot) => {
                        configs[bot.id] = {
                            apiKey: bot.apiKey || '',
                            secretKey: bot.secretKey || '',
                            email: bot.tradingViewEmail || ''
                        };
                    });
                    setBotConfigs(configs);
                }
            }
        } catch (error) {
            console.error('Error fetching bots:', error);
        } finally {
            if (initialLoad) {
                setLoading(false);
            }
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch('/api/user/subscriptions');
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(data);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    // Toggle Accordion
    const toggleConfig = (botId: string) => {
        setExpandedBotId(expandedBotId === botId ? null : botId);
    };

    // Handle Input Change
    const handleInputChange = (botId: string, field: string, value: string) => {
        setBotConfigs(prev => ({
            ...prev,
            [botId]: {
                ...prev[botId],
                [field]: value
            }
        }));
    };

    // Handle Edit Click - Triggers Password Verification
    const handleEditClick = (botId: string) => {
        setPendingAction('EDIT');
        setBotIdToEdit(botId);
        setIsPasswordModalOpen(true);
    };

    // Handle Reveal Click - Triggers Password Verification
    const handleRevealClick = (botId: string) => {
        if (revealedStates[botId]) {
            // If already revealed, just hide it
            setRevealedStates(prev => ({ ...prev, [botId]: false }));
            return;
        }
        setPendingAction('REVEAL');
        setBotIdToEdit(botId);
        setIsPasswordModalOpen(true);
    };

    // Handle Password Verified
    const handlePasswordVerified = () => {
        if (botIdToEdit) {
            if (pendingAction === 'EDIT') {
                setEditingStates(prev => ({ ...prev, [botIdToEdit]: true }));
            } else if (pendingAction === 'REVEAL') {
                setRevealedStates(prev => ({ ...prev, [botIdToEdit]: true }));
            }
            setBotIdToEdit(null);
            setPendingAction(null);
        }
    };

    // Handle Save Click
    const handleSaveClick = (botId: string) => {
        const config = botConfigs[botId];
        if (!config?.apiKey?.trim() || !config?.secretKey?.trim() || !config?.email?.trim()) {
            showToast("Please fill in all required fields: API Key, Secret Key, and TradingView Email.");
            return;
        }

        setPendingBotId(botId);
        setIsConfirmModalOpen(true);
    };

    // Handle Confirm Save
    const handleConfirmSave = async () => {
        if (pendingBotId) {
            const config = botConfigs[pendingBotId];

            // Generate Random Webhook URL
            const randomString = Math.random().toString(36).substring(2, 12).toUpperCase();
            const newWebhook = `https://u2qkzg3.execute-api.ap-northeast-1.amazonaws.com/${pendingBotId}/webhook/${randomString}`;

            try {
                const res = await fetch('/api/user/bots', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: pendingBotId,
                        apiKey: config.apiKey,
                        secretKey: config.secretKey,
                        tradingViewEmail: config.email,
                        webhookUrl: newWebhook,
                        status: 'SETTING_UP'
                    })
                });

                if (res.ok) {
                    // Re-fetch bots to get updated data
                    await fetchBots();
                }
            } catch (error) {
                console.error('Error saving bot config:', error);
            }

            // Turn off editing mode
            setEditingStates(prev => ({ ...prev, [pendingBotId]: false }));
            setPendingBotId(null);
        }
    };

    // Handle Cancel Edit
    const handleCancelEdit = (botId: string) => {
        // Find original bot data to reset
        const originalBot = bots.find(b => b.id === botId);
        if (originalBot) {
            setBotConfigs(prev => ({
                ...prev,
                [botId]: {
                    apiKey: originalBot.apiKey || '',
                    secretKey: originalBot.secretKey || '',
                    email: originalBot.tradingViewEmail || ''
                }
            }));
        }
        setEditingStates(prev => ({ ...prev, [botId]: false }));
    };

    // Copy to Clipboard
    const copyToClipboard = (text: string, botId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [botId]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [botId]: false }));
        }, 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'WAITING_FOR_SETUP': return 'bg-yellow-500';
            case 'SETTING_UP': return 'bg-slate-400';
            case 'READY': return 'bg-green-400';
            case 'RUNNING': return 'bg-green-600';
            case 'PAUSED': return 'bg-amber-500';
            case 'SUSPENDED': return 'bg-yellow-600';
            case 'ERROR': return 'bg-red-500';
            default: return 'bg-slate-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'WAITING_FOR_SETUP': return 'Waiting for Setup';
            case 'SETTING_UP': return 'Setting Up';
            case 'READY': return 'Ready';
            case 'RUNNING': return 'Running';
            case 'PAUSED': return 'Paused';
            case 'SUSPENDED': return 'Suspended';
            case 'ERROR': return 'Error';
            default: return status;
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'WAITING_FOR_SETUP':
                return 'Please complete your Exchange & TradingView setup below to activate your bot.';
            case 'SETTING_UP':
                return "We've received your API & TradingView details. Our system is completing the setup. This usually takes a few minutes. You will also receive a confirmation email once setup is finished.";
            case 'READY':
                return 'Configuration is complete. Please accept the TradingView script invite sent to your email and set up your Webhook URL in TradingView alerts. Once done, your bot can start running.';
            case 'RUNNING':
                return 'Your bot is active and executing trades automatically.';
            case 'PAUSED':
                return 'Bot is paused, no trades will be executed until resumed.';
            case 'SUSPENDED':
                return 'Your subscription is suspended. Please renew to continue using your bot.';
            case 'ERROR':
                return 'Connection failed. Please check your API/Secret Key and verify your TradingView email.';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">My Bot</h2>
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading bots...
                </div>
            </div>
        );
    }

    if (bots.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">My Bot</h2>
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center text-slate-400">
                    No bots found. Subscribe to a plan to create your first bot!
                </div>
            </div>
        );
    }

    // --- Bundle Grouping Logic ---
    const activeBundles: { subscription: any, bots: Bot[] }[] = [];
    let standaloneBots = [...bots];

    // 1. Identify Bundles from Subscriptions
    const bundleSubscriptions = subscriptions.filter(s =>
        (s.status === 'ACTIVE' || s.status === 'CANCELLED') &&
        (s.plan && (s.plan.category === 'Bundles' || (s.plan.includedBots && s.plan.includedBots.length > 1)))
    );


    bundleSubscriptions.forEach(sub => {
        const bundleBotsForSub: Bot[] = [];

        // 1. Determine target bot names for this bundle
        let targets = sub.plan.includedBots && sub.plan.includedBots.length > 0
            ? [...sub.plan.includedBots]
            : [];

        // Fallback for Bundles if includedBots is empty (Matches backend logic)
        if (targets.length === 0 && sub.plan.category === 'Bundles') {
            const tier = sub.plan.tier.toLowerCase();
            if (tier.includes('starter')) {
                targets = ['Bollinger Band DCA - Starter', 'Smart Timer DCA - Starter', 'MVRV Smart DCA - Starter'];
            } else if (tier.includes('pro')) {
                targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro'];
            } else if (tier.includes('expert')) {
                targets = ['Bollinger Band DCA - Pro', 'Smart Timer DCA - Pro', 'MVRV Smart DCA - Pro', 'Ultimate DCA Max - Pro', 'Sniper Bot - Pro'];
            }
        }

        if (targets.length === 0) targets = [sub.plan.name]; // Fallback to plan name

        // 2. Iterate through required bots for this bundle
        targets.forEach(targetName => {
            // Find all candidates with matching name
            const candidates = standaloneBots
                .map((b, i) => ({ bot: b, index: i }))
                .filter(item => item.bot.name === targetName);

            if (candidates.length > 0) {
                // Find the best candidate based on creation time proximity to subscription
                // Heuristic: Bots are usually created immediately after subscription
                let bestMatchIndex = -1;
                let minTimeDiff = Infinity;

                const subTime = new Date(sub.createdAt).getTime();

                candidates.forEach(candidate => {
                    const botTime = new Date(candidate.bot.createdAt).getTime();
                    const diff = Math.abs(botTime - subTime);

                    if (diff < minTimeDiff) {
                        minTimeDiff = diff;
                        bestMatchIndex = candidate.index;
                    }
                });

                if (bestMatchIndex !== -1) {
                    // Extract the clean match
                    // Note: We need to find the index in the CURRENT standaloneBots array, 
                    // which might have shifted if we spliced previously? 
                    // No, candidates.index is stale. We should work with IDs or findIndex again.

                    // Let's use ID to be safe
                    const bestBotId = standaloneBots[candidates.find(c => c.index === bestMatchIndex)?.index!]?.id; // This logic is slightly circular

                    // Simpler: Just get the bot object from candidates, find its current index in standaloneBots
                    const bestBot = candidates.find(c => {
                        const botTime = new Date(c.bot.createdAt).getTime();
                        return Math.abs(botTime - subTime) === minTimeDiff;
                    })?.bot;

                    if (bestBot) {
                        const currentIdx = standaloneBots.findIndex(b => b.id === bestBot.id);
                        if (currentIdx !== -1) {
                            bundleBotsForSub.push(bestBot);
                            standaloneBots.splice(currentIdx, 1);
                        }
                    }
                }
            }
        });

        if (bundleBotsForSub.length > 0) {
            activeBundles.push({ subscription: sub, bots: bundleBotsForSub });
        }
    });

    const renderBotCard = (bot: Bot) => {
        const isExpanded = expandedBotId === bot.id;
        const webhookUrl = bot.webhookUrl;
        const isSaved = !!webhookUrl;
        const isEditing = editingStates[bot.id];
        const config = botConfigs[bot.id] || { apiKey: '', secretKey: '', email: '' };
        const showInputs = !isSaved || isEditing;

        return (
            <div key={bot.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                {/* Card Header / Main Row */}
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`} />
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-cyan-600">{bot.name}</h3>
                            {bot.status !== 'WAITING_FOR_SETUP' && (!['SETTING_UP', 'READY'].includes(bot.status) || bot.isActivated) ? (
                                <p className="text-sm md:text-base text-slate-400">
                                    Expire: <span className="text-red-400">
                                        {bot.expirationDate
                                            ? new Date(bot.expirationDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                            : 'N/A'}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm md:text-base text-slate-400">
                                    Status: <span className="text-red-400 font-medium">Activation Pending</span>
                                </p>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-col items-end gap-2">
                        {/* Status Badge */}
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white flex items-center gap-1.5 ${getStatusColor(bot.status)}`}>
                            {bot.status === 'SUSPENDED' && <Lock size={14} />}
                            {getStatusLabel(bot.status)}
                        </span>

                        {/* Config Button */}
                        <button
                            onClick={() => toggleConfig(bot.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
                        >
                            <Settings size={16} />
                            Config
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>

                {/* Status Description */}
                <div className="px-6 pb-4 text-sm text-slate-500 md:w-3/5">
                    {getStatusDescription(bot.status)}
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* API Key */}
                            <div className="space-y-2">
                                <label className="text-sm md:text-base font-bold text-slate-700 flex items-center gap-1">
                                    <span className="text-red-500">*</span> API Key
                                </label>
                                {showInputs ? (
                                    <input
                                        type="text"
                                        placeholder="Enter API Key"
                                        value={config.apiKey}
                                        onChange={(e) => handleInputChange(bot.id, 'apiKey', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                                    />
                                ) : (
                                    <div className="relative group">
                                        <div className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 pr-12 font-mono text-xs md:text-sm">
                                            {revealedStates[bot.id]
                                                ? (config.apiKey || 'Not set')
                                                : (config.apiKey ? config.apiKey.slice(0, 3) + '••••••••' : 'Not set')}
                                        </div>
                                        <button
                                            onClick={() => handleRevealClick(bot.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-500 transition-colors"
                                            title={revealedStates[bot.id] ? "Hide Key" : "Reveal Key"}
                                        >
                                            {revealedStates[bot.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Secret Key */}
                            <div className="space-y-2">
                                <label className="text-sm md:text-base font-bold text-slate-700 flex items-center gap-1">
                                    <span className="text-red-500">*</span> Secret Key
                                </label>
                                {showInputs ? (
                                    <input
                                        type="text"
                                        placeholder="Enter Secret Key"
                                        value={config.secretKey}
                                        onChange={(e) => handleInputChange(bot.id, 'secretKey', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                                    />
                                ) : (
                                    <div className="relative group">
                                        <div className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 pr-12 font-mono text-xs md:text-sm">
                                            {revealedStates[bot.id]
                                                ? (config.secretKey || 'Not set')
                                                : (config.secretKey ? config.secretKey.slice(0, 3) + '••••••••' : 'Not set')}
                                        </div>
                                        <button
                                            onClick={() => handleRevealClick(bot.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-500 transition-colors"
                                            title={revealedStates[bot.id] ? "Hide Key" : "Reveal Key"}
                                        >
                                            {revealedStates[bot.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* TradingView Email */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm md:text-base font-bold text-slate-700 flex items-center gap-1">
                                    <span className="text-red-500">*</span> TradingView Email
                                </label>
                                {showInputs ? (
                                    <input
                                        type="email"
                                        placeholder="Enter TradingView email"
                                        value={config.email}
                                        onChange={(e) => handleInputChange(bot.id, 'email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 border border-slate-200">
                                        {config.email || 'Not set'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Webhook URL (shown only after save) */}
                        {isSaved && !isEditing && (
                            <div className="mb-6 space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    Webhook URL
                                    <Info size={14} className="text-slate-400" />
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={webhookUrl}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-sm"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(webhookUrl, bot.id)}
                                        className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
                                    >
                                        {copiedStates[bot.id] ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            {isSaved && !isEditing ? (
                                <button
                                    onClick={() => handleEditClick(bot.id)}
                                    className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    {isEditing && (
                                        <button
                                            onClick={() => handleCancelEdit(bot.id)}
                                            className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSaveClick(bot.id)}
                                        className="px-6 py-2.5 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-sm"
                                    >
                                        Save & Connect
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">My Bot</h2>
            </div>

            <div className="space-y-8">
                {/* 1. Bundled Bots Accordions */}
                {activeBundles.map((group, idx) => (
                    <details key={`bundle-${idx}`} open className="group bg-slate-50 border border-slate-200 rounded-3xl p-1 shadow-sm">
                        <summary className="flex items-center justify-between px-6 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-cyan-600">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{group.subscription.plan.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">Bundle Package • {group.bots.length} Bots Included</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">Active</span>
                                <ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" />
                            </div>
                        </summary>

                        <div className="space-y-4 p-4 pt-1">
                            {group.bots.map(bot => renderBotCard(bot))}
                        </div>
                    </details>
                ))}

                {/* 2. Standalone Bots */}
                {standaloneBots.length > 0 && (
                    <div className="space-y-4">
                        {activeBundles.length > 0 && (
                            <h4 className="text-slate-500 font-bold text-sm ml-2 uppercase tracking-wide">Single Bots</h4>
                        )}
                        {standaloneBots.map(bot => renderBotCard(bot))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setPendingBotId(null);
                }}
                onConfirm={() => {
                    setIsConfirmModalOpen(false);
                    handleConfirmSave();
                }}
                title="Confirm Save & Connect"
                message="Are you sure you want to save your API credentials and connect this bot? This action will activate the bot with your trading platform."
            />

            {/* Password Verification Modal for Secure Edit */}
            <PasswordVerificationModal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setBotIdToEdit(null);
                }}
                onVerify={handlePasswordVerified}
                title="Secure Edit Verification"
                description="For your security, please enter your password to edit sensitive API configurations."
            />

            {/* Toast Notification */}
            {error && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <Info size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">{error}</span>
                    </div>
                </div>
            )}
        </div >
    );
}
