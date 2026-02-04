"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Suspense } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MyBotsView from '@/components/dashboard/views/MyBotsView';
import SubscriptionView from '@/components/dashboard/views/SubscriptionView';
import BillingHistoryView from '@/components/dashboard/views/BillingHistoryView';
import SupportView from '@/components/dashboard/views/SupportView';
import ProfileView from '@/components/dashboard/views/ProfileView';
import PaymentVerificationHandler from '@/components/dashboard/PaymentVerificationHandler';

type TabId = 'my-bot' | 'subscription' | 'history' | 'support' | 'profile';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<TabId>('my-bot');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // Initial check for desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarExpanded(true);
            } else {
                setIsSidebarExpanded(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'my-bot': return <MyBotsView />;
            case 'subscription': return <SubscriptionView onViewHistory={() => setActiveTab('history')} />;
            case 'history': return <BillingHistoryView />;
            case 'support': return <SupportView />;
            case 'profile': return <ProfileView />;
            default: return <MyBotsView />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Fixed Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
            />

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-72 pl-20' : 'pl-20'}`}>
                <main className="flex-1 p-3 md:p-8 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <DashboardHeader
                        user={{
                            name: session?.user?.name,
                            email: session?.user?.email
                        }}
                        onConfigsClick={() => setActiveTab('profile')}
                    />

                    {/* Payment Verification for Renewals */}
                    <Suspense fallback={null}>
                        <PaymentVerificationHandler />
                    </Suspense>

                    {/* Dynamic View Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
