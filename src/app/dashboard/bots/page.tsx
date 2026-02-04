"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Play, Pause, MoreVertical, Settings, Trash2 } from "lucide-react";

// Mock Data Type
interface Bot {
    id: string;
    name: string;
    strategy: string;
    pair: string;
    status: "RUNNING" | "STOPPED" | "PAUSED";
    pnl: string;
    pnlValue: number;
}

export default function BotsPage() {
    const [bots, setBots] = useState<Bot[]>([
        {
            id: "1",
            name: "BTC Scalper",
            strategy: "Bollinger DCA",
            pair: "BTC/USDT",
            status: "RUNNING",
            pnl: "+12.5%",
            pnlValue: 12.5
        },
        {
            id: "2",
            name: "ETH Accumulator",
            strategy: "Timer DCA",
            pair: "ETH/USDT",
            status: "STOPPED",
            pnl: "-2.1%",
            pnlValue: -2.1
        },
        {
            id: "3",
            name: "Solana Cycle",
            strategy: "MVRV Cycle DCA",
            pair: "SOL/USDT",
            status: "RUNNING",
            pnl: "+45.3%",
            pnlValue: 45.3
        }
    ]);

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Bots</h1>
                    <p className="text-slate-500">Manage and monitor your automated trading bots.</p>
                </div>
                <Link
                    href="/dashboard/bots/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-[#00C2CC] hover:bg-cyan-600 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Bot
                </Link>
            </div>

            {/* Bots List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Bot Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Strategy
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Total PnL
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {bots.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No bots found. Create one to get started!
                                    </td>
                                </tr>
                            ) : (
                                bots.map((bot) => (
                                    <tr key={bot.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold">
                                                    {bot.pair.split('/')[0].substring(0, 1)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{bot.name}</div>
                                                    <div className="text-xs text-slate-500">{bot.pair}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{bot.strategy}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bot.status === 'RUNNING'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                {bot.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${bot.pnlValue >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {bot.pnl}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button className="text-slate-400 hover:text-cyan-600 transition-colors" title="Start/Stop">
                                                    {bot.status === 'RUNNING' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                                </button>
                                                <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                                                    <Settings className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
