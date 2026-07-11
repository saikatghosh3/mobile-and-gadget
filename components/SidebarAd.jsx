'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function SidebarAd() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/advertisements?placement=sidebar&active=true');
      const data = await res.json();
      setAds(data.data || []);
    } catch (error) {
      console.error('Error fetching sidebar ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setActiveAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  if (loading || dismissed || ads.length === 0) return null;

  const ad = ads[activeAdIndex];
  if (!ad.image) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg group border border-neutral-200">
      {ads.length > 1 && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveAdIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeAdIndex ? 'bg-orange-500 w-4' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Switch to ad ${i + 1}`}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 left-3 z-10 bg-white/80 hover:bg-white rounded-full p-1 transition-colors shadow-sm"
        aria-label="Close advertisement"
      >
        <X className="w-3 h-3 text-neutral-700" />
      </button>

      <Link
        href={ad.link || '/shop'}
        className="block relative aspect-square overflow-hidden"
      >
        <img
          src={ad.image}
          alt="Advertisement"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </Link>
    </div>
  );
}
