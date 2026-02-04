"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentVerificationHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const paymentSuccess = searchParams.get('payment_success');

    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (sessionId && paymentSuccess === 'true' && !verifying && !verified) {
            handleVerification(sessionId);
        }
    }, [sessionId, paymentSuccess]);

    const handleVerification = async (sid: string) => {
        setVerifying(true);
        try {
            const res = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid }),
            });

            if (res.ok) {
                setVerified(true);
                // Wait a moment to show success, then clean URL and refresh
                setTimeout(() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete('session_id');
                    params.delete('payment_success');
                    // Use window.location.href to force a hard navigation/reload to the clean URL
                    window.location.href = `/dashboard?${params.toString()}`;
                }, 2000);
            } else {
                console.error('Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        } finally {
            setVerifying(false); // Stop loading state, but 'verified' stays true if success
        }
    };

    if (!sessionId || paymentSuccess !== 'true') return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-sm text-center">
                {verified ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
                        <p className="text-slate-500">Your subscription has been renewed. Refreshing dashboard...</p>
                    </>
                ) : (
                    <>
                        <Loader2 size={40} className="text-cyan-500 animate-spin mb-2" />
                        <h3 className="text-xl font-bold text-slate-800">Verifying Payment</h3>
                        <p className="text-slate-500">Please wait while we confirm your renewal...</p>
                    </>
                )}
            </div>
        </div>
    );
}
