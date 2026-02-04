"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '';
    // Removed username as it's not in the User model yet.
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    // const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!agreeTerms) {
            setError("You must agree to the Terms of Service");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            if (res.ok) {
                // Redirect to login with a success indicator and preserve callbackUrl
                const loginParams = new URLSearchParams({ registered: 'true' });
                if (callbackUrl) loginParams.set('callbackUrl', callbackUrl);
                router.push(`/login?${loginParams.toString()}`);
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
                setLoading(false);
            }
        } catch (err) {
            setError("Something went wrong");
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
                    <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Create an Account</h1>
                    <p className="text-center text-slate-600 mb-8">
                        Already have an account?{' '}
                        <Link
                            href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                            className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                            Log in
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        {/* Agree Terms */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="w-5 h-5 border-2 border-slate-300 rounded accent-cyan-500"
                                required
                            />
                            <label htmlFor="agreeTerms" className="ml-3 text-slate-700">
                                I agree to website{' '}
                                <Link href="/terms" className="text-cyan-600 hover:text-cyan-700">
                                    Terms of Service
                                </Link>
                            </label>
                        </div>

                        {/* Subscribe Newsletter (removed logic but kept field if needed, or remove for simplicity since backend doesn't handle it yet)
                           For now, removed to simplify and match backend capabilities 
                        */}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create an account'}
                        </button>
                    </form>
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

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
