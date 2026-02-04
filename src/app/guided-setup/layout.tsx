"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function GuidedSetupLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Mapping steps to numbers
    const getStep = () => {
        if (pathname.includes('/create-key')) return 2;
        if (pathname.includes('/setup-bot')) return 3;
        return 2;
    };

    const currentStep = getStep();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900 tracking-tight">unicorn</span>
                                <div className="bg-cyan-500 rounded-lg p-1">
                                    <span className="text-xl font-bold text-white block leading-none">X</span>
                                </div>
                            </Link>
                        </div>

                        {/* Simple Menu for Guide */}
                        <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
                            <span className="hidden md:block">Home</span>
                            <span className="hidden md:block">Products</span>
                            <span className="hidden md:block">How it Work</span>
                            <span className="hidden md:block">Features</span>
                            <span className="hidden md:block">Pricing</span>
                            <span className="hidden md:block">Testimonials</span>
                            <span className="hidden md:block">FAQ</span>
                            <span className="hidden md:block">Contact</span>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900">{session?.user?.name || 'User'}</span>
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                                {(session?.user?.name?.[0] || 'U').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <div className="relative mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-slate-500 mb-1">Welcome, <span className="font-bold text-slate-900">{session?.user?.name || 'User'}</span></p>
                            <h1 className="text-4xl font-extrabold text-cyan-500 mb-2">Step by Step</h1>
                            <p className="text-lg text-slate-600">{currentStep} of 3 Guided setup your UnicornX bot</p>
                        </div>

                        {/* Decorative Illustration (Simplified) */}
                        <div className="hidden lg:block absolute right-0 top-0 opacity-20 pointer-events-none">
                            {/* You can add SVG or Image here later */}
                            <div className="w-64 h-32 border-4 border-slate-300 rounded-xl transform rotate-12"></div>
                        </div>

                        {/* Skip Button */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-600 font-bold rounded-lg hover:bg-cyan-50 transition-colors z-10 bg-white"
                        >
                            Skip guided setup
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Steps */}
                    <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
                        {/* Step 1 */}
                        <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${currentStep >= 1 ? 'bg-slate-200' : 'bg-slate-100 opacity-50'}`}>
                            <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-xl font-bold text-slate-500">1</div>
                            <div>
                                <h3 className="font-bold text-slate-700">Choose Plan</h3>
                                <p className="text-xs text-slate-500">Select the plan you are interested in</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${currentStep === 2 ? 'bg-cyan-50 border-2 border-cyan-500 shadow-sm' : (currentStep > 2 ? 'bg-slate-200' : 'bg-slate-100 opacity-50')}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md ${currentStep >= 2 ? 'bg-cyan-500' : 'bg-slate-300'}`}>2</div>
                            <div>
                                <h3 className={`font-bold ${currentStep === 2 ? 'text-cyan-600' : 'text-slate-700'}`}>Create Key</h3>
                                <p className="text-xs text-slate-500">Create API / Secret Key and get Webhook</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${currentStep === 3 ? 'bg-cyan-50 border-2 border-cyan-500 shadow-sm' : 'bg-slate-100'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white transition-colors ${currentStep >= 3 ? 'bg-cyan-500 shadow-md' : 'bg-slate-300'}`}>3</div>
                            <div>
                                <h3 className={`font-bold ${currentStep === 3 ? 'text-cyan-600' : 'text-slate-700'}`}>Setup Bot</h3>
                                <p className="text-xs text-slate-500">Bot usage and installation guide</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {children}
                    </div>

                </div>
            </main>
        </div>
    );
}
