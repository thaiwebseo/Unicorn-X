
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

interface BotContentSummary {
    id: string;
    slug: string;
    name: string;
    updatedAt: string;
}

export default function BotContentListPage() {
    const [contents, setContents] = useState<BotContentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const res = await fetch('/api/admin/content/bots');
                if (res.ok) {
                    const data = await res.json();
                    setContents(data);
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to fetch bot content list', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContents();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Bot Pages Content</h1>
                <p className="text-slate-500">Select a bot page to edit its content.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Page Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center py-8 text-slate-400">Loading pages...</td></tr>
                        ) : contents.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8 text-slate-400">No pages found. (Did you seed data?)</td></tr>
                        ) : (
                            contents.map(content => (
                                <tr key={content.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {content.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        /{content.slug}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(content.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                                        <Link
                                            href={`/x-control/content/bots/${content.slug}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium"
                                        >
                                            <Edit2 size={14} />
                                            Edit Content
                                        </Link>
                                        <Link
                                            href={`/${content.slug}`}
                                            target="_blank"
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                            title="View Live Page"
                                        >
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
