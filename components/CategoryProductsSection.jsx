'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CategoryProductsSection({ category, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // category here is a main-category object that may have .subcategories[]
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res  = await fetch(`/api/products?category=${category.slug}&limit=4`);
        const json = await res.json();
        if (json.success) setProducts(json.data || []);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category.slug]);

  if (loading) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 bg-neutral-100 rounded animate-pulse w-40" />
          <div className="h-5 bg-neutral-100 rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  const hasSubs = (category.subcategories?.length || 0) > 0;

  return (
    <section className="py-14 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {/* Category icon + name */}
            <div className="flex items-center gap-2 mb-1">
              {category.icon && (
                <span className="text-2xl leading-none">{category.icon}</span>
              )}
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {category.name}
              </h2>
            </div>
            <p className="text-neutral-500 text-sm">
              Discover top choices in {category.name.toLowerCase()}
            </p>

            {/* Subcategory quick-links */}
            {hasSubs && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {category.subcategories.slice(0, 5).map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/shop?category=${category.slug}&sub=${sub.slug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-600 hover:bg-orange-100 hover:text-orange-700 transition-colors border border-neutral-200 hover:border-orange-200"
                  >
                    {sub.icon && <span>{sub.icon}</span>}
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/shop?category=${category.slug}`}
            className="text-orange-500 hover:text-orange-600 font-semibold inline-flex items-center gap-1.5 transition-colors group text-sm flex-shrink-0 ml-4"
          >
            View More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => onAddToCart && onAddToCart(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
