
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

interface BotContent {
    id: string;
    slug: string;
    name: string;
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    ctaText: string;
    ctaLink: string;
    whatIs: any;
    howItWorks: any;
    features: any;
    whoIsFor: any;
    comparison: any;
    realLifeExamples: any;
    seoTitle: string;
    seoDescription: string;
    updatedAt: string;
}

export default function BotContentEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params using React.use()
    const { slug } = use(params);
    const router = useRouter();

    const [content, setContent] = useState<BotContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Helper to handle nested JSON string editing
    // We will edit JSON fields as formatted text for flexibility
    const [jsonFields, setJsonFields] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`/api/admin/content/bots/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(data);

                    // Initialize JSON text fields
                    setJsonFields({
                        whatIs: JSON.stringify(data.whatIs, null, 2),
                        howItWorks: JSON.stringify(data.howItWorks, null, 2),
                        features: JSON.stringify(data.features, null, 2),
                        whoIsFor: JSON.stringify(data.whoIsFor, null, 2),
                        comparison: JSON.stringify(data.comparison, null, 2),
                        realLifeExamples: JSON.stringify(data.realLifeExamples, null, 2)
                    });
                } else {
                    Swal.fire('Error', 'Content not found', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to fetch content', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [slug]);

    const handleSave = async () => {
        if (!content) return;
        setIsSaving(true);

        try {
            // Validate JSON fields
            const updatedData = { ...content };
            for (const key of Object.keys(jsonFields)) {
                try {
                    // @ts-ignore
                    updatedData[key] = JSON.parse(jsonFields[key]);
                } catch (e) {
                    throw new Error(`Invalid JSON in ${key}`);
                }
            }

            const res = await fetch(`/api/admin/content/bots/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Saved!',
                    text: 'Content updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.refresh();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save content', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-slate-500">Loading editor...</div>;
    }

    if (!content) {
        return <div className="p-12 text-center text-slate-500">Content not found.</div>;
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/x-control/content/bots" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{content.name}</h1>
                        <p className="text-slate-500 text-sm">Editing /{content.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${content.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium border border-slate-200"
                    >
                        <Eye size={18} />
                        View Page
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30 font-bold"
                    >
                        {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* SEO Section */}
            <Section title="SEO Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="SEO Title" value={content.seoTitle} onChange={v => setContent({ ...content, seoTitle: v })} />
                    <Field label="SEO Description" value={content.seoDescription} onChange={v => setContent({ ...content, seoDescription: v })} textarea />
                </div>
            </Section>

            {/* Hero Section */}
            <Section title="Hero Section">
                <div className="grid grid-cols-1 gap-6">
                    <Field label="Hero Title" value={content.heroTitle} onChange={v => setContent({ ...content, heroTitle: v })} />
                    <Field label="Hero Description" value={content.heroDescription} onChange={v => setContent({ ...content, heroDescription: v })} textarea />
                    <div className="opacity-50 pointer-events-none filter grayscale">
                        <Field label="Hero Image (Cannot edit yet)" value={content.heroImage} onChange={() => { }} />
                    </div>
                </div>
            </Section>

            {/* CTA Button Section */}
            <Section title="CTA Button">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Button Text" value={content.ctaText} onChange={v => setContent({ ...content, ctaText: v })} placeholder="e.g. Start Free Trial" />
                    <Field label="Button Link (URL)" value={content.ctaLink} onChange={v => setContent({ ...content, ctaLink: v })} placeholder="e.g. /register" />
                </div>
                <div className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <p className="text-sm text-cyan-700 font-medium mb-2">Preview:</p>
                    <a href={content.ctaLink || '#'} target="_blank" className="inline-block px-8 py-3 bg-[#00C2CC] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg">
                        {content.ctaText || 'Start Free Trial'}
                    </a>
                </div>
            </Section>

            {/* JSON Content Sections */}
            <Section title="Page Content (JSON)">
                <div className="space-y-6">
                    <JsonField
                        label="What Is (Title & Description)"
                        value={jsonFields.whatIs}
                        onChange={v => setJsonFields({ ...jsonFields, whatIs: v })}
                        height="h-48"
                    />
                    <JsonField
                        label="How It Works (Steps Array)"
                        value={jsonFields.howItWorks}
                        onChange={v => setJsonFields({ ...jsonFields, howItWorks: v })}
                        height="h-64"
                    />
                    <JsonField
                        label="Features (List)"
                        value={jsonFields.features}
                        onChange={v => setJsonFields({ ...jsonFields, features: v })}
                        height="h-64"
                    />
                    <JsonField
                        label="Who Is For (Target Audience)"
                        value={jsonFields.whoIsFor}
                        onChange={v => setJsonFields({ ...jsonFields, whoIsFor: v })}
                        height="h-48"
                    />
                    <JsonField
                        label="Comparison Table Data"
                        value={jsonFields.comparison}
                        onChange={v => setJsonFields({ ...jsonFields, comparison: v })}
                        height="h-64"
                    />
                    <JsonField
                        label="Real Life Examples"
                        value={jsonFields.realLifeExamples}
                        onChange={v => setJsonFields({ ...jsonFields, realLifeExamples: v })}
                        height="h-48"
                    />
                </div>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string, value: string, onChange: (val: string) => void, textarea?: boolean, placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            {textarea ? (
                <textarea
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 min-h-[100px]"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
            )}
        </div>
    );
}

function JsonField({ label, value, onChange, height }: { label: string, value: string, onChange: (val: string) => void, height?: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">{label}</label>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">JSON Format</span>
            </div>
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 font-mono text-sm leading-relaxed text-slate-600 bg-slate-50 ${height || 'h-32'}`}
                spellCheck={false}
            />
        </div>
    );
}
