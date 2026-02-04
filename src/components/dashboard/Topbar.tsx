"use client";

import { useSession } from "next-auth/react";
import { Bell, User } from "lucide-react";

export default function Topbar() {
    const { data: session } = useSession();

    return (
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between">
            {/* Search or Title (Optional) */}
            <div className="text-slate-500 text-sm">
                {/* Breadcrumb or simple greeting could go here */}
                Welcome back, <span className="font-semibold text-slate-900">{session?.user?.email?.split('@')[0]}</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center pl-4 border-l border-slate-100">
                    <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <User className="h-5 w-5" />
                    </div>
                    {/* <span className="ml-3 text-sm font-medium text-slate-700">{session?.user?.email}</span> */}
                </div>
            </div>
        </header>
    );
}
