"use client";

import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Edit2, Search, Calendar, Hash, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface Coupon {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    expiryDate: string | null;
    usageLimit: number | null;
    limitPerUser: number | null;
    usageCount: number;
    isActive: boolean;
    createdAt: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        expiryDate: '',
        usageLimit: '',
        limitPerUser: null as number | null
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCoupon.code || !newCoupon.discountValue) {
            Swal.fire('Error', 'Please fill in required fields', 'error');
            return;
        }

        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newCoupon,
                    code: newCoupon.code.toUpperCase(),
                    discountValue: Number(newCoupon.discountValue),
                    usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null,
                    limitPerUser: newCoupon.limitPerUser,
                    expiryDate: newCoupon.expiryDate || null
                })
            });

            if (res.ok) {
                Swal.fire('Success', 'Coupon created', 'success');
                setIsCreating(false);
                setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: '', limitPerUser: null });
                fetchCoupons();
            } else {
                const error = await res.text();
                throw new Error(error);
            }
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to create', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This coupon will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire('Deleted!', 'Coupon has been removed.', 'success');
                    fetchCoupons();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });

            if (res.ok) {
                setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <Ticket className="text-cyan-500" />
                        Coupons Management
                    </h1>
                    <p className="text-slate-500 mt-1">Create and manage discount codes for your customers.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/20"
                    >
                        <Plus size={20} />
                        New Coupon
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Create New Coupon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Coupon Code</label>
                            <input
                                type="text"
                                value={newCoupon.code}
                                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. DISCOUNT50"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Discount Type</label>
                            <select
                                value={newCoupon.discountType}
                                onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none bg-white"
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Discount Value</label>
                            <input
                                type="number"
                                value={newCoupon.discountValue}
                                onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date (Optional)</label>
                            <input
                                type="date"
                                value={newCoupon.expiryDate}
                                onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Usage Limit (Global)</label>
                            <input
                                type="number"
                                value={newCoupon.usageLimit}
                                onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                placeholder="Infinite if empty"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center pt-8">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${newCoupon.limitPerUser ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300 bg-white'}`}>
                                {newCoupon.limitPerUser && <CheckCircle2 size={16} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={!!newCoupon.limitPerUser}
                                onChange={e => setNewCoupon({ ...newCoupon, limitPerUser: e.target.checked ? 1 : null })}
                            />
                            <span className="text-sm font-bold text-slate-700">Limit 1 use per user</span>
                        </label>
                    </div>
                    <div className="flex gap-3 pt-8">
                        <button
                            onClick={handleCreate}
                            className="flex-1 bg-cyan-600 text-white font-bold py-2 rounded-xl hover:bg-cyan-700 transition-all shadow-md"
                        >
                            Save Coupon
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-6 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by coupon code..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Expiry</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Loading coupons...</td></tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No coupons found.</td></tr>
                            ) : filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-slate-900 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-lg border border-cyan-100">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">
                                                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {coupon.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Hash size={14} className="text-slate-400" />
                                            <span className="font-medium text-slate-800">{coupon.usageCount}</span>
                                            <span className="text-slate-400">/</span>
                                            <span className="text-slate-500">{coupon.usageLimit || '∞'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleStatus(coupon.id, coupon.isActive)}>
                                            {coupon.isActive ? (
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                                                    <XCircle size={12} />
                                                    Inactive
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
