"use client";

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface DashboardHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
    onConfigsClick?: () => void; // Optional: Link to Profile settings
}

export default function DashboardHeader({ user, onConfigsClick }: DashboardHeaderProps) {
    const displayName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="bg-white rounded-2xl p-5 lg:p-8 mb-6 lg:mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center relative overflow-hidden shadow-sm border border-slate-100">
            {/* Gradient Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-50 pointer-events-none"></div>

            <div className="flex items-center gap-3 lg:gap-6 z-10 w-full lg:w-auto">
                {/* Large Profile Icon 'J' */}
                <div className="w-10 h-10 lg:w-20 lg:h-20 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xl lg:text-4xl font-bold shadow-lg ring-2 lg:ring-4 ring-white flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h1 className="text-xl lg:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                        Hi, <span className="text-cyan-500">{displayName}</span>
                    </h1>
                    <p className="text-slate-500 text-xs lg:text-lg mt-0.5 lg:mt-1 leading-snug">
                        Welcome back to use it again. Click to{' '}
                        <button
                            onClick={onConfigsClick}
                            className="text-cyan-500 underline underline-offset-2 hover:text-cyan-600 font-medium"
                        >
                            Profile Setting
                        </button>
                    </p>
                </div>

                {/* Mobile Sign Out Button (Icon Only) */}
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="lg:hidden p-2 bg-white border border-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all shadow-sm"
                >
                    <LogOut size={18} />
                </button>
            </div>

            {/* Desktop Sign Out Button */}
            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden lg:flex mt-6 lg:mt-0 z-10 items-center gap-2 px-6 py-2 bg-white border border-cyan-200 text-cyan-600 rounded-full hover:bg-cyan-50 transition-all shadow-sm font-medium"
            >
                <span>Sign out</span>
                <LogOut size={18} />
            </button>
        </div>
    );
}
