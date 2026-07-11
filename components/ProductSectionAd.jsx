'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductSectionAd({ position = 0 }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/advertisements?placement=product-section&active=true');
      const data = await res.json();
      setAds(data.data || []);
    } catch (error) {
      console.error('Error fetching section ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || ads.length === 0) return null;

  const adIndex = position % ads.length;
  const ad = ads[adIndex];
  if (!ad.image) return null;

  return (
    <section className="py-12 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={ad.link || '/shop'}
          className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="relative aspect-[4/1] overflow-hidden bg-neutral-100">
            <img
              src={ad.image}
              alt="Advertisement"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
