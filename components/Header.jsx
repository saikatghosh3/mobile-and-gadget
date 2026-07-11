// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ShoppingCart, Menu, X, ChevronDown, Heart } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useCart } from '@/components/CartContext';
// import { useWishlist } from '@/components/WishlistContext';

// const navigation = [
//   { name: 'Home', href: '/' },
//   { name: 'Shop', href: '/shop' },
// ];

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
  
//   const pathname = usePathname();
//   const { getCartCount } = useCart();
//   const { wishlistCount } = useWishlist();
  
//   const cartCount = getCartCount();

//   useEffect(() => {
//     setMounted(true);
//     async function fetchCategories() {
//       try {
//         const res = await fetch('/api/categories?tree=true');
//         const json = await res.json();
//         if (json.success) {
//           setCategories(json.data || []);
//         }
//       } catch (err) {
//         console.error('Error fetching navbar categories:', err);
//       }
//     }
//     fetchCategories();
//   }, []);

//   return (
//     <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">TG</span>
//             </div>
//             <span className="font-bold text-xl text-neutral-900">TechGadget</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-8">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   'text-sm font-medium transition-colors',
//                   pathname === item.href
//                     ? 'text-orange-500'
//                     : 'text-neutral-600 hover:text-neutral-900'
//                 )}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {/* Dynamic Categories Dropdown */}
//             <div className="relative group">
//               <button className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 py-2 focus:outline-none">
//                 <span>Categories</span>
//                 <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
//               </button>
//               <div className="absolute left-0 mt-0 w-60 rounded-xl bg-white border border-neutral-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2 max-h-[85vh] overflow-y-auto">
//                 {categories.length === 0 ? (
//                   <span className="block px-4 py-2 text-sm text-neutral-500">Loading...</span>
//                 ) : (
//                   categories.map((category) => {
//                     const hasSubs = category.subcategories && category.subcategories.length > 0;
//                     return (
//                       <div key={category._id} className="relative group/sub">
//                         <div className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer font-medium">
//                           <Link
//                             href={`/shop?category=${category.slug}`}
//                             className="flex-1 flex items-center gap-2"
//                           >
//                             {category.icon && <span className="text-base">{category.icon}</span>}
//                             <span>{category.name}</span>
//                           </Link>
//                           {hasSubs && (
//                             <ChevronDown className="w-3.5 h-3.5 text-neutral-400 -rotate-90 transition-transform" />
//                           )}
//                         </div>
                        
//                         {/* Subcategories flyout */}
//                         {hasSubs && (
//                           <div className="absolute left-full top-0 ml-0.5 w-52 rounded-xl bg-white border border-neutral-200 shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-150 py-2 z-50">
//                             {category.subcategories.map((sub) => (
//                               <Link
//                                 key={sub._id}
//                                 href={`/shop?category=${category.slug}&sub=${sub.slug}`}
//                                 className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-orange-500 transition-colors"
//                               >
//                                 <span className="flex items-center gap-2">
//                                   {sub.icon && <span className="text-sm">{sub.icon}</span>}
//                                   <span>{sub.name}</span>
//                                 </span>
//                               </Link>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-4">
//             {/* Wishlist Link */}
//             <Link
//               href="/wishlist"
//               className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
//               title="Wishlist"
//             >
//               <Heart className="w-5 h-5 text-neutral-600 hover:text-red-500 transition-colors" />
//               {mounted && wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>

