"use client";

import { useState, useEffect } from 'react';
import { Users, CreditCard, Bot } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSub: 0,
        activeBots: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-500 font-medium mb-1">Total Users</h3>
                        <p className="text-3xl font-black text-slate-800">{loading ? '...' : stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>

                {/* Stats Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-500 font-medium mb-1">Active Subscriptions</h3>
                        <p className="text-3xl font-black text-cyan-600">{loading ? '...' : stats.activeSub}</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-xl flex items-center justify-center">
                        <CreditCard size={24} />
                    </div>
                </div>

                {/* Stats Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-500 font-medium mb-1">Active Bots</h3>
                        <p className="text-3xl font-black text-indigo-600">{loading ? '...' : stats.activeBots}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                        <Bot size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-cyan-500" size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Everything looks great!</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    Select a menu item from the sidebar to manage your users, bots, and subscriptions.
                </p>
            </div>
        </div>
    );
}

import { CheckCircle } from 'lucide-react';

