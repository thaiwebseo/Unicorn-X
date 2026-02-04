"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ProfileView() {
    const { data: session, update } = useSession();

    // Form State
    const [formData, setFormData] = useState({
        username: '', // This is just display name usually, but we'll map to Name
        email: '',
        firstname: '',
        lastname: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const hasInitialized = useRef(false);

    // Password Visibility State
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Status State
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    // Load initial data from session
    useEffect(() => {
        if (session?.user && !hasInitialized.current) {

            let initialFirstname = '';
            let initialLastname = '';
            let initialUsername = '';

            // Only use name if it's NOT the email address (default fallback)
            if (session.user.name && session.user.name !== session.user.email) {
                initialUsername = session.user.name;
                const parts = session.user.name.split(' ');
                initialFirstname = parts[0] || '';
                initialLastname = parts.slice(1).join(' ') || '';
            }

            setFormData(prev => ({
                ...prev,
                username: initialUsername,
                email: session.user.email || '',
                firstname: initialFirstname,
                lastname: initialLastname
            }));

            hasInitialized.current = true;
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (status.type === 'error') {
            setStatus({ type: 'idle', message: '' });
        }
    };

    const handleUpdateProfile = async () => {
        // Validation
        if (formData.newPassword || formData.confirmPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setStatus({ type: 'error', message: 'New passwords do not match.' });
                return;
            }
            if (!formData.oldPassword) {
                setStatus({ type: 'error', message: 'Please enter your old password to set a new one.' });
                return;
            }
        }

        setStatus({ type: 'loading', message: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to update profile');
            }

            setStatus({ type: 'success', message: 'Profile updated successfully!' });

            // Update session data to reflect changes immediately
            if (session) {
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name: `${formData.firstname} ${formData.lastname}`.trim()
                    }
                });
            }

            // Clear passwords after success
            setFormData(prev => ({
                ...prev,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Reset status after 3 seconds
            setTimeout(() => {
                setStatus({ type: 'idle', message: '' });
            }, 3000);

        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Profile Setting</h2>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                {/* Status Messages */}
                {status.message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${status.type === 'success'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        {status.message}
                    </div>
                )}

                {/* Personal Information Section */}
                <section className="space-y-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username - Read Only Display as Email or Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Username / Display Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.firstname ? `${formData.firstname} ${formData.lastname}` : formData.email}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Firstname */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Firstname</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                                placeholder="Enter firstname"
                            />
                        </div>

                        {/* Lastname */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Lastname</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                                placeholder="Enter lastname"
                            />
                        </div>
                    </div>
                </section>

                {/* Password Section */}
                <section className="space-y-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">Update Password</h3>

                    <div className="space-y-6 max-w-2xl">
                        {/* Old Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Old Password</label>
                            <div className="relative">
                                <input
                                    type={showOldPass ? "text" : "password"}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700 pr-12"
                                    placeholder="Enter old password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPass(!showOldPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showOldPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700 pr-12"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700 pr-12"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleUpdateProfile}
                            disabled={status.type === 'loading'}
                            className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {status.type === 'loading' ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