//             {/* Cart Link */}
//             <Link
//               href="/cart"
//               className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
//               title="Cart"
//             >
//               <ShoppingCart className="w-5 h-5 text-neutral-600" />
//               {mounted && cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             <button
//               className="md:hidden p-2 rounded-lg hover:bg-neutral-100 focus:outline-none"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? (
//                 <X className="w-5 h-5 text-neutral-600" />
//               ) : (
//                 <Menu className="w-5 h-5 text-neutral-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-neutral-200 py-4">
//             <div className="flex flex-col gap-2">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={cn(
//                     'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
//                     pathname === item.href
//                       ? 'bg-orange-50 text-orange-600'
//                       : 'text-neutral-600 hover:bg-neutral-100'
//                   )}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//               {/* Mobile Categories Accordion */}
//               <div className="px-4 py-2">
//                 <button
//                   onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
//                   className="flex items-center justify-between w-full text-sm font-medium text-neutral-600 hover:text-neutral-900 focus:outline-none"
//                 >
//                   <span>Categories</span>
//                   <ChevronDown
//                     className={cn(
//                       'w-4 h-4 transition-transform duration-200',
//                       mobileCategoriesOpen && 'rotate-180'
//                     )}
//                   />
//                 </button>
//                 {mobileCategoriesOpen && (
//                   <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-neutral-200">
//                     {categories.length === 0 ? (
//                       <span className="py-1 text-xs text-neutral-400">Loading...</span>
//                     ) : (
//                       categories.map((category) => {
//                         const hasSubs = category.subcategories && category.subcategories.length > 0;
//                         return (
//                           <div key={category._id} className="flex flex-col gap-1">
//                             <Link
//                               href={`/shop?category=${category.slug}`}
//                               onClick={() => setMobileMenuOpen(false)}
//                               className="py-1 text-sm font-semibold text-neutral-700 hover:text-orange-500 transition-colors flex items-center gap-1.5"
//                             >
//                               {category.icon && <span>{category.icon}</span>}
//                               <span>{category.name}</span>
//                             </Link>
//                             {hasSubs && (
//                               <div className="pl-4 flex flex-col gap-1 border-l border-neutral-100">
//                                 {category.subcategories.map((sub) => (
//                                   <Link
//                                     key={sub._id}
//                                     href={`/shop?category=${category.slug}&sub=${sub.slug}`}
//                                     onClick={() => setMobileMenuOpen(false)}
//                                     className="py-1 text-xs text-neutral-500 hover:text-orange-500 transition-colors flex items-center gap-1"
//                                   >
//                                     {sub.icon && <span className="text-[10px]">{sub.icon}</span>}
//                                     <span>{sub.name}</span>
//                                   </Link>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }

// new code start
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, ChevronDown, Heart, Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2, Tablet, Gift, Sparkles, TrendingUp, User, LogOut, Package, Settings, MapPin, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { useAuth } from '@/components/AuthContext';
import { useSettings } from '@/components/SettingsContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
];

