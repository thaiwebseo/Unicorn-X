"use client";

import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon: LucideIcon;
    color: string;
}

export default function StatCard({ title, value, change, isPositive, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {change && (
                    <div className={`flex items-center text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {change}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}
