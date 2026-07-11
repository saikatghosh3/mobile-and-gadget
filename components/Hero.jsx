// 'use client';

// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';

// export default function Hero({ ads = [] }) {
//   return (
//     <>
//       {ads.length > 0 ? (
//         <div className="relative h-[500px] bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
//           <div className="absolute inset-0">
//             <img
//               src={ads[0].image}
//               alt={ads[0].title}
//               className="w-full h-full object-cover opacity-50"
//             />
//           </div>
//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
//             <div className="max-w-2xl">
//               {ads[0].link ? (
//                 <Link href={ads[0].link}>
//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
//                     {ads[0].title}
//                   </h1>
//                   <p className="text-lg text-neutral-200 mb-6">
//                     {ads[0].description}
//                   </p>
//                   <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
//                     Shop Now <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </Link>
//               ) : (
//                 <div>
//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
//                     {ads[0].title}
//                   </h1>
//                   <p className="text-lg text-neutral-200 mb-6">
//                     {ads[0].description}
//                   </p>
//                   <Link
//                     href="/shop"
//                     className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
//                   >
//                     Shop Now <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="relative h-[500px] bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
//             <div className="max-w-2xl">
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
//                 Discover Premium Mobiles & Gadgets
//               </h1>
//               <p className="text-lg text-neutral-200 mb-6">
//                 Experience the latest technology at unbeatable prices. Quality products, fast delivery, and exceptional customer service.
//               </p>
//               <Link
//                 href="/shop"
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
//               >
//                 Shop Now <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function Hero({ ads = [] }) {
  const [showAd, setShowAd] = useState(true);

  const handleCloseAd = useCallback(() => {
    setShowAd(false);
  }, []);

  const heroAd = ads && ads.length > 0 ? ads[0] : null;

  return (
    <div className="relative h-[550px] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="flex gap-8 items-center w-full justify-between">
          
          {/* Left Side - Static Content */}
          <div className="flex-1 space-y-6">
  
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Discover Premium{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Mobiles & Gadgets
              </span>
            </h1>
            
            <p className="text-lg text-neutral-300 max-w-lg leading-relaxed">
              Experience the latest technology at unbeatable prices. Quality products, 
              fast delivery, and exceptional customer service.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                Shop Now 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 border border-white/20"
              >
                Learn More
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex gap-6 pt-4">
              {['Free Shipping', '24/7 Support', 'Secure Payment'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  <span className="text-xs text-neutral-400">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dynamic Advertisement */}
          {heroAd && showAd && heroAd.image && (
            <div className="w-80 relative shrink-0">
              <button
                onClick={handleCloseAd}
                className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full p-1.5 z-20 transition-all duration-300 shadow-lg hover:scale-110"
                aria-label="Close advertisement"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="relative group">
                <Link
                  href={heroAd.link || '/shop'}
                  className="block relative bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={heroAd.image}
                      alt="Advertisement"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-image.jpg';
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}