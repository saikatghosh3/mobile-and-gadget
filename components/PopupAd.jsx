'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function PopupAd() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/advertisements?placement=popup&active=true');
      const data = await res.json();
      const fetchedAds = data.data || [];
      setAds(fetchedAds);
      if (fetchedAds.length > 0) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error fetching popup ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (loading || !visible || dismissed || ads.length === 0) return null;

  const ad = ads[0];
  if (!ad.image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors shadow-sm"
          aria-label="Close advertisement"
        >
          <X className="w-5 h-5 text-neutral-700" />
        </button>

        <Link
          href={ad.link || '/shop'}
          onClick={handleClose}
          className="block relative aspect-[4/3] overflow-hidden"
        >
          <img
            src={ad.image}
            alt="Advertisement"
            className="w-full h-full object-cover"
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
