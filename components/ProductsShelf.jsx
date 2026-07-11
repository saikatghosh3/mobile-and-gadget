'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductsShelf({
  title,
  subtitle,
  products = [],
  loading = false,
  onAddToCart,
  viewAllLink = '/shop',
}) {
  return (
    <section className="py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              {title}
            </h2>
            <p className="text-neutral-550 text-sm mt-1 md:mt-2">
              {subtitle}
            </p>
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-orange-500 hover:text-orange-600 font-semibold inline-flex items-center gap-1.5 transition-colors group text-sm flex-shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            No products available in this section.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => onAddToCart && onAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
