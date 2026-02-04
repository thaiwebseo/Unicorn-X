"use client";

import { useState } from "react";
import { Loader2, Lock, X } from "lucide-react";

interface PasswordVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
    title?: string;
    description?: string;
}

export default function PasswordVerificationModal({
    isOpen,
    onClose,
    onVerify,
    title = "Security Verification",
    description = "Please enter your password to continue."
}: PasswordVerificationModalProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/user/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onVerify();
                onClose();
                setPassword(""); // Clear password on success
            } else {
                setError(data.error || "Incorrect password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">
                        {description}
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700"
                            placeholder="Enter your password"
                            autoFocus
                            required
                        />
                        {error && (
                            <p className="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
