"use client";

import { LayoutDashboard, Users, Bot, CreditCard, Settings, LogOut, Package, Book } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/x-control', label: 'Overview', icon: LayoutDashboard },
        { href: '/x-control/users', label: 'User Management', icon: Users },
        { href: '/x-control/bots', label: 'Bot Management', icon: Bot },
        { href: '/x-control/subscriptions', label: 'Subscriptions', icon: CreditCard },
        { href: '/x-control/packages', label: 'Packages', icon: Package },
        { href: '/x-control/guides', label: 'Guides', icon: Book },
        // { href: '/x-control/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
            {/* Admin Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                        A
                    </div>
                    <span>Unicorn<span className="text-cyan-500">X</span> Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
