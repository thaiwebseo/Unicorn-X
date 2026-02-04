"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const performanceCards = [
    { image: '/images/bot-performance-1.png', alt: 'Smart Time-Based DCA Bot Performance' },
    { image: '/images/bot-performance-2.png', alt: 'Intelligent DCA Max Bot Performance' },
    { image: '/images/bot-performance-3.png', alt: 'MVRV Smart DCA Bot Performance' },
    { image: '/images/bot-performance-4.png', alt: 'Bollinger Band DCA Bot Performance' },
];

// Create infinite loop by duplicating cards
const extendedCards = [...performanceCards, ...performanceCards, ...performanceCards];

const BotPerformance = () => {
    const [currentIndex, setCurrentIndex] = useState(performanceCards.length);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const autoSlideInterval = 4000;
    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, []);

    const prevSlide = useCallback(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    }, []);

    const goToSlide = (index: number) => {
        setIsTransitioning(true);
        setCurrentIndex(performanceCards.length + index);
    };

    // Handle infinite loop reset
    useEffect(() => {
        if (currentIndex >= performanceCards.length * 2) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(performanceCards.length);
            }, 500);
        } else if (currentIndex < performanceCards.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(performanceCards.length * 2 - 1);
            }, 500);
        }
    }, [currentIndex]);

    // Auto-slide effect
    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, autoSlideInterval);

        return () => clearInterval(intervalId);
    }, [nextSlide]);

    // Calculate actual index for dots
    const actualIndex = ((currentIndex - performanceCards.length) % performanceCards.length + performanceCards.length) % performanceCards.length;

    return (
        <section id="bot-performance" className="pt-8 pb-24 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-cyan-600 italic mb-4">Bot Performance</h2>
                    <h3 className="text-4xl font-extrabold text-slate-900 italic">
                        All our bots are ready for you to try on the market.
                    </h3>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:shadow-xl transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:shadow-xl transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden mx-8" ref={containerRef}>
                        <div
                            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                            style={{ transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)` }}
                        >
                            {extendedCards.map((card, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-2">
                                        <Image
                                            src={card.image}
                                            alt={card.alt}
                                            width={400}
                                            height={450}
                                            className="w-full h-auto rounded-xl"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 gap-2">
                    {performanceCards.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === actualIndex
                                ? 'bg-cyan-500 w-8'
                                : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BotPerformance;
