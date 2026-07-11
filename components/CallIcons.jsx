'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const PHONE_NUMBER = '+15551234567';
const WHATSAPP_NUMBER = '+15551234567';

export default function CallIcons() {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setExpanded(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-20 left-4 md:left-8 z-40 flex flex-col items-center gap-3">
          {expanded && (
            <>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 animate-fade-in hover:scale-110"
                title="Call us"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 animate-fade-in hover:scale-110"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 animate-fade-in"
            aria-label="Contact options"
            title="Contact us"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
