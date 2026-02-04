"use client";

import { Bot, CreditCard, History, LifeBuoy, User, Users, LogOut, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

type TabId = 'my-bot' | 'subscription' | 'history' | 'support' | 'profile';

interface SidebarProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isExpanded, setIsExpanded }: SidebarProps) {
    const menuItems = [
        { id: 'my-bot', label: 'My Bot', icon: Bot },
        { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
        { id: 'history', label: 'Billing History', icon: History },
        { id: 'support', label: 'Support/Help Center', icon: LifeBuoy },
        { id: 'profile', label: 'Profile Setting', icon: User },
    ];

    const handleItemClick = (id: TabId) => {
        setActiveTab(id);
        // On mobile/tablet, collapse sidebar after selection
        if (window.innerWidth < 1024) {
            setIsExpanded(false);
        }
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <aside
            className={`bg-white h-screen fixed left-0 top-0 border-r border-slate-100 flex flex-col z-50 transition-all duration-300 ${isExpanded ? 'w-72 shadow-xl' : 'w-20'}`}
        >
            {/* Logo Section */}
            <div className="p-6 pb-2 flex items-center justify-center">
                {isExpanded ? (
                    <Link href="/" className="inline-block overflow-hidden whitespace-nowrap">
                        <div className="w-[150px]">
                            <Image
                                src="/images/logo.png"
                                alt="Unicorn X Logo"
                                width={150}
                                height={40}
                                className="h-auto w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>
                ) : (
                    <div className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 cursor-pointer transition-colors" onClick={toggleSidebar}>
                        <Menu size={20} />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden">
                <div className="space-y-4 mt-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => isExpanded ? handleItemClick(item.id as TabId) : setIsExpanded(true)}
                                className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-200 group whitespace-nowrap ${isActive
                                    ? 'bg-cyan-50 text-cyan-600 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    } ${!isExpanded && 'justify-center'}`}
                                title={!isExpanded ? item.label : ''}
                            >
                                <Icon size={22} className={`min-w-[22px] ${isActive ? 'text-cyan-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {isExpanded && (
                                    <span className={`font-medium ${isActive ? 'font-bold' : ''} transition-opacity duration-300`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {/* Disabled Menu Item */}
                    <button
                        className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl text-slate-300 cursor-not-allowed whitespace-nowrap ${!isExpanded && 'justify-center'}`}
                        disabled
                    >
                        <Users size={22} className="min-w-[22px]" />
                        {isExpanded && (
                            <>
                                <span className="font-medium">Refer & Earn</span>
                                <span className="ml-auto text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Soon</span>
                            </>
                        )}
                    </button>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className={`p-4 mt-auto ${!isExpanded && 'flex flex-col items-center'}`}>
                {/* Guide Setup Bot Image Placeholder */}
                {isExpanded && (
                    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative bg-gradient-to-br from-cyan-500 to-blue-600 h-32 flex items-center justify-center text-white p-4">
                        <div className="text-center">
                            <p className="font-bold text-lg">Guide Setup Bot</p>
                            <p className="text-xs opacity-80">Click to learn more</p>
                        </div>
                    </div>
                )}

                {/* Sign Out Button */}
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium whitespace-nowrap ${!isExpanded && 'justify-center'}`}
                    title={!isExpanded ? "Sign out" : ""}
                >
                    <LogOut size={20} className="min-w-[20px]" />
                    {isExpanded && <span>Sign out</span>}
                </button>
            </div>
        </aside>
    );
}
