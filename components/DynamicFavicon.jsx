'use client';

import { useEffect } from 'react';
import { useSettings } from '@/components/SettingsContext';

export default function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    let link = document.querySelector('link[rel="icon"]');
    if (settings?.favicon) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    } else if (link) {
      link.remove();
    }
  }, [settings?.favicon]);

  return null;
}
