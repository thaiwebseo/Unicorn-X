"use client";

import { useState, useEffect } from 'react';
import { Play, Pause, Settings, Info, Search, Filter, Eye, X, Copy, Edit2, Check } from 'lucide-react';
import PasswordVerificationModal from '@/components/PasswordVerificationModal';

interface Bot {
    id: string;
    name: string;
    status: string;
    apiKey: string;
    secretKey: string;
    tradingViewEmail: string | null;
    user: {
        email: string;
        name: string | null;
    };
    updatedAt: string;
    startDate: string | null;
    endDate: string | null;
    sourcePlan?: string;
    isBundle?: boolean;
}

export default function BotManagement() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedBotForDetails, setSelectedBotForDetails] = useState<Bot | null>(null);

    // New states for editing expiry
    const [editingExpiryBotId, setEditingExpiryBotId] = useState<string | null>(null);
    const [tempExpiryDate, setTempExpiryDate] = useState<string>('');

    useEffect(() => {
        // Initial fetch
        fetchBots();

        // Auto-refresh every 5 seconds
        const intervalId = setInterval(() => {
            if (!document.hidden) {
                fetchBots(true);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchBots = async (silent = false) => {
        try {
            const res = await fetch('/api/admin/bots');
            if (res.ok) {
                const data = await res.json();
                setBots(data);
            }
        } catch (error) {
            console.error('Error fetching bots:', error);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (botId: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/bots', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botId, status: newStatus })
            });

            if (res.ok) {
                fetchBots(); // Refresh list
            } else {
                const errorMsg = await res.text();
                alert(`Failed to update status: ${errorMsg}`);
            }
        } catch (error) {
            alert('Error updating status: ' + error);
        }
    };

    const handleUpdateExpiry = async (botId: string) => {
        try {
            const res = await fetch('/api/admin/bots', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botId, endDate: tempExpiryDate })
            });

            if (res.ok) {
                setEditingExpiryBotId(null);
                fetchBots(); // Refresh to show new date
            } else {
                const errorMsg = await res.text();
                alert(`Failed to update expiry: ${errorMsg}`);
            }
        } catch (error) {
            alert('Error updating expiry: ' + error);
        }
    };

    const startEditingExpiry = (bot: Bot) => {
        setEditingExpiryBotId(bot.id);
        // Format date for input: YYYY-MM-DD
        if (bot.endDate) {
            const date = new Date(bot.endDate);
            const formatted = date.toISOString().split('T')[0];
            setTempExpiryDate(formatted);
        } else {
            setTempExpiryDate(new Date().toISOString().split('T')[0]);
        }
    };

    const handleInitViewDetails = (bot: Bot) => {
        setSelectedBotForDetails(bot);
        setIsPasswordModalOpen(true);
    };

    const handlePasswordVerified = () => {
        // Close password modal and open details modal
        setIsPasswordModalOpen(false);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedBotForDetails(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    const filteredBots = bots.filter(bot => {
        const matchesFilter = filter === 'ALL' || bot.status === filter;
        const matchesSearch = bot.name.toLowerCase().includes(search.toLowerCase()) ||
            bot.user.email.toLowerCase().includes(search.toLowerCase()) ||
            (bot.user.name && bot.user.name.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        const styles: { [key: string]: string } = {
            'WAITING_FOR_SETUP': 'bg-yellow-100 text-yellow-800',
            'SETTING_UP': 'bg-blue-100 text-blue-800',
            'READY': 'bg-indigo-100 text-indigo-800',
            'RUNNING': 'bg-green-100 text-green-800',
            'PAUSED': 'bg-gray-100 text-gray-800',
            'SUSPENDED': 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-400 italic">N/A</span>;
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Bot Management</h1>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search user or bot..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'SETTING_UP', 'READY', 'RUNNING'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-sm font-bold text-slate-600">User</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Bot Name / Plan</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Start Date</th>
                            <th className="p-4 text-sm font-bold text-slate-600">Expire Date</th>
                            <th className="p-4 text-sm font-bold text-slate-600 text-center">API</th>
                            <th className="p-4 text-sm font-bold text-slate-600 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading...</td></tr>
                        ) : filteredBots.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">No bots found</td></tr>
                        ) : (
                            filteredBots.map(bot => (
                                <tr key={bot.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{bot.user.name || 'Unknown'}</div>
                                        <div className="text-sm text-slate-400">{bot.user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-cyan-600">{bot.name}</div>
                                        {bot.sourcePlan && (
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                {bot.isBundle && (
                                                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px] tracking-wide">
                                                        BUNDLE
                                                    </span>
                                                )}
                                                <span className={bot.isBundle ? 'text-purple-600 font-medium' : 'text-slate-400'}>
                                                    {bot.sourcePlan}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">{getStatusBadge(bot.status)}</td>
                                    <td className="p-4 text-sm text-slate-600">{formatDate(bot.startDate)}</td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {editingExpiryBotId === bot.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={tempExpiryDate}
                                                    onChange={(e) => setTempExpiryDate(e.target.value)}
                                                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                />
                                                <button onClick={() => handleUpdateExpiry(bot.id)} className="text-green-500 hover:text-green-600">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingExpiryBotId(null)} className="text-red-500 hover:text-red-600">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group">
                                                <span>{formatDate(bot.endDate)}</span>
                                                <button
                                                    onClick={() => startEditingExpiry(bot)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-500 transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleInitViewDetails(bot)}
                                            className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"
                                            title="View API Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select
                                            value={bot.status}
                                            onChange={(e) => handleUpdateStatus(bot.id, e.target.value)}
                                            disabled={bot.status === 'WAITING_FOR_SETUP'}
                                            title={bot.status === 'WAITING_FOR_SETUP' ? "Wait for user to submit API keys" : ""}
                                            className={`px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white shadow-sm transition-all ${bot.status === 'WAITING_FOR_SETUP'
                                                ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
                                                : 'text-slate-700 cursor-pointer hover:border-slate-300'
                                                }`}
                                        >
                                            <option value="WAITING_FOR_SETUP">WAITING_FOR_SETUP</option>
                                            <option value="SETTING_UP">SETTING_UP</option>
                                            <option value="READY">READY</option>
                                            <option value="RUNNING">RUNNING</option>
                                            <option value="PAUSED">PAUSED</option>
                                            <option value="SUSPENDED">SUSPENDED</option>
                                            <option value="ERROR">ERROR</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Password Verification Modal */}
            <PasswordVerificationModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onVerify={handlePasswordVerified}
                title="Access Restricted"
                description="Please enter your admin password to view sensitive bot credentials."
            />

            {/* Bot Details Modal */}
            {isDetailsModalOpen && selectedBotForDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Bot Credentials</h3>
                                <p className="text-sm text-slate-500">{selectedBotForDetails.name}</p>
                            </div>
                            <button
                                onClick={closeDetailsModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* API Key */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-700 font-mono break-all border border-slate-100">
                                        {selectedBotForDetails.apiKey || <span className="text-slate-400 italic">Not set</span>}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedBotForDetails.apiKey)}
                                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors border border-slate-100"
                                        title="Copy"
                                        disabled={!selectedBotForDetails.apiKey}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Secret Key */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Secret Key</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-700 font-mono break-all border border-slate-100">
                                        {selectedBotForDetails.secretKey || <span className="text-slate-400 italic">Not set</span>}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedBotForDetails.secretKey)}
                                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors border border-slate-100"
                                        title="Copy"
                                        disabled={!selectedBotForDetails.secretKey}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* TradingView Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">TradingView Email</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-700 font-mono break-all border border-slate-100">
                                        {selectedBotForDetails.tradingViewEmail || <span className="text-slate-400 italic">Not set</span>}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedBotForDetails.tradingViewEmail || '')}
                                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors border border-slate-100"
                                        title="Copy"
                                        disabled={!selectedBotForDetails.tradingViewEmail}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={closeDetailsModal}
                                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
