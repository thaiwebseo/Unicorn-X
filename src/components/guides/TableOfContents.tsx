'use client';

import { useEffect, useState } from 'react';

interface TableOfContentsProps {
    htmlContent: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ htmlContent }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const headingElements = doc.querySelectorAll('h1, h2, h3');

        const extractedHeadings: Heading[] = [];
        headingElements.forEach((heading, index) => {
            const text = heading.textContent?.trim() || '';
            if (text) {
                const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').slice(0, 50)}`;
                extractedHeadings.push({
                    id,
                    text,
                    level: parseInt(heading.tagName.charAt(1))
                });
            }
        });

        setHeadings(extractedHeadings);

        // Add IDs to actual headings in the DOM after render
        const addIdsToHeadings = () => {
            const articleHeadings = document.querySelectorAll('.guide-content h1, .guide-content h2, .guide-content h3');
            articleHeadings.forEach((heading, index) => {
                const text = heading.textContent?.trim() || '';
                if (text) {
                    const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').slice(0, 50)}`;
                    heading.id = id;
                }
            });
        };

        // Small delay to ensure content is rendered
        setTimeout(addIdsToHeadings, 100);
    }, [htmlContent]);

    useEffect(() => {
        // Intersection observer for active section
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        // Observe all headings
        setTimeout(() => {
            const articleHeadings = document.querySelectorAll('.guide-content h1, .guide-content h2, .guide-content h3');
            articleHeadings.forEach((heading) => {
                if (heading.id) {
                    observer.observe(heading);
                }
            });
        }, 200);

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="hidden lg:block sticky top-24 w-64 shrink-0">
            <div className="border-l-2 border-slate-200 pl-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">On this page</h3>
                <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <button
                                onClick={() => handleClick(heading.id)}
                                className={`text-left w-full text-sm transition-colors duration-200 ${heading.level === 1 ? 'font-medium' :
                                        heading.level === 2 ? 'pl-2' : 'pl-4'
                                    } ${activeId === heading.id
                                        ? 'text-cyan-600 font-medium'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
