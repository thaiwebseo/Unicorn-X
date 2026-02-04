"use client";

import { useState, useEffect, Fragment } from 'react';
import { Search, Plus, Package, Edit2, Check, X, ShieldAlert, MoreVertical, Archive, Calendar } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    category: string;
    tier: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    includedBots?: string[];
    isActive: boolean;
}

export default function PackageManagement() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Smart Timer DCA',
        tier: 'Starter',
        priceMonthly: 0,
        priceYearly: 0,
        featuresString: '', // Helper for textarea
        includedBots: [] as string[],
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/packages');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                category: plan.category,
                tier: plan.tier,
                priceMonthly: plan.priceMonthly,
                priceYearly: plan.priceYearly,
                featuresString: plan.features.join('\n'),
                includedBots: plan.includedBots || [],
                isActive: plan.isActive
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                category: 'Smart Timer DCA',
                tier: 'Starter',
                priceMonthly: 0,
                priceYearly: 0,
                featuresString: '',
                includedBots: [],
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...formData,
                features: formData.featuresString.split('\n').filter(f => f.trim() !== ''),
                id: editingPlan?.id // Only needed for update
            };

            const method = editingPlan ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/packages', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchPlans();
            } else {
                const error = await res.text();
                alert(`Operation failed: ${error}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    const uniqueCategories = Array.from(new Set(plans.map(p => p.category))).sort();
    const uniqueTiers = Array.from(new Set(plans.map(p => p.tier))).sort();

    const filteredPlans = plans.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || p.category === filter;
        return matchesSearch && matchesFilter;
    });

    // Grouping logic for the table
    const groupedPlans = filteredPlans.reduce((acc, plan) => {
        if (!acc[plan.category]) acc[plan.category] = [];
        acc[plan.category].push(plan);
        return acc;
    }, {} as Record<string, Plan[]>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Package Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
                >
                    <Plus size={18} />
                    Add Plan
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search plans by name or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        ALL ({plans.length})
                    </button>
                    {uniqueCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === cat ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            {cat.toUpperCase()} ({plans.filter(p => p.category === cat).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Name & Tier</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Monthly</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Yearly</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-12 text-center text-slate-400">Loading plans...</td></tr>
                        ) : filteredPlans.length === 0 ? (
                            <tr><td colSpan={6} className="p-12 text-center text-slate-400">No plans found</td></tr>
                        ) : (
                            Object.keys(groupedPlans).sort().map((category) => (
                                <Fragment key={category}>
                                    {/* Category Header Row */}
                                    <tr className="bg-slate-50/30">
                                        <td colSpan={6} className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 border-y border-slate-100">
                                            {category} — {groupedPlans[category].length} items
                                        </td>
                                    </tr>
                                    {groupedPlans[category].map(plan => (
                                        <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${plan.tier === 'Expert' ? 'bg-purple-100 text-purple-600' : plan.tier === 'Pro' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-600'}`}>
                                                        {plan.tier.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 flex items-center gap-2">
                                                            {plan.name.replace(` - ${plan.tier}`, '')}
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${plan.tier === 'Expert' ? 'bg-purple-600 text-white' : plan.tier === 'Pro' ? 'bg-cyan-600 text-white' : 'bg-slate-400 text-white'}`}>
                                                                {plan.tier}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-medium">{plan.features.length} features included</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs font-bold text-slate-500">{plan.category}</span>
                                            </td>
                                            <td className="p-4 text-center font-mono font-bold text-slate-700">${plan.priceMonthly}</td>
                                            <td className="p-4 text-center font-mono font-bold text-slate-700">${plan.priceYearly}</td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    {plan.isActive ? (
                                                        <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase bg-green-50 px-2 py-1 rounded-lg border border-green-100 leading-none">
                                                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 leading-none">
                                                            <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const link = `${window.location.origin}/checkout?plan=${encodeURIComponent(plan.name)}&id=${plan.id}&type=monthly&price=${plan.priceMonthly}`;
                                                            navigator.clipboard.writeText(link);
                                                            alert('Copied MONTHLY Plan Link!');
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                        title="Copy Monthly Link"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const link = `${window.location.origin}/checkout?plan=${encodeURIComponent(plan.name)}&id=${plan.id}&type=yearly&price=${plan.priceYearly}`;
                                                            navigator.clipboard.writeText(link);
                                                            alert('Copied YEARLY Plan Link!');
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                        title="Copy Yearly Link"
                                                    >
                                                        <Calendar size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(plan)}
                                                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upsert Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                                <p className="text-sm text-slate-500">Manage plan pricing and features</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Plan Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Pro Plan"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <div className="space-y-2">
                                        <select
                                            value={uniqueCategories.includes(formData.category) ? formData.category : 'CUSTOM'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'CUSTOM') {
                                                    setFormData({ ...formData, category: '' });
                                                } else {
                                                    setFormData({ ...formData, category: val });
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                        >
                                            {uniqueCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            <option value="CUSTOM">+ Add New Category...</option>
                                        </select>

                                        {!uniqueCategories.includes(formData.category) && (
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="Enter new category name"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none animate-in slide-in-from-top-2 duration-200"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Tier</label>
                                    <div className="space-y-2">
                                        <select
                                            value={uniqueTiers.includes(formData.tier) ? formData.tier : 'CUSTOM'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'CUSTOM') {
                                                    setFormData({ ...formData, tier: '' });
                                                } else {
                                                    setFormData({ ...formData, tier: val });
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                        >
                                            {uniqueTiers.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                            <option value="CUSTOM">+ Add New Tier...</option>
                                        </select>

                                        {!uniqueTiers.includes(formData.tier) && (
                                            <input
                                                type="text"
                                                value={formData.tier}
                                                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                                placeholder="Enter new tier name"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none animate-in slide-in-from-top-2 duration-200"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Monthly Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.priceMonthly}
                                        onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Yearly Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.priceYearly}
                                        onChange={(e) => setFormData({ ...formData, priceYearly: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Features (One per line)</label>
                                <textarea
                                    rows={5}
                                    value={formData.featuresString}
                                    onChange={(e) => setFormData({ ...formData, featuresString: e.target.value })}
                                    placeholder="Bot Logic 24/7&#10;Unlimited Pairs&#10;Priority Support"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm"
                                />
                            </div>

                            {formData.category === 'Bundles' && ['starter bundle', 'pro bundle', 'expert bundle'].includes(formData.tier.toLowerCase()) && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Included Bots (Bundle Composition)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(() => {
                                            // 1. Get current tier level
                                            const currentTier = formData.tier.toLowerCase();

                                            // 2. Define allowed source tiers based on current package tier
                                            // Requirement: 
                                            // - Starter Bundle: Only Starter
                                            // - Pro Bundle: Starter + Pro
                                            // - Expert Bundle: Starter + Pro + Expert
                                            // - Others (e.g. Starter, Pro, Expert): Allow ALL (Flexible)
                                            let allowedTiers: string[] = [];
                                            let isStrictBundle = false;

                                            if (currentTier === 'starter bundle') {
                                                allowedTiers = ['starter'];
                                                isStrictBundle = true;
                                            } else if (currentTier === 'pro bundle') {
                                                allowedTiers = ['starter', 'pro'];
                                                isStrictBundle = true;
                                            } else if (currentTier === 'expert bundle') {
                                                allowedTiers = ['starter', 'pro', 'expert'];
                                                isStrictBundle = true;
                                            } else {
                                                // Fallback for custom tiers OR standard tiers -> Allow All
                                                allowedTiers = ['starter', 'pro', 'expert', 'ultimate', 'basic', 'advanced'];
                                                isStrictBundle = false;
                                            }

                                            // 3. Filter plans to find available bots
                                            const availableBots = Array.from(new Set(
                                                plans
                                                    .filter(p => {
                                                        // Filter out Inactive Plans
                                                        if (!p.isActive) return false;

                                                        const pTier = p.tier.toLowerCase();
                                                        // EXCLUDE other Bundles
                                                        if (pTier.includes('bundle')) return false;

                                                        // If strict bundle, check allowed tiers
                                                        if (isStrictBundle) {
                                                            return allowedTiers.some(t => pTier === t || pTier.includes(t));
                                                        }

                                                        // If not strict (normal tier), allow everything (except bundles)
                                                        return true;
                                                    })
                                                    .map(p => p.name)
                                                    .filter(name => name !== formData.name) // Exclude self
                                            )).sort();

                                            if (availableBots.length === 0) {
                                                return <p className="text-sm text-slate-400 col-span-2 italic">No individual bots found to include.</p>;
                                            }

                                            // 4. Fallback if no bots found (e.g. fresh install)
                                            const displayBots = availableBots.length > 0
                                                ? availableBots
                                                : ['Smart Timer DCA', 'Sniper Bot', 'Grid Bot', 'Copy Trade'];

                                            return displayBots.map(botType => (
                                                <div key={botType} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`bot-${botType}`}
                                                        checked={formData.includedBots?.includes(botType) || false}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setFormData(prev => {
                                                                const current = prev.includedBots || [];
                                                                if (checked) {
                                                                    return { ...prev, includedBots: [...current, botType] };
                                                                } else {
                                                                    return { ...prev, includedBots: current.filter(b => b !== botType) };
                                                                }
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                                                    />
                                                    <label htmlFor={`bot-${botType}`} className="text-sm text-slate-700 font-medium cursor-pointer select-none">
                                                        {botType}
                                                    </label>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                        Logic: <strong>{formData.tier}</strong> allows bots from <strong>{
                                            formData.tier.toLowerCase() === 'starter bundle' ? 'Starter' :
                                                formData.tier.toLowerCase() === 'pro bundle' ? 'Starter + Pro' :
                                                    formData.tier.toLowerCase() === 'expert bundle' ? 'Starter + Pro + Expert' : 'Flexible Logic (All Tiers)'
                                        }</strong>.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block">Package Status</label>
                                    <p className="text-xs text-slate-500">
                                        {formData.isActive ? 'This package is currently OPEN for purchase.' : 'This package is CLOSED (Hidden from store).'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span
                                        className={`${formData.isActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                            >
                                {saving ? <span className="animate-spin w-4 h-4 rounded-full border-2 border-white/30 border-t-white" /> : <Check size={18} />}
                                Save Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
