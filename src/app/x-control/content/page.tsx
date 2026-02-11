
"use client";

import Link from 'next/link';
import { Layers, List, FileText, ChevronRight } from 'lucide-react';

export default function ContentDashboard() {
    const sections = [
        {
            title: 'Pricing Categories',
            description: 'Manage pricing tabs and their descriptions (e.g., Smart Timer DCA, Bundles).',
            href: '/x-control/content/categories',
            icon: List,
            color: 'bg-blue-500'
        },
        {
            title: 'Bot Pages',
            description: 'Edit content for individual bot pages (Hero, Features, Steps, etc.).',
            href: '/x-control/content/bots',
            icon: FileText,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Layers className="text-cyan-600" />
                    Site Content Management
                </h1>
                <p className="text-slate-500 mt-2">Select a section to manage website content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        href={section.href}
                        className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-cyan-100 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl ${section.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <section.icon className={`w-6 h-6 ${section.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors">
                                <ChevronRight size={18} />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">
                            {section.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {section.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
