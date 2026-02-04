
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyUnicornX from '@/components/WhyUnicornX';
import CoreFeatures from '@/components/CoreFeatures';
import OurProducts from '@/components/OurProducts';
import HowItWork from '@/components/HowItWork';
import Pricing from '@/components/Pricing';
import BotPerformance from '@/components/BotPerformance';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <WhyUnicornX />
      <CoreFeatures />
      <OurProducts />
      <HowItWork />

      <Pricing />
      <BotPerformance />
      <FAQ />
      <Footer />
    </main>
  );
}
