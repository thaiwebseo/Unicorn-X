"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        redirect("/login");
    }

    // Role check - Double security alongside middleware
    if (session?.user?.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
                <p className="text-slate-600">You do not have permission to access this area.</p>
                <a href="/dashboard" className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                    Return to Dashboard
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
