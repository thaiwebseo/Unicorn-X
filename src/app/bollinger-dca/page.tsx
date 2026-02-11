"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';
import { InlineEditProvider } from '@/components/inline-edit/InlineEditProvider';
import { EditableText } from '@/components/inline-edit/EditableText';
import { EditableImage } from '@/components/inline-edit/EditableImage';
import { EditableLink } from '@/components/inline-edit/EditableLink';
import { AdminToolbar } from '@/components/inline-edit/AdminToolbar';

export default function BollingerDCAPage() {
    const [content, setContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content/bots/bollinger-dca');
            if (res.ok) {
                const data = await res.json();
                setContent(data);
            }
        } catch (error) {
            console.error('Error fetching bot content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    // Default empty structure if null, to prevent crashes during mapping
    const safeContent = content || {};
    // Ensure arrays exist
    const steps = safeContent.howItWorks || [];
    const features = safeContent.features || [];
    const whoIsFor = safeContent.whoIsFor || [];
    const comparisonData = safeContent.comparison || [];
    const realLifeExamples = safeContent.realLifeExamples || [];

    // Fallback for whatIs section if it doesn't exist in DB structure yet
    // The previous page.tsx had hardcoded whatIs text. 
    // If DB is empty, these might be empty strings, so the user will have to Edit and Fill them.
    // Or we could provide default values if empty, but for Inline Edit it's better to show placeholders.

    return (
        <InlineEditProvider
            initialData={safeContent}
            apiEndpoint="/api/content/bots/bollinger-dca"
            onSaveSuccess={(newData) => setContent(newData)}
        >
            <Navbar />
            <AdminToolbar />

            <main className="bg-white">
                {/* Unified Background for Hero and What is Section */}
                <div className="bg-[#F8F9FB]">
                    {/* Hero Section */}
                    <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">

                        {/* Breadcrumb */}
                        <div className="absolute top-24 left-4 sm:left-6 lg:left-8 text-sm text-cyan-500 font-medium z-20">
                            <Link href="/" className="hover:underline">Home</Link>
                            <span className="mx-2 text-slate-400">/</span>
                            <span className="text-slate-600">Bollinger DCA</span>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 pt-10">
                            <div className="lg:w-5/12 space-y-5 z-10 relative pl-4 lg:pl-12">
                                <span className="inline-block px-3 py-1 bg-cyan-100/50 text-slate-800 rounded-full text-xs font-bold tracking-wide">
                                    UnicornX Bot
                                </span>
                                <EditableText
                                    path="heroTitle"
                                    tagName="h1"
                                    className="text-5xl lg:text-6xl font-extrabold text-[#00C2CC] leading-tight tracking-tight"
                                    placeholder="Enter Hero Title"
                                />
                                <EditableText
                                    path="heroDescription"
                                    tagName="p"
                                    className="text-xl text-slate-800 font-normal max-w-lg leading-snug"
                                    placeholder="Enter Hero Description"
                                />
                                <div className="pt-4">
                                    <EditableLink
                                        textPath="ctaText"
                                        hrefPath="ctaLink"
                                        className="inline-block px-8 py-3 bg-[#00C2CC] text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 text-lg"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-7/12 relative flex justify-center lg:justify-end">
                                <EditableImage
                                    path="heroImage"
                                    fallbackSrc="/images/Bollinger DCA 1.png"
                                    alt="Bollinger DCA Hero"
                                    width={600}
                                    height={600}
                                    className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </section>


                    {/* What is Bollinger DCA? */}
                    <section className="py-20 px-4">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <EditableText
                                path="whatIs.title"
                                tagName="h2"
                                className="text-4xl font-extrabold text-[#0B0F19]"
                                placeholder="What is Title"
                            />
                            <div className="space-y-4">
                                <EditableText
                                    path="whatIs.description"
                                    tagName="div"
                                    className="text-slate-600 leading-loose text-lg whitespace-pre-line"
                                    placeholder="Description..."
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* How Does It Work? */}
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-[#0B0F19]">How Does It Work?</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {steps.map((step: any, idx: number) => (
                            <div
                                key={idx}
                                className={`bg-white border text-left border-slate-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300 ${idx === 0 ? 'lg:col-span-1 shadow-md' : 'shadow-sm'}`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00C2CC] to-cyan-600 text-white font-black text-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                                            {idx + 1}
                                        </div>
                                        <EditableText
                                            path={`howItWorks[${idx}].title`}
                                            tagName="h3"
                                            className="text-xl font-bold text-[#0B0F19]"
                                            placeholder="Step Title"
                                        />
                                    </div>
                                    <EditableText
                                        path={`howItWorks[${idx}].description`}
                                        tagName="p"
                                        className="text-slate-600 leading-relaxed"
                                        placeholder="Step Description"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key Features Section - Refactored to match design */}
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Left Column: Text Content */}
                            <div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] mb-12 tracking-tight leading-tight">
                                    Why Choose <br />
                                    Bollinger DCA?
                                </h2>

                                <div className="space-y-10">
                                    {features.map((feature: any, idx: number) => (
                                        <div key={idx} className="group">
                                            <EditableText
                                                path={`features[${idx}].title`}
                                                tagName="h3"
                                                className="text-xl font-bold text-[#0B0F19] mb-2"
                                                placeholder="Feature Title"
                                            />
                                            <EditableText
                                                path={`features[${idx}].description`}
                                                tagName="p"
                                                className="text-slate-600 leading-relaxed text-base"
                                                placeholder="Feature Description"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Image */}
                            <div className="relative">
                                {/* Decorative elements matching the clean style */}
                                <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-cyan-50/50 rounded-full blur-3xl pointer-events-none"></div>

                                <EditableImage
                                    path="featuresImage"
                                    fallbackSrc="/images/Bollinger DCA 2.png" // Fallback to chart image
                                    alt="Bollinger DCA Features"
                                    width={700}
                                    height={600}
                                    className="w-full h-auto object-contain relative z-10"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who is This Bot For? - Refactored to match design */}
                <section className="bg-slate-50 py-24 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] tracking-tight">
                                Who is This Bot For?
                            </h2>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                                {/* Left Column: Single Composite Image */}
                                <div className="lg:w-1/2 flex justify-center lg:justify-start">
                                    <EditableImage
                                        path="whoIsForImage"
                                        fallbackSrc="/images/Bollinger DCA 3.png" // Using the persona image as main fallback
                                        alt="Who is This Bot For"
                                        width={600}
                                        height={700}
                                        className="w-full h-auto object-contain max-h-[500px]"
                                        priority
                                    />
                                </div>

                                {/* Right Column: Content */}
                                <div className="lg:w-1/2 space-y-10">
                                    <div className="space-y-8">
                                        {whoIsFor.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-5 group">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-12 h-12 rounded-full bg-[#00C2CC]/10 flex items-center justify-center">
                                                        <div className="w-8 h-8 rounded-full bg-[#00C2CC] flex items-center justify-center shadow-sm">
                                                            <Check className="w-5 h-5 text-white stroke-[3]" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <EditableText
                                                        path={`whoIsFor[${idx}].title`}
                                                        tagName="h3"
                                                        className="font-bold text-[#0B0F19] text-xl mb-2"
                                                        placeholder="Title"
                                                    />
                                                    <EditableText
                                                        path={`whoIsFor[${idx}].description`}
                                                        tagName="p"
                                                        className="text-slate-600 text-base leading-relaxed"
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6">
                                        <EditableLink
                                            textPath="ctaText"
                                            hrefPath="ctaLink"
                                            className="inline-block w-full text-center px-12 py-5 bg-[#00C2CC] text-white font-bold rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 text-xl hover:scale-[1.02] active:scale-[0.98]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-Life Example */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-[#0B0F19]">Real-Life Example</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                            {realLifeExamples.map((example: any, idx: number) => (
                                <div key={idx} className="space-y-4">
                                    <EditableText
                                        path={`realLifeExamples[${idx}].title`}
                                        tagName="h3"
                                        className="text-xl font-bold text-[#0B0F19]"
                                    />
                                    <EditableText
                                        path={`realLifeExamples[${idx}].description`}
                                        tagName="p"
                                        className="text-slate-600 leading-loose text-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="py-20 px-4 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            Comparison
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            Traditional DCA & Bollinger DCA
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-12 bg-slate-50 py-6 px-6 border-b border-slate-200 font-bold text-slate-900">
                            <div className="col-span-6 md:col-span-6">Feature</div>
                            <div className="col-span-3 md:col-span-3 text-center text-slate-500">Traditional DCA</div>
                            <div className="col-span-3 md:col-span-3 text-center text-[#00C2CC]">Bollinger DCA</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {comparisonData.map((row: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-12 py-5 px-6 items-center hover:bg-slate-50 transition-colors">
                                    <div className="col-span-6 md:col-span-6 text-sm font-bold text-slate-900">
                                        <EditableText path={`comparison[${idx}].feature`} tagName="span" />
                                    </div>
                                    <div className="col-span-3 md:col-span-3 flex justify-center">
                                        {row.traditional ? (
                                            <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white stroke-[3]" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-3 md:col-span-3 flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-[#00C2CC] flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                        {row.timerLabel && (
                                            <EditableText
                                                path={`comparison[${idx}].timerLabel`}
                                                tagName="span"
                                                className="text-xs text-slate-500 font-medium hidden lg:inline-block"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </InlineEditProvider>
    );
}
