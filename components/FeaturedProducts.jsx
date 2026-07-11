'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ featuredProducts = [], loading = false, onAddToCart }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Featured Products
            </h2>
            <p className="text-neutral-600 mt-1 md:mt-2 text-sm md:text-base">
              Hand-picked products just for you
            </p>
          </div>
          <Link
            href="/shop"
            className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 flex-shrink-0"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No products available yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
