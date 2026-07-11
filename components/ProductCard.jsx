// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ShoppingCart, Star, Heart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useWishlist } from '@/components/WishlistContext';

// export default function ProductCard({ product, onAddToCart }) {
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const isWishlisted = mounted ? isInWishlist(product?._id) : false;

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(price);
//   };

//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0;

//   return (
//     <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
//       {/* Wishlist Floating Toggle Button */}
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           toggleWishlist(product);
//         }}
//         className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md transition-all text-neutral-600 hover:text-red-500 hover:scale-105 active:scale-95"
//       >
//         <Heart
//           className={`w-4 h-4 transition-all duration-200 ${
//             isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-neutral-500 hover:text-red-500'
//           }`}
//         />
//       </button>

//       <Link href={`/product/${product.slug}`}>
//         <div className="aspect-square bg-neutral-100 relative overflow-hidden">
//           {product.images && product.images[0] ? (
//             <img
//               src={product.images[0]}
//               alt={product.name}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-neutral-400">
//               No image
//             </div>
//           )}
//           {discount > 0 && (
//             <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//               -{discount}%
//             </span>
//           )}
//           {product.stock === 0 && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//               <span className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-medium">
//                 Out of Stock
//               </span>
//             </div>
//           )}
//         </div>
//       </Link>

//       <div className="p-4">
//         <Link href={`/product/${product.slug}`}>
//           <p className="text-xs text-orange-500 font-medium mb-1">
//             {product.category?.name}
//           </p>
//           <h3 className="font-semibold text-neutral-900 group-hover:text-orange-500 transition-colors line-clamp-2">
//             {product.name}
//           </h3>
//           <p className="text-sm text-neutral-500 mt-1">{product.brand}</p>
//         </Link>

//         <div className="flex items-center justify-between mt-3">
//           <div>
//             <span className="text-lg font-bold text-neutral-900">
//               {formatPrice(product.price)}
//             </span>
//             {product.originalPrice > 0 && (
//               <span className="text-sm text-neutral-400 line-through ml-2">
//                 {formatPrice(product.originalPrice)}
//               </span>
//             )}
//           </div>
//         </div>

//         <Button
//           onClick={() => onAddToCart && onAddToCart(product)}
//           disabled={product.stock === 0}
//           className="w-full mt-3 bg-neutral-900 hover:bg-orange-500 text-white disabled:opacity-50"
//         >
//           <ShoppingCart className="w-4 h-4 mr-2" />
//           Add to Cart
//         </Button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/components/WishlistContext';
import { useAuth } from '@/components/AuthContext';
import { formatTk } from '@/lib/utils';

export default function ProductCard({ product, onAddToCart }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(product?._id) : false;

  const formatPrice = (price) => formatTk(price);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">
      {/* Wishlist Floating Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isAuthenticated) {
            router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
          }
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md transition-all text-neutral-600 hover:text-red-500 hover:scale-105 active:scale-95"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-neutral-500 hover:text-red-500'
          }`}
        />
      </button>

      <Link href={`/product/${product.slug}`} className="flex-shrink-0">
        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No image
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content section with flex column to push button down consistently */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="flex-grow">
          <p className="text-xs text-orange-500 font-medium mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-semibold text-neutral-900 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">{product.brand}</p>
        </Link>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div>
                <span className="text-lg font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
                {product.originalPrice > 0 && (
                <span className="text-sm text-neutral-400 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={() => {
              if (!isAuthenticated) {
                router.push('/register?redirect=' + encodeURIComponent(window.location.pathname));
                return;
              }
              onAddToCart && onAddToCart(product);
            }}
            disabled={product.stock === 0}
            className="w-full mt-3 bg-neutral-900 hover:bg-orange-500 text-white disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}