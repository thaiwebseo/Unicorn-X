"use client";

import Image from 'next/image';
import Link from 'next/link';

const products = [
    {
        image: '/images/Timer DCA.png',
        title: 'Timer DCA',
        description: 'Scheduled auto-investment with smart signals.',
        link: '/timer-dca'
    },
    {
        image: '/images/Bollinger DCA.png',
        title: 'Bollinger DCA',
        description: 'Buy the dip with volatility-based entry logic.',
        link: '/bollinger-dca'
    },
    {
        image: '/images/MVRV Cycle DCA.png',
        title: 'MVRV Cycle DCA',
        description: 'On-chain cycle-based DCA for long-term growth.',
        link: '/mvrv-cycle-dca'
    },
    {
        image: '/images/Pro Multi-DCA.png',
        title: 'Pro Multi-DCA',
        description: 'Full-stack DCA engine with dynamic sizing & safety orders.',
        link: '/pro-multi-dca'
    }
];

const OurProducts = () => {
    return (
        <section id="products" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900">Our Products</h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((product, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group"
                        >
                            {/* Product Image */}
                            <Link href={product.link} className="block w-full bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-5">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    width={500}
                                    height={280}
                                    className="object-contain w-full h-auto group-hover:scale-105 transition-transform"
                                />
                            </Link>

                            {/* Product Info */}
                            <div className="p-6 pt-0">
                                <Link href={product.link}>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-[#00C2CC] transition-colors">{product.title}</h3>
                                </Link>
                                <p className="text-slate-600 text-sm">
                                    {product.description}{' '}
                                    <Link href={product.link} className="text-cyan-600 hover:underline font-medium">
                                        Explore more
                                    </Link>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default OurProducts;
