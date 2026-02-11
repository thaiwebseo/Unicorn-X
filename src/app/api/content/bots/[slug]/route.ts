
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Publically fetch content for a specific bot page
export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;
        const content = await prisma.botContent.findUnique({
            where: { slug }
        });

        if (!content) {
            return new NextResponse('Content not found', { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching bot content (public):', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// PUT: Admin update content
export async function PUT(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { slug } = await context.params;
        const data = await req.json();

        // Update the content
        // We assume the data passed matches the BotContent model fields where JSON is used
        // Since we are using a flexible schema for some parts? No, the schema works with specific JSON fields.
        // But our InlineEditProvider sends the WHOLE object back.
        // We need to make sure we update the specific JSON fields or the whole record properly.

        // Prisma update
        const updatedContent = await prisma.botContent.update({
            where: { slug },
            data: {
                heroTitle: data.heroTitle,
                heroDescription: data.heroDescription,
                heroImage: data.heroImage,
                whatIs: data.whatIs, // JSON
                howItWorks: data.howItWorks, // JSON
                features: data.features, // JSON
                featuresImage: data.featuresImage,
                whoIsFor: data.whoIsFor, // JSON
                whoIsForImage1: data.whoIsForImage1, // New field
                whoIsForImage2: data.whoIsForImage2, // New field for single image
                realLifeExamples: data.realLifeExamples, // JSON
                comparison: data.comparison, // JSON
                ctaText: data.ctaText,
                ctaLink: data.ctaLink,
                // Add new fields if checking schema, but dynamic is fine for JSON fields if they exist in schema
            }
        });

        return NextResponse.json(updatedContent);

    } catch (error) {
        console.error('Error updating bot content:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
