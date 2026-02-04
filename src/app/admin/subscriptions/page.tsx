"use client";

import { useState, useEffect } from 'react';
import { CreditCard, User, Package, Calendar, CheckCircle2, AlertCircle, Save, Plus, Search, X } from 'lucide-react';

interface UserItem {
    id: string;
    name: string | null;
    email: string;
}

interface PlanItem {
    id: string;
    name: string;
    category: string;
    tier: string;
    priceMonthly: number;
    priceYearly: number;
}

export default function SubscriptionsManagement() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [months, setMonths] = useState('1');
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/subscriptions/manual');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignPlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !selectedPlanId) return;

        setProcessing(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const res = await fetch('/api/admin/subscriptions/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUserId,
                    planId: selectedPlanId,
                    months: parseInt(months)
                })
            });

            if (res.ok) {
                setSuccessMessage('Plan assigned successfully! Customer can now view it in their dashboard.');
                setSelectedUserId('');
                setSelectedPlanId('');
                setMonths('1');
            } else {
                const err = await res.text();
                setErrorMessage(err || 'Failed to assign plan');
            }
        } catch (error) {
            setErrorMessage('Error processing request');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center">
                    <CreditCard size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Subscription Management</h1>
                    <p className="text-slate-500">Assign manual packages and manage user subscriptions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Manual Assignment Form */}
                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleAssignPlan} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Plus className="text-cyan-500" size={20} />
                            <h2 className="text-lg font-bold text-slate-800">Manual Plan Adjustment</h2>
                        </div>

                        <p className="text-sm text-slate-400">
                            Use this tool to manually grant access to users (e.g., cash payments, VIP gifts, or trial extensions).
                        </p>

                        <div className="space-y-4">
                            {/* User Selection */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                    <User size={12} /> Target Customer
                                </label>
                                <select
                                    required
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                >
                                    <option value="">-- Select Customer --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.name || 'No Name'} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Plan Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <Package size={12} /> Select Plan
                                    </label>
                                    <select
                                        required
                                        value={selectedPlanId}
                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    >
                                        <option value="">-- Choose Package -- </option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.category} - {p.name} ({p.tier})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                        <Calendar size={12} /> Duration (Months)
                                    </label>
                                    <select
                                        value={months}
                                        onChange={(e) => setMonths(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    >
                                        {[1, 2, 3, 6, 12, 24].map(m => (
                                            <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {successMessage && (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 size={20} className="shrink-0" />
                                <span className="text-sm font-medium">{successMessage}</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="text-sm font-medium">{errorMessage}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !selectedUserId || !selectedPlanId}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                            {processing ? 'Processing...' : 'Activate Subscription Now'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Help / Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <AlertCircle className="text-cyan-400" size={18} />
                            Admin Notice
                        </h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                This action will bypass the Stripe payment system.
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                The customer will receive immediate access to the bot features.
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                Expiry date is calculated automatically from today.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-3xl">
                        <h3 className="font-bold text-cyan-800 mb-2">Need Help?</h3>
                        <p className="text-sm text-cyan-700 leading-relaxed">
                            For complex adjustments or subscription cancellations, please use the User Management details view.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
