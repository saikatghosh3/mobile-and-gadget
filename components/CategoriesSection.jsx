'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Watch,
  Camera,
  Gamepad,
  Wifi,
  Plug,
  Shield,
  Cpu,
  Box,
  Grid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Map main category slug to an icon
const getCategoryIcon = (slug = '') => {
  const s = slug.toLowerCase();
  if (s.includes('phone') || s.includes('mobile'))                  return Smartphone;
  if (s.includes('mac') || s.includes('laptop') || s.includes('pc')) return Laptop;
  if (s.includes('headphone') || s.includes('speaker') || s.includes('audio')) return Headphones;
  if (s.includes('tablet') || s.includes('ipad'))                   return Tablet;
  if (s.includes('watch') || s.includes('wearable'))                return Watch;
  if (s.includes('camera'))                                         return Camera;
  if (s.includes('gaming') || s.includes('console') || s.includes('game')) return Gamepad;
  if (s.includes('network') || s.includes('wifi') || s.includes('router'))  return Wifi;
  if (s.includes('accessori') || s.includes('plug') || s.includes('charger')) return Plug;
  if (s.includes('case') || s.includes('protect'))                  return Shield;
  if (s.includes('pc-access') || s.includes('keyboard') || s.includes('mouse')) return Cpu;
  if (s.includes('drone'))                                          return Box;
  return Grid;

};


// One pill button (main category)
function CategoryPill({ category, active, onClick }) {
  const Icon = getCategoryIcon(category.slug);
  return (
    <button
      onClick={() => onClick(category._id)}
      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap flex-shrink-0 border transition-all duration-200 hover:-translate-y-0.5 ${
        active
          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
          : 'bg-white border-neutral-200 text-neutral-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
      }`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
        active ? 'bg-white/20' : 'bg-neutral-100 group-hover:bg-orange-100'
      }`}>
        {/* icon or emoji */}
        {category.icon
          ? <span className="text-base leading-none">{category.icon}</span>
          : <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-neutral-500 group-hover:text-orange-500'}`} />
        }
      </div>
      <span>{category.name}</span>
      {(category.subcategories?.length || 0) > 0 && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          active ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'
        }`}>
          {category.subcategories.length}
        </span>
      )}
    </button>
  );
}

export default function CategoriesSection({ categories = [], loading = false }) {
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    return () => el.removeEventListener('scroll', updateArrows);
  }, [categories]);

  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 280, behavior: 'smooth' });
  };

  const activeCat = categories.find((c) => c._id === activeId);
  const hasSubs   = activeCat && (activeCat.subcategories?.length || 0) > 0;

  const handlePillClick = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <section className="py-10 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 py-4">
            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-10 bg-white border-y border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Browse by Category</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Select a category to explore premium mobiles and gadgets
          </p>
        </div>

        {/* Main categories scrollable pill bar */}
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-lg text-neutral-700 hover:text-orange-500 hover:border-orange-300 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-lg text-neutral-700 hover:text-orange-500 hover:border-orange-300 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <div ref={scrollRef} className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            {/* All link */}
            <Link
              href="/shop"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap flex-shrink-0 border bg-neutral-900 border-neutral-900 text-white shadow-sm hover:bg-neutral-700 transition-all"
            >
              <Grid className="w-3.5 h-3.5" />
              All
            </Link>

            {categories.map((cat) => (
              <CategoryPill
                key={cat._id}
                category={cat}
                active={activeId === cat._id}
                onClick={handlePillClick}
              />
            ))}

          </div>
        </div>
        {/* Subcategory strip — shown when a main cat with subs is active */}
        {hasSubs && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth animate-strip-fade-in pl-2">
            {/* Shop all in main */}
            <Link
              href={`/shop?category=${activeCat.slug}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-orange-300 bg-orange-50 text-orange-600 whitespace-nowrap flex-shrink-0 hover:bg-orange-100 transition-colors"
            >
              All {activeCat.name}
            </Link>
            {activeCat.subcategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/shop?category=${activeCat.slug}&sub=${sub.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 bg-white text-neutral-700 whitespace-nowrap flex-shrink-0 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm"
              >
                {sub.icon && <span>{sub.icon}</span>}
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* No subcategory — direct link strip */}
        {activeId && !hasSubs && (
          <div className="flex justify-center">
            <Link
              href={`/shop?category=${activeCat?.slug}`}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2"
            >
              View all {activeCat?.name} products →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}



