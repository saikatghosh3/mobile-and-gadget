'use client';

import { useCart } from '@/components/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import BannerAd from '@/components/BannerAd';
import SectionBanner from '@/components/SectionBanner';
import PopupAd from '@/components/PopupAd';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ProductsShelf from '@/components/ProductsShelf';
import CategoryProductsSection from '@/components/CategoryProductsSection';
import ProductSectionAd from '@/components/ProductSectionAd';
import FeaturesSection from '@/components/FeaturesSection';
import ScrollToTop from '@/components/ScrollToTop';

export default function HomeContent({ categories, featuredProducts, topSellingProducts, newArrivalProducts, banners, ads }) {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1">
        <Hero ads={ads} />

        <div className="py-6">
          <BannerAd />
        </div>

        <CategoriesSection categories={categories} loading={false} />

        {banners.find((b) => b.position === 'above-featured') && (
          <div className="py-6">
            <SectionBanner banner={banners.find((b) => b.position === 'above-featured')} />
          </div>
        )}

        <FeaturedProducts
          featuredProducts={featuredProducts}
          loading={false}
          onAddToCart={addToCart}
        />

        {banners.find((b) => b.position === 'above-top-selling') && (
          <div className="pb-6">
            <SectionBanner banner={banners.find((b) => b.position === 'above-top-selling')} />
          </div>
        )}

        <ProductsShelf
          title="Top Selling Products"
          subtitle="Our most-loved customer favorites and highly-rated gadgets"
          products={topSellingProducts}
          loading={false}
          onAddToCart={addToCart}
          viewAllLink="/shop"
        />

        <ProductSectionAd position={0} />

        {banners.find((b) => b.position === 'above-new-arrivals') && (
          <div className="pb-6">
            <SectionBanner banner={banners.find((b) => b.position === 'above-new-arrivals')} />
          </div>
        )}

        <ProductsShelf
          title="New Arrivals"
          subtitle="Explore the latest additions of premium gadgets in stock"
          products={newArrivalProducts}
          loading={false}
          onAddToCart={addToCart}
          viewAllLink="/shop?sort=newest"
        />

        <ProductSectionAd position={1} />

        {categories
          .filter((cat) => cat.showOnHome !== false)
          .map((category) => (
            <CategoryProductsSection
              key={category._id}
              category={category}
              onAddToCart={addToCart}
            />
          ))}

        <FeaturesSection />
      </main>

      <Footer />
      <ScrollToTop />
      <PopupAd />
    </div>
  );
}
