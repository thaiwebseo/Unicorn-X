import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Book, ArrowRight, Search } from 'lucide-react';

const CATEGORY_LABELS: { [key: string]: { label: string; description: string } } = {
    'getting-started': {
        label: 'Getting Started',
        description: 'Learn the basics of using Unicorn X'
    },
    'exchange-setup': {
        label: 'Exchange Setup',
        description: 'Connect your exchange account'
    },
    'bot-guide': {
        label: 'Bot Guides',
        description: 'Detailed guides for each bot'
    },
    'faq': {
        label: 'FAQ',
        description: 'Frequently asked questions'
    }
};

export default async function GuidesPage() {
    const guides = await prisma.guide.findMany({
        where: { isPublished: true },
        orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' }
        ]
    });

    // Group by category
    const groupedGuides: { [key: string]: typeof guides } = {};
    guides.forEach(guide => {
        if (!groupedGuides[guide.category]) {
            groupedGuides[guide.category] = [];
        }
        groupedGuides[guide.category].push(guide);
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                                <Book size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl text-slate-800">
                                    Unicorn<span className="text-cyan-500">X</span> Guides
                                </h1>
                                <p className="text-sm text-slate-500">Learn how to use our trading bots</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How can we help you?
                    </h2>
                    <p className="text-cyan-100 text-lg mb-8">
                        Find guides, tutorials, and answers to common questions
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {Object.keys(groupedGuides).length === 0 ? (
                    <div className="text-center py-16">
                        <Book size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-600 mb-2">No guides yet</h3>
                        <p className="text-slate-400">Check back soon for helpful tutorials and guides.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(groupedGuides).map(([category, categoryGuides]) => (
                            <section key={category}>
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {CATEGORY_LABELS[category]?.label || category}
                                    </h3>
                                    <p className="text-slate-500">
                                        {CATEGORY_LABELS[category]?.description || ''}
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryGuides.map(guide => (
                                        <Link
                                            key={guide.id}
                                            href={`/guides/${guide.slug}`}
                                            className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                                        >
                                            <h4 className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors mb-2">
                                                {guide.title}
                                            </h4>
                                            <div className="flex items-center text-cyan-600 text-sm font-medium">
                                                Read guide
                                                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} Unicorn X. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
