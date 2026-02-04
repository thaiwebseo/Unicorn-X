
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-slate-50 pt-32 pb-16 lg:pt-40 lg:pb-24">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

                {/* Headline */}
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
                    <span className="text-cyan-500">Smarter DCA</span> Instant backtest
                    <br />
                    Built natively in <span className="font-black">TradingView</span>
                </h1>

                {/* Subheadline */}
                <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 mb-10">
                    UnicornX turns ordinary DCA into precision investing with signals, multi-timeframe intelligence, and risk control all in one chart.
                </p>

                {/* Hero Image */}
                <div className="relative mx-auto max-w-5xl">
                    <Image
                        src="/images/hero-dashboard.png"
                        alt="UnicornX Dashboard Interface"
                        width={1200}
                        height={800}
                        quality={100}
                        priority
                        className="w-full h-auto drop-shadow-2xl rounded-2xl"
                    />
                </div>

                {/* Bottom Features */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-800">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-cyan-500 mr-2" strokeWidth={3} />
                        Reliable Execution
                    </div>
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-cyan-500 mr-2" strokeWidth={3} />
                        Accurate, No-Repaint Signals
                    </div>
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-cyan-500 mr-2" strokeWidth={3} />
                        24/7 Automated Trading
                    </div>
                </div>

            </div>

            {/* Background decoration */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        </div>
    );
};

export default Hero;
