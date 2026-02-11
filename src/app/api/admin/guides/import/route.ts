import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { url } = await req.json();

        if (!url) {
            return new NextResponse('URL is required', { status: 400 });
        }

        // Extract Google Doc ID
        const docIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!docIdMatch) {
            return new NextResponse('Invalid Google Docs URL', { status: 400 });
        }

        const docId = docIdMatch[1];
        const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;

        const response = await fetch(exportUrl);

        if (!response.ok) {
            return new NextResponse('Failed to fetch document. Make sure it is shared with "Anyone with the link".', { status: response.status });
        }

        let html = await response.text();

        // Basic cleaning
        // Extract content between <body> tags
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (bodyMatch) {
            html = bodyMatch[1];
        }

        // 1. Remove <style> tags
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // 2. Remove all class and id attributes which often contain Google-specific noise
        html = html.replace(/\s+(class|id|dir|role|aria-[a-z]+)="[^"]*"/gi, '');

        // 3. Convert paragraphs with large font-sizes to proper headings
        // Google Docs uses inline styles like style="font-size: 26pt" for headings
        html = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, content) => {
            // Extract font-size from inline styles
            const fontSizeMatch = attrs.match(/font-size:\s*(\d+(?:\.\d+)?)(pt|px)/i);
            const colorMatch = attrs.match(/color:\s*([^;]+)/i);

            if (fontSizeMatch) {
                let size = parseFloat(fontSizeMatch[1]);
                const unit = fontSizeMatch[2].toLowerCase();

                // Convert px to pt approximately (1pt ≈ 1.33px)
                if (unit === 'px') {
                    size = size / 1.33;
                }

                // Clean the content of unnecessary spans but keep text
                let cleanContent = content
                    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1')
                    .trim();

                // Build style attribute for color if present
                const styleAttr = colorMatch ? ` style="color:${colorMatch[1]}"` : '';

                // Map font sizes to heading levels
                if (size >= 26) {
                    return `<h1${styleAttr}>${cleanContent}</h1>`;
                } else if (size >= 20) {
                    return `<h2${styleAttr}>${cleanContent}</h2>`;
                } else if (size >= 16) {
                    return `<h3${styleAttr}>${cleanContent}</h3>`;
                } else if (size >= 14) {
                    return `<h4${styleAttr}>${cleanContent}</h4>`;
                }
            }

            // For regular paragraphs, clean up but keep important styles
            const preservedAttrs = attrs.replace(/\s+style="([^"]*)"/gi, (m: string, styleString: string) => {
                const styles = styleString.split(';').map((s: string) => s.trim());
                const preserved = styles.filter((s: string) =>
                    s.startsWith('font-weight') ||
                    s.startsWith('color') ||
                    s.startsWith('text-decoration')
                );
                return preserved.length > 0 ? ` style="${preserved.join(';')}"` : '';
            });

            // Clean nested spans in paragraphs
            let cleanContent = content.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

            return `<p${preservedAttrs}>${cleanContent}</p>`;
        });

        // 4. Google Docs lists sometimes use a complex structure. 
        // Ensuring standard list tags are clean.
        html = html.replace(/<li><p[^>]*>([\s\S]*?)<\/p><\/li>/gi, '<li>$1</li>');

        // 5. Clean remaining empty spans and normalize whitespace
        html = html.replace(/<span[^>]*><\/span>/gi, '');
        html = html.replace(/<p><\/p>/gi, '');

        // 6. Final trim and polish
        html = html.trim();

        return NextResponse.json({ content: html });
    } catch (error: any) {
        console.error('Error importing Google Doc:', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
