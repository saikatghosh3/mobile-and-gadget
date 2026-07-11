'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function BannerAd() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/advertisements?placement=banner&active=true');
      const data = await res.json();
      setAds(data.data || []);
    } catch (error) {
      console.error('Error fetching banner ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed || ads.length === 0) return null;

  const ad = ads[0];
  if (!ad.image) return null;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm group">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors shadow-sm"
          aria-label="Close advertisement"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        <Link
          href={ad.link || '/shop'}
          className="block relative w-full h-32 sm:h-40 lg:h-48 overflow-hidden"
        >
          <img
            src={ad.image}
            alt="Advertisement"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/fallback-image.jpg';
              e.currentTarget.onerror = null;
            }}
          />
        </Link>
      </div>
    </div>
  );
}
