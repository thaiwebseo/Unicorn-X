"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <Image src="/images/logo.png" alt="UnicornX" width={150} height={40} className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="text-cyan-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/#why-unicornx" className="text-slate-600 hover:text-cyan-600 transition-colors">
                            Why Unicorn
                        </Link>
                        <Link href="/#features" className="text-slate-600 hover:text-cyan-600 transition-colors">
                            Core Features
                        </Link>
                        <Link href="/#products" className="text-slate-600 hover:text-cyan-600 transition-colors">
                            Products
                        </Link>
                        <Link href="/#pricing" className="text-slate-600 hover:text-cyan-600 transition-colors">
                            Pricing
                        </Link>
                        <Link href="/#faq" className="text-slate-600 hover:text-cyan-600 transition-colors">
                            FAQ
                        </Link>

                        {session ? (
                            <>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="px-4 py-2 text-slate-600 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                                <Link href="/dashboard" className="px-4 py-2 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 text-cyan-600 font-medium hover:bg-cyan-50 rounded-lg transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="px-4 py-2 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-600 hover:text-cyan-600 p-2"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="block py-2 text-cyan-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#why-unicornx"
                            onClick={closeMenu}
                            className="block py-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                            Why Unicorn
                        </Link>
                        <Link
                            href="/#features"
                            onClick={closeMenu}
                            className="block py-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                            Core Features
                        </Link>
                        <Link
                            href="/#products"
                            onClick={closeMenu}
                            className="block py-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/#pricing"
                            onClick={closeMenu}
                            className="block py-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#faq"
                            onClick={closeMenu}
                            className="block py-2 text-slate-600 hover:text-cyan-600 transition-colors"
                        >
                            FAQ
                        </Link>
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="block w-full text-center py-2.5 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            signOut({ callbackUrl: '/' });
                                        }}
                                        className="block w-full text-center py-2.5 text-slate-600 font-medium border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block w-full text-center py-2.5 text-cyan-600 font-medium border border-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={closeMenu}
                                        className="block w-full text-center py-2.5 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
