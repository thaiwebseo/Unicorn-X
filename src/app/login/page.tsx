"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [rememberMe, setRememberMe] = useState(false); // NextAuth handles sessions

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push(callbackUrl);
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 pt-24">
                {/* Main Card */}
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 md:p-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Image src="/images/logo.png" alt="UnicornX" width={150} height={40} className="h-10 w-auto" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Log in</h1>
                    <p className="text-center text-slate-600 mb-8">
                        Don't have an account?{' '}
                        <Link
                            href={`/register${callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                            className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                            Register
                        </Link>
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        {/* Remember Me (Visual only for now, NextAuth has its own session strategy) */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="w-5 h-5 border-2 border-slate-300 rounded accent-cyan-500"
                            />
                            <label htmlFor="rememberMe" className="ml-3 text-slate-700">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    {/* Forgot Password */}
                    <p className="text-center mt-6 text-slate-600">
                        Forgot your{' '}
                        <Link href="/forgot-password" className="text-cyan-600 hover:text-cyan-700 font-medium">
                            Password?
                        </Link>
                    </p>
                </div>

                {/* Copyright */}
                <p className="mt-8 text-sm text-slate-500">
                    ©2024 Copyright by CryptoBot™ - All rights reserved.
                </p>
            </main>
            <Footer />
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
