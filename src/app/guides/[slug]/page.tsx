import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Book, Calendar } from 'lucide-react';
import GuideContent from '@/components/guides/GuideContent';

// Markdown to HTML simple converter
function markdownToHtml(markdown: string): string {
    // Process line by line for headers
    const lines = markdown.split('\n');
    let html = '';
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Handle code blocks
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                html += '</code></pre>';
                inCodeBlock = false;
            } else {
                html += '<pre class="bg-slate-100 p-4 rounded-xl overflow-x-auto my-4 text-sm"><code>';
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            html += line + '\n';
            continue;
        }

        // Headers (must be at start of line)
        if (line.startsWith('### ')) {
            html += `<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3">${line.slice(4)}</h3>`;
            continue;
        }
        if (line.startsWith('## ')) {
            html += `<h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">${line.slice(3)}</h2>`;
            continue;
        }
        if (line.startsWith('# ')) {
            html += `<h2 class="text-2xl font-bold text-cyan-600 mt-8 mb-4">${line.slice(2)}</h2>`;
            continue;
        }

        // Unordered lists
        if (line.startsWith('- ')) {
            html += `<li class="ml-4 list-disc mb-1">${line.slice(2)}</li>`;
            continue;
        }

        // Ordered lists
        const orderedMatch = line.match(/^(\d+)\. (.*)$/);
        if (orderedMatch) {
            html += `<li class="ml-4 list-decimal mb-1">${orderedMatch[2]}</li>`;
            continue;
        }

        // Empty lines = paragraph break
        if (line.trim() === '') {
            html += '<br/><br/>';
            continue;
        }

        // Regular text - apply inline formatting
        line = line
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full" />')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-cyan-600 hover:underline" target="_blank">$1</a>')
            // Inline code
            .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm">$1</code>');

        html += line + ' ';
    }

    return html;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let guide: any = null;
    /*
    try {
        guide = await prisma.guide.findUnique({
            where: { slug }
        });
    } catch (error) {
        console.error(`Failed to fetch guide ${slug}:`, error);
    }
    */

    /*
    if (!guide || !guide.isPublished) {
        notFound();
    }
    */
    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Coming Soon</h1>
                    <p className="text-slate-500 mt-2">This guide is under construction.</p>
                    <Link href="/guides" className="mt-4 inline-block text-cyan-600 hover:underline">Back to Guides</Link>
                </div>
            </div>
        );
    }

    // Check if content is HTML (from Rich Text Editor) or Markdown
    const isHtml = guide.content.includes('<') && guide.content.includes('>');
    const htmlContent = isHtml ? guide.content : markdownToHtml(guide.content);


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/guides"
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-500" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <Book size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-slate-800">Unicorn<span className="text-cyan-500">X</span> Guides</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Category Badge */}
                <div className="mb-4">
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
                        {guide.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                    {guide.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-4 text-slate-400 text-sm mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Last updated: {new Date(guide.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>

                {/* Content with Table of Contents */}
                <GuideContent htmlContent={htmlContent} />

                {/* Back to Guides */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to All Guides
                    </Link>
                </div>
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
