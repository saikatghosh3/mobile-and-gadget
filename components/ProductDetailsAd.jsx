'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductDetailsAd() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/advertisements?placement=product-details&active=true');
      const data = await res.json();
      setAds(data.data || []);
    } catch (error) {
      console.error('Error fetching product details ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed || ads.length === 0) return null;

  const ad = ads[0];
  if (!ad.image) return null;

  return (
    <div className="mt-12 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <Link
        href={ad.link || '/shop'}
        className="block"
      >
        <div className="relative aspect-[3/1] sm:aspect-[4/1] min-h-[100px] sm:min-h-[140px] overflow-hidden bg-neutral-100">
          <img
            src={ad.image}
            alt="Advertisement"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </Link>
    </div>
  );
}
