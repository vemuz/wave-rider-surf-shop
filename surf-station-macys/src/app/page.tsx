import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import SaleSection from '@/components/SaleSection';
import CategoryGrid from '@/components/CategoryGrid';
import PromoBanners from '@/components/PromoBanners';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <PromoBanners />
        <FeaturedProducts />
        <CategoryGrid />
        <SaleSection />
      </main>
      <Footer />
    </div>
  );
}