// Icon mapping for categories
const getCategoryIcon = (iconName) => {
  const icons = {
    'smartphone': <Smartphone className="w-4 h-4" />,
    'laptop': <Laptop className="w-4 h-4" />,
    'headphone': <Headphones className="w-4 h-4" />,
    'watch': <Watch className="w-4 h-4" />,
    'camera': <Camera className="w-4 h-4" />,
    'gaming': <Gamepad2 className="w-4 h-4" />,
    'tablet': <Tablet className="w-4 h-4" />,
    'gift': <Gift className="w-4 h-4" />,
  };
  return icons[iconName] || <Smartphone className="w-4 h-4" />;
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubCategories, setOpenSubCategories] = useState({});
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const megaMenuRef = useRef(null);
  const megaButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  
  const cartCount = getCartCount();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    const handleClickOutside = (event) => {
      if (megaMenuOpen && 
          megaMenuRef.current && 
          !megaMenuRef.current.contains(event.target) &&
          megaButtonRef.current &&
          !megaButtonRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
        setHoveredCategory(null);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [megaMenuOpen]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories?tree=true');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching navbar categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const toggleSubCategory = (categoryId) => {
    setOpenSubCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setOpenSubCategories({});
  };

  const handleCategoryHover = (categoryId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50' 
        : 'bg-white border-b border-neutral-200'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            {settings?.websiteLogo ? (
              <img src={settings.websiteLogo} alt={settings.websiteName} className="h-9 w-auto rounded-xl transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-sm">
                  {(settings?.websiteName || 'TG').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-bold text-xl text-neutral-900">{settings?.websiteName || 'TechGadget'}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-all duration-200 relative px-2 py-1',
                  pathname === item.href
                    ? 'text-orange-500'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            ))}

            {/* Categories Mega Menu Button */}
            <div className="relative" ref={megaButtonRef}>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-all duration-200 px-2 py-1 rounded-lg',
                  megaMenuOpen 
                    ? 'text-orange-500 bg-orange-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                )}
              >
                <span>Categories</span>
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  megaMenuOpen && 'rotate-180'
                )} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-600 group-hover:text-orange-500 transition-colors" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {authLoading ? (
                <div className="w-9 h-9 rounded-xl bg-neutral-100 animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group"
                    title="Account"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-7 h-7 rounded-full object-cover border-2 border-orange-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 py-2 animate-fade-in">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-900 truncate">{user?.fullName}</p>
                          <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/account/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/account/addresses"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          My Addresses
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-neutral-100 mt-1 pt-2"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-100 mt-1 pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="relative p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200 group"
                  title="Sign In"
                >
                  <User className="w-5 h-5 text-neutral-600 group-hover:text-orange-500 transition-colors" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 focus:outline-none transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Mega Dropdown Menu */}
        {megaMenuOpen && (
          <div 
            ref={megaMenuRef}
            className="absolute left-0 right-0 mt-2 bg-white border-t border-neutral-100 shadow-2xl z-50 animate-fade-in"
            style={{ top: '100%' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    setMegaMenuOpen(false);
                    setHoveredCategory(null);
                  }}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Categories Grid */}
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-sm text-neutral-500">Loading categories...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {categories.map((category) => {
                    const hasSubs = category.subcategories && category.subcategories.length > 0;
                    const isHovered = hoveredCategory === category._id;
                    
                    return (
                      <div 
                        key={category._id} 
                        className="relative"
                        onMouseEnter={() => hasSubs && handleCategoryHover(category._id)}
                        onMouseLeave={handleCategoryLeave}
                      >
                        <div className="group">
                          <Link
                            href={`/shop?category=${category.slug}`}
                            onClick={() => {
                              setMegaMenuOpen(false);
                              setHoveredCategory(null);
                            }}
                            className="flex items-center gap-2 p-3 rounded-xl hover:bg-orange-50 transition-all duration-200"
                          >
                            <span className="text-orange-500">
                              {getCategoryIcon(category.icon)}
                            </span>
                            <span className="text-sm font-semibold text-neutral-800 group-hover:text-orange-500">
                              {category.name}
                            </span>
                            {hasSubs && (
                              <ChevronDown className="w-3 h-3 text-neutral-400 ml-auto transform -rotate-90" />
                            )}
                          </Link>
                          
                          {/* Subcategory Dropdown */}
                          {hasSubs && isHovered && (
                            <div 
                              className="absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 p-3 z-50 animate-slide-in"
                              onMouseEnter={() => handleCategoryHover(category._id)}
                              onMouseLeave={handleCategoryLeave}
                            >
                              <div className="space-y-1">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/shop?category=${category.slug}&sub=${sub.slug}`}
                                    onClick={() => {
                                      setMegaMenuOpen(false);
                                      setHoveredCategory(null);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200"
                                  >
                                    {sub.icon && getCategoryIcon(sub.icon)}
                                    <span>{sub.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
              
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu - Drawer from Right */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-in">
            {/* Mobile Menu Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TG</span>
                </div>
                <span className="font-bold text-lg text-neutral-900">Menu</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ height: 'calc(100vh - 70px)' }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Categories Accordion */}
              <div className="mt-2">
                <button
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-all duration-200"
                >
                  <span>All Categories</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      mobileCategoriesOpen && 'rotate-180'
                    )}
                  />
                </button>
                
                {mobileCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-2 border-l-2 border-orange-200 pl-4 animate-slide-down">
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-neutral-400">Loading categories...</div>
                    ) : (
                      categories.map((category) => {
                        const hasSubs = category.subcategories && category.subcategories.length > 0;
                        const isOpen = openSubCategories[category._id];
                        
                        return (
                          <div key={category._id} className="space-y-2">
                            <div className="flex items-center justify-between group">
                              <Link
                                href={`/shop?category=${category.slug}`}
                                onClick={closeMobileMenu}
                                className="flex-1 flex items-center gap-2 py-2 text-sm font-medium text-neutral-700 hover:text-orange-500 transition-colors"
                              >
                                {getCategoryIcon(category.icon)}
                                <span>{category.name}</span>
                                {hasSubs && (
                                  <span className="text-[10px] text-neutral-400">
                                    ({category.subcategories.length})
                                  </span>
                                )}
                              </Link>
                              {hasSubs && (
                                <button
                                  onClick={() => toggleSubCategory(category._id)}
                                  className="p-1.5 rounded-lg hover:bg-neutral-100 transition-all duration-200"
                                >
                                  <ChevronDown
                                    className={cn(
                                      'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200',
                                      isOpen && 'rotate-180'
                                    )}
                                  />
                                </button>
                              )}
                            </div>
                            
                            {/* Dynamic Subcategories */}
                            {hasSubs && isOpen && (
                              <div className="ml-6 space-y-1 border-l border-neutral-200 pl-3 animate-slide-down">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/shop?category=${category.slug}&sub=${sub.slug}`}
                                    onClick={closeMobileMenu}
                                    className="block py-2 pl-2 text-xs text-neutral-500 hover:text-orange-500 transition-colors hover:bg-orange-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      {sub.icon && getCategoryIcon(sub.icon)}
                                      <span>{sub.name}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Social Links */}
              {settings?.socialLinks?.filter((s) => s.enabled).length > 0 && (
                <div className="px-4 pt-4 border-t border-neutral-100 mt-4">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Follow Us</p>
                  <div className="flex items-center gap-3">
                    {settings.socialLinks.filter((s) => s.enabled).map((link, i) => {
                      const icons = {
                        facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                        instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                        whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
                        linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                        youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                        tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
                        'x-twitter': 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                      };
                      return (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-orange-100 flex items-center justify-center transition-colors text-neutral-500 hover:text-orange-600"
                          title={link.platform}
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d={icons[link.platform] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z'} />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// new code end 