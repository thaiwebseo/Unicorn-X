"use client";

import { useState, useEffect, useRef } from 'react';
import {
    Book, Plus, Edit2, Trash2, Eye, Link2, Copy, Check, Search
} from 'lucide-react';
import Link from 'next/link';

interface Guide {
    id: string;
    title: string;
    slug: string;
    category: string;
    botNames: string[];
    isPublished: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

const CATEGORY_LABELS: { [key: string]: string } = {
    'getting-started': 'Getting Started',
    'exchange-setup': 'Exchange Setup',
    'bot-guide': 'Bot Guide',
    'faq': 'FAQ'
};

import TinyMCEEditor from '@/components/admin/TinyMCEEditor';

export default function GuidesManagement() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [botCategories, setBotCategories] = useState<string[]>([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        category: 'getting-started',
        botNames: [] as string[],
        isPublished: false,
        sortOrder: 0
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGuides();
        fetchBots();
    }, []);

    const fetchGuides = async () => {
        try {
            const res = await fetch('/api/admin/guides');
            if (res.ok) {
                const data = await res.json();
                setGuides(data);
            }
        } catch (error) {
            console.error('Error fetching guides:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBots = async () => {
        try {
            const res = await fetch('/api/admin/bots/list');
            if (res.ok) {
                const data = await res.json();
                setBotCategories(data);
            }
        } catch (error) {
            console.error('Error fetching bots:', error);
        }
    };

    const openCreateModal = () => {
        setEditingGuide(null);
        setFormData({
            title: '',
            slug: '',
            content: '',
            category: 'getting-started',
            botNames: [],
            isPublished: false,
            sortOrder: 0
        });
        setShowModal(true);
    };

    const openEditModal = (guide: Guide) => {
        setEditingGuide(guide);
        setFormData({
            title: guide.title,
            slug: guide.slug,
            content: '', // Will be fetched
            category: guide.category,
            botNames: guide.botNames,
            isPublished: guide.isPublished,
            sortOrder: guide.sortOrder
        });
        // Fetch full content
        fetch(`/api/admin/guides/${guide.id}`)
            .then(res => res.json())
            .then(data => {
                setFormData(prev => ({ ...prev, content: data.content }));
            });
        setShowModal(true);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: editingGuide ? prev.slug : generateSlug(title)
        }));
    };

    const toggleBotName = (botName: string) => {
        setFormData(prev => ({
            ...prev,
            botNames: prev.botNames.includes(botName)
                ? prev.botNames.filter(b => b !== botName)
                : [...prev.botNames, botName]
        }));
    };

    const handleGoogleDocsImport = async () => {
        const url = prompt('Enter Google Docs URL (Shared with "Anyone with the link"):');
        if (!url) return;

        setSaving(true);
        try {
            const res = await fetch('/api/admin/guides/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, content: data.content }));
                alert('Import successful!');
            } else {
                const error = await res.text();
                alert(error || 'Failed to import from Google Docs');
            }
        } catch (error) {
            alert('Error during import');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            alert('Please fill in title and slug');
            return;
        }

        setSaving(true);
        try {
            const url = editingGuide
                ? `/api/admin/guides/${editingGuide.id}`
                : '/api/admin/guides';
            const method = editingGuide ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchGuides();
            } else {
                const error = await res.text();
                alert(error || 'Failed to save guide');
            }
        } catch (error) {
            alert('Error saving guide');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this guide?')) return;

        try {
            const res = await fetch(`/api/admin/guides/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchGuides();
            } else {
                alert('Failed to delete guide');
            }
        } catch (error) {
            alert('Error deleting guide');
        }
    };

    const copyLink = (slug: string, id: string) => {
        const url = `${window.location.origin}/guides/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredGuides = guides.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Book size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Guide Management</h1>
                        <p className="text-slate-500">Create and manage customer guides</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    New Guide
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search guides..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                />
            </div>

            {/* Guides Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : filteredGuides.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        {search ? 'No guides found' : 'No guides yet. Create your first guide!'}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Bots</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredGuides.map(guide => (
                                <tr key={guide.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{guide.title}</div>
                                        <div className="text-xs text-slate-400">/guides/{guide.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                                            {CATEGORY_LABELS[guide.category] || guide.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {guide.botNames.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {guide.botNames.slice(0, 2).map(bot => (
                                                    <span key={bot} className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs">
                                                        {bot.split(' - ')[0]}
                                                    </span>
                                                ))}
                                                {guide.botNames.length > 2 && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                                                        +{guide.botNames.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">All bots</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${guide.isPublished
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {guide.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => copyLink(guide.slug, guide.id)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Copy Link"
                                            >
                                                {copiedId === guide.id ? (
                                                    <Check size={16} className="text-green-500" />
                                                ) : (
                                                    <Link2 size={16} className="text-slate-400" />
                                                )}
                                            </button>
                                            <Link
                                                href={`/guides/${guide.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Preview"
                                            >
                                                <Eye size={16} className="text-slate-400" />
                                            </Link>
                                            <button
                                                onClick={() => openEditModal(guide)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} className="text-slate-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(guide.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} className="text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingGuide ? 'Edit Guide' : 'Create New Guide'}
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                    placeholder="e.g., How to Create API Key on OKX"
                                />
                            </div>

                            {/* Slug */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-sm">/guides/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                        placeholder="how-to-create-api-key"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                                >
                                    <option value="getting-started">Getting Started</option>
                                    <option value="exchange-setup">Exchange Setup</option>
                                    <option value="bot-guide">Bot Guide</option>
                                    <option value="faq">FAQ</option>
                                </select>
                            </div>

                            {/* Content - Rich Text Editor */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700">Content</label>
                                    <button
                                        onClick={handleGoogleDocsImport}
                                        className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 py-1 px-2 hover:bg-cyan-50 rounded-lg transition-all"
                                    >
                                        <Link2 size={14} />
                                        Import from Google Docs
                                    </button>
                                </div>
                                <TinyMCEEditor
                                    value={formData.content}
                                    onChange={(html: string) => setFormData(prev => ({ ...prev, content: html }))}
                                />
                            </div>

                            {/* Bot Assignment */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Show in Bot Pages (leave empty for all bots)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {botCategories.map((category) => (
                                        <label
                                            key={category}
                                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.botNames.includes(category)
                                                ? 'border-cyan-500 bg-cyan-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.botNames.includes(category)}
                                                onChange={() => toggleBotName(category)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.botNames.includes(category)
                                                ? 'bg-cyan-500 border-cyan-500'
                                                : 'border-slate-300'
                                                }`}>
                                                {formData.botNames.includes(category) && (
                                                    <Check size={12} className="text-white" />
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Published */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublished ? 'bg-cyan-500' : 'bg-slate-200'
                                    }`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isPublished ? 'translate-x-6' : ''
                                        }`} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    {formData.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </label>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : (editingGuide ? 'Update Guide' : 'Create Guide')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
