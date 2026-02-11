'use client';

import TableOfContents from './TableOfContents';

interface GuideContentProps {
    htmlContent: string;
}

const guideStyles = `
    .guide-content h1 { font-size: 2rem !important; font-weight: bold !important; color: #0891b2 !important; margin-top: 2rem !important; margin-bottom: 1rem !important; scroll-margin-top: 100px; }
    .guide-content h2 { font-size: 1.5rem !important; font-weight: bold !important; color: #1e293b !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; scroll-margin-top: 100px; }
    .guide-content h3 { font-size: 1.25rem !important; font-weight: 600 !important; color: #334155 !important; margin-top: 1.25rem !important; margin-bottom: 0.5rem !important; scroll-margin-top: 100px; }
    .guide-content h4 { font-size: 1.1rem !important; font-weight: 600 !important; color: #475569 !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; }
    .guide-content p { margin-bottom: 1rem; line-height: 1.75 !important; color: #334155; }
    .guide-content ul { list-style-type: disc !important; list-style-position: outside !important; padding-left: 2rem !important; margin-left: 0 !important; margin-bottom: 1rem !important; margin-top: 0.5rem !important; }
    .guide-content ol { list-style-type: decimal !important; list-style-position: outside !important; padding-left: 2rem !important; margin-left: 0 !important; margin-bottom: 1rem !important; margin-top: 0.5rem !important; }
    .guide-content li { margin-bottom: 0.5rem !important; margin-top: 0 !important; line-height: 1.6 !important; color: #334155; padding-left: 0.5rem !important; display: list-item !important; }
    .guide-content li p { margin: 0 !important; padding: 0 !important; display: inline !important; }
    .guide-content li div { margin: 0 !important; padding: 0 !important; }
    .guide-content li span { line-height: 1.6 !important; }
    .guide-content a { color: #0891b2 !important; text-decoration: underline; }
    .guide-content a:hover { color: #0e7490 !important; }
    .guide-content strong { font-weight: 600 !important; }
    .guide-content em { font-style: italic !important; }
    .guide-content img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
    .guide-content pre { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
    .guide-content code { background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.9em; }
    .guide-content blockquote { border-left: 4px solid #0891b2; padding-left: 1rem; margin: 1rem 0; color: #64748b; font-style: italic; }
    .guide-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .guide-content th, .guide-content td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
    .guide-content th { background: #f8fafc; font-weight: 600; }
    .guide-content [style*="padding-inline-start"] { padding-inline-start: 0 !important; padding-left: 2rem !important; }
`;

export default function GuideContent({ htmlContent }: GuideContentProps) {
    return (
        <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <style dangerouslySetInnerHTML={{ __html: guideStyles }} />
                <article
                    className="guide-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>

            {/* Table of Contents Sidebar */}
            <TableOfContents htmlContent={htmlContent} />
        </div>
    );
}
