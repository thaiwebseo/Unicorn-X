"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function CheckoutContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get Plan Details from URL
    const planName = searchParams.get('plan') || 'Monthly Plan';
    const planPrice = parseFloat(searchParams.get('price') || '199.00');
    const planType = searchParams.get('type') || 'monthly';
    const planId = searchParams.get('id') || 'monthly';
    const isRenewal = searchParams.get('isRenewal') === 'true';
    const isTrial = searchParams.get('isTrial') === 'true';
    const referralCode = searchParams.get('ref') || ''; // Get ref code

    const [loading, setLoading] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isValidating, setIsValidating] = useState(false);
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

    // Billing Info State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Ref to ensure we only prefill once
    const hasPrefilled = useRef(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            const currentPath = window.location.pathname;
            const currentSearch = searchParams.toString();
            const fullUrl = currentSearch ? `${currentPath}?${currentSearch}` : currentPath;
            router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
        }

        // Pre-fill name from session if available
        if (status === 'authenticated' && session?.user?.name && !hasPrefilled.current) {
            if (session.user.name === session.user.email) {
                hasPrefilled.current = true;
                return;
            }

            const parts = session.user.name.split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
            hasPrefilled.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, router, session]);

    const handleApplyCoupon = async () => {
        if (!couponInput) return;
        setIsValidating(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput })
            });

            if (res.ok) {
                const couponData = await res.json();
                setAppliedCoupon(couponData);

                // Calculate discount
                let amount = 0;
                if (couponData.discountType === 'PERCENTAGE') {
                    amount = (planPrice * couponData.discountValue) / 100;
                } else {
                    amount = couponData.discountValue;
                }
                setDiscountAmount(amount);
                MySwal.fire({
                    icon: 'success',
                    title: 'Coupon Applied!',
                    text: `You saved ${couponData.discountType === 'PERCENTAGE' ? `${couponData.discountValue}%` : `$${couponData.discountValue}`}`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const error = await res.text();
                throw new Error(error);
            }
        } catch (error: any) {
            MySwal.fire('Error', error.message || 'Invalid coupon code', 'error');
            setAppliedCoupon(null);
            setDiscountAmount(0);
        } finally {
            setIsValidating(false);
        }
    };

    const finalTotalPrice = Math.max(0, planPrice - discountAmount);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleCheckout = async () => {
        if (!isPrivacyChecked) {
            MySwal.fire({
                icon: 'warning',
                title: 'Term & Privacy',
                text: 'Please agree to the Terms and Conditions before proceeding.',
                confirmButtonColor: '#06b6d4', // cyan-500
                confirmButtonText: 'OK'
            });
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    planName,
                    type: planType,
                    price: planPrice,
                    firstName,
                    lastName,
                    isRenewal,
                    isTrial,
                    ref: referralCode, // Forward to API
                    couponCode: appliedCoupon?.code
                }),
            });

            if (response.ok) {
                const { url } = await response.json();
                window.location.href = url;
            } else {
                const errorText = await response.text();
                // Special handling for quota error
                if (response.status === 400 && errorText.includes('quota')) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Trial Limit Reached',
                        text: 'You have already used your one-time free trial account quota. Please choose a subscription plan to continue.',
                        confirmButtonColor: '#06b6d4',
                        confirmButtonText: 'View Plans'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/#pricing'; // Redirect to pricing
                        }
                    });
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Checkout Failed',
                        text: errorText || 'Something went wrong. Please try again.',
                        confirmButtonColor: '#f43f5e', // rose-500
                    });
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'An unexpected error occurred. Please check your connection.',
                confirmButtonColor: '#f43f5e',
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Steps */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Subscribe</h1>
                    <div className="flex justify-center items-center gap-4 text-sm font-medium">
                        <div className="flex flex-col items-center gap-2 text-cyan-500">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center font-bold">1</div>
                            <span>Choose Plan</span>
                        </div>
                        <div className="w-16 h-0.5 bg-cyan-500"></div>
                        <div className="flex flex-col items-center gap-2 text-cyan-600">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">2</div>
                            <span>Subscribe Information</span>
                        </div>
                        <div className="w-16 h-0.5 bg-slate-200"></div>
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold">3</div>
                            <span>Checkout</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Information */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Contact information</h2>
                            <p className="text-sm text-slate-500 mb-4">We'll use this email to send you details and updates about your order.</p>
                            <input
                                type="email"
                                value={session?.user?.email || ''}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Billing address</h2>
                            <p className="text-sm text-slate-500 mb-4">Enter the billing address that matches your payment method.</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none bg-white">
                                    <option>Thailand</option>
                                    <option>United States</option>
                                </select>
                                <input type="text" placeholder="Street Address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none" />
                                <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Town / City" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none" />
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none bg-white">
                                        <option>State / County</option>
                                        <option>Bangkok</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Postcode / ZIP" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none" />
                                    <input type="text" placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Options (Display Only) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Payment options</h2>
                            <div className="border border-cyan-500 bg-cyan-50 rounded-xl p-4 flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-[6px] border-cyan-500 bg-white"></div>
                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                    Pay with Stripe <span className="text-xs font-normal text-slate-500">(Credit Card / PromptPay)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-sm text-slate-500">Your currently selected plan</p>
                                    <h3 className="text-lg font-bold text-cyan-600">{planName}</h3>

                                    {/* Bundle Warning */}
                                    {planName.toLowerCase().includes('bundle') && (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                                            <strong>⚠️ Note:</strong> If you have active single bot subscriptions, purchasing this Bundle will automatically replace them to prevent double charging.
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Plan Amount</span>
                                    <span className="font-bold">${planPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Coupon Discount Amount</span>
                                    <span className={`font-bold ${discountAmount > 0 ? 'text-emerald-500' : ''}`}>
                                        {discountAmount > 0 ? `- $${discountAmount.toFixed(2)}` : '0.00'}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-700 mb-2">Add a coupon</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            disabled={!!appliedCoupon || isValidating}
                                            placeholder="Enter coupon code"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-400"
                                        />
                                        {appliedCoupon ? (
                                            <button
                                                onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponInput(''); }}
                                                className="px-4 py-2 bg-slate-100 text-slate-500 text-sm font-bold rounded-lg hover:bg-slate-200 transition-all"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isValidating || !couponInput}
                                                className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition-all disabled:opacity-50"
                                            >
                                                {isValidating ? '...' : 'Apply'}
                                            </button>
                                        )}
                                    </div>
                                    {appliedCoupon && (
                                        <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            Coupon "{appliedCoupon.code}" applied successfully!
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="text-2xl font-extrabold text-cyan-500">${finalTotalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPrivacyChecked ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300'}`}>
                                        {isPrivacyChecked && <CheckCircle2 size={14} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isPrivacyChecked}
                                        onChange={(e) => setIsPrivacyChecked(e.target.checked)}
                                    />
                                    <span className="text-xs text-slate-500">
                                        By proceeding with your purchase you agree to our <a href="#" className="text-cyan-500 hover:underline">Terms and Conditions</a> and <a href="#" className="text-cyan-500 hover:underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={!isPrivacyChecked || loading}
                                className="w-full py-4 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : 'Confirm & Checkout'}
                            </button>

                            <Link
                                href="/#pricing"
                                className="mt-4 w-full py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} />
                                Back to choose plan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
            <div className="flex items-center gap-2 text-slate-400">
                <Loader2 size={24} className="animate-spin" />
                <span>Loading checkout...</span>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
        </Suspense>
    );
}
