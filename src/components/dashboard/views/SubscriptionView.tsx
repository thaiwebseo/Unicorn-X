"use client";

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Pricing from '@/components/Pricing';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Plan {
    id: string;
    name: string;
    tier: string;
    priceMonthly: number;
    priceYearly: number;
    isActive: boolean;
}

interface Subscription {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    isTrial?: boolean;
    plan: Plan;
}

interface SubscriptionViewProps {
    onViewHistory?: () => void;
}

export default function SubscriptionView({ onViewHistory }: SubscriptionViewProps) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [subToCancel, setSubToCancel] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch('/api/user/subscriptions');
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(data);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isYearly = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return durationMonths > 1; // Assume yearly if duration > 1 month
    };

    const activeSubscriptions = subscriptions.filter(s => {
        const isExpired = new Date(s.endDate) < new Date();
        // Show if ACTIVE OR (CANCELLED but not expired yet)
        return s.status === 'ACTIVE' || (s.status === 'CANCELLED' && !isExpired);
    });

    const handleCancelClick = (subId: string) => {
        setSubToCancel(subId);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!subToCancel) return;
        setCancelling(true);
        try {
            const res = await fetch('/api/user/subscriptions/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: subToCancel })
            });

            if (res.ok) {
                // Refresh subscriptions to show updated status
                await fetchSubscriptions();
            } else {
                console.error('Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        } finally {
            setCancelling(false);
            setIsCancelModalOpen(false);
            setSubToCancel(null);
        }
    };

    return (
        <div className="space-y-10 pb-8">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Subscription & Billing</h2>
            </div>

            {/* Section 1: Your Plan */}
            <section className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="px-4 py-1.5 bg-cyan-500 text-white text-sm font-bold rounded-lg shadow-sm shadow-cyan-500/20">
                            Your Plan
                        </span>
                        <button
                            onClick={onViewHistory}
                            className="text-sm font-medium text-slate-500 underline hover:text-cyan-600"
                        >
                            Billing History
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                Loading subscriptions...
                            </div>
                        ) : activeSubscriptions.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                No active subscriptions. Choose a plan below to get started!
                            </div>
                        ) : (
                            activeSubscriptions.map((sub) => {
                                const durationDay = (new Date(sub.endDate).getTime() - new Date(sub.startDate).getTime()) / (1000 * 3600 * 24);
                                const isTrial = sub.isTrial === true || durationDay < 15; // Fallback for existing trials
                                const yearly = isYearly(sub.startDate, sub.endDate);
                                const actualPrice = yearly ? sub.plan?.priceYearly : sub.plan?.priceMonthly;
                                const displayPrice = isTrial ? 0 : actualPrice;
                                const isPlanActive = sub.plan?.isActive !== false; // Default to true if undefined

                                return (
                                    <div key={sub.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6 bg-white border-b border-slate-50 last:border-0 shadow-sm first:rounded-t-2xl last:rounded-b-2xl">
                                        <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 w-full">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 flex-shrink-0 shadow-inner">
                                                <CheckCircle2 size={24} className="md:w-8 md:h-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base md:text-xl font-bold text-slate-800 line-clamp-1 flex items-center gap-2">
                                                    {sub.plan?.name || 'Subscription'} {isTrial ? '(Trial)' : ''}
                                                    {isTrial && (
                                                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-600 text-[10px] md:text-xs rounded-full font-bold uppercase tracking-wide border border-cyan-200">
                                                            Free Trial
                                                        </span>
                                                    )}
                                                    {!isPlanActive && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] md:text-xs rounded-full font-bold uppercase tracking-wide border border-red-200">
                                                            Discontinued
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-xs md:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                                                    Expiry: <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md">{formatDate(sub.endDate)}</span>
                                                </p>
                                            </div>

                                            {/* Mobile Price Display (shown on mobile instead of separate section) */}
                                            <div className="text-right md:hidden">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-900">{yearly ? 'Yearly' : 'Monthly'}</p>
                                                <p className="text-lg font-black text-cyan-500 leading-none">${(displayPrice || 0).toFixed(0)}</p>
                                            </div>
                                        </div>

                                        {/* Desktop Price Display */}
                                        <div className="hidden md:block text-right">
                                            <p className="text-xs uppercase tracking-wider font-bold text-slate-900">{yearly ? 'Yearly' : 'Monthly'}</p>
                                            <p className="text-2xl font-black text-cyan-500 leading-tight">${(displayPrice || 0).toFixed(0)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-slate-50 md:border-0">
                                            {sub.status === 'CANCELLED' ? (
                                                <span className="text-xs md:text-sm text-slate-400 font-medium px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 italic">
                                                    Cancels on {formatDate(sub.endDate)}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleCancelClick(sub.id)}
                                                    className="flex-1 md:flex-none px-4 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all text-xs md:text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {isPlanActive ? (
                                                <button
                                                    onClick={() => {
                                                        const fullPlanName = sub.plan.name;
                                                        // Strip " (Trial)" if it was added to the display name logic elsewhere or if it's in the sub.plan.name
                                                        const cleanPlanName = fullPlanName.replace(/\s\(Trial\)$/, '');

                                                        const params = new URLSearchParams({
                                                            plan: cleanPlanName,
                                                            price: actualPrice.toString(),
                                                            type: yearly ? 'yearly' : 'monthly',
                                                            id: sub.plan.id, // Use actual Plan ID
                                                            isRenewal: 'true'
                                                        });
                                                        window.location.href = `/checkout?${params.toString()}`;
                                                    }}
                                                    className="flex-1 md:flex-none px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/25 text-xs md:text-sm"
                                                >
                                                    Renew
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed border border-slate-200 text-xs md:text-sm"
                                                    title="This plan is no longer available for renewal."
                                                >
                                                    Closed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Section 2: Choose New Package */}
            <section className="space-y-6">
                <Pricing />
            </section>

            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Subscription"
                message="Are you sure you want to cancel your subscription? You will still have access until the end of the current billing period, but it will not auto-renew."
            />
        </div>
    );
}
