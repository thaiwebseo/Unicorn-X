"use client";

import { useState, useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

interface Order {
    id: string;
    amount: number;
    planName: string | null;
    paymentMethod: string | null;
    status: string;
    createdAt: string;
}

export default function BillingHistoryView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }) + ', ' + date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generateInvoiceId = (id: string) => {
        return `inv-${id.substring(0, 8)}`;
    };

    const generateTransactionId = (index: number) => {
        return `#${String(orders.length - index).padStart(6, '0')}`;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Billing History</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 size={20} className="animate-spin" />
                            Loading billing history...
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        No billing history available.
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Card List */}
                        <div className="md:hidden divide-y divide-slate-50">
                            {orders.map((order, index) => (
                                <div key={order.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-slate-800">{generateTransactionId(index)}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${order.status === 'PAID' ? 'bg-cyan-500 shadow-cyan-500/20' : 'bg-red-500 shadow-red-500/20'
                                            }`}>
                                            {order.status === 'PAID' ? 'Success' : order.status}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">{order.planName || 'N/A'}</div>
                                            <div className="text-[10px] text-slate-400">Invoice: {generateInvoiceId(order.id)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-cyan-500">${order.amount.toFixed(2)}</div>
                                            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-bold uppercase">
                                                <CreditCard size={12} className="text-slate-400" />
                                                <span>{order.paymentMethod || 'CARD'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-500 text-sm font-bold">
                                        <th className="p-6 pb-4">Transaction</th>
                                        <th className="p-6 pb-4">Plan</th>
                                        <th className="p-6 pb-4">Payment</th>
                                        <th className="p-6 pb-4">Coupon</th>
                                        <th className="p-6 pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-800 text-lg">{generateTransactionId(index)}</div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    Invoice: {generateInvoiceId(order.id)}
                                                    <br />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-cyan-500 text-lg">${order.amount.toFixed(2)}</div>
                                                <div className="text-sm font-bold text-slate-800">{order.planName || 'N/A'}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold uppercase">
                                                    <CreditCard size={20} className="text-slate-400" />
                                                    <span>{order.paymentMethod || 'CARD'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-slate-500 font-medium">-</td>
                                            <td className="p-6">
                                                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm ${order.status === 'PAID' ? 'bg-cyan-500 shadow-cyan-500/20' : 'bg-red-500 shadow-red-500/20'
                                                    }`}>
                                                    {order.status === 'PAID' ? 'Success' : order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
