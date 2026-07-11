// 'use client';

// import { useEffect, useState, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Search, SlidersHorizontal, X } from 'lucide-react';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import ProductCard from '@/components/ProductCard';
// import { useCart } from '@/components/CartContext';
// import ScrollToTop from '@/components/ScrollToTop';

// function ShopPageContent() {
//   const searchParams = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [sortBy, setSortBy] = useState('newest');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { addToCart } = useCart();
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const category = searchParams.get('category');
//     const sub = searchParams.get('sub');
//     const search = searchParams.get('search');
//     if (sub) {
//       setSelectedCategory(sub);
//     } else if (category) {
//       setSelectedCategory(category);
//     } else {
//       setSelectedCategory('');
//     }
//     if (search) {
//       setSearchQuery(search);
//     } else {
//       setSearchQuery('');
//     }
//     fetchCategories();
//   }, [searchParams]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchProducts();
//     }, 200);

//     return () => clearTimeout(delayDebounceFn);
//   }, [selectedCategory, sortBy, currentPage, searchQuery]);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch('/api/categories?tree=true');
//       const data = await res.json();
//       setCategories(data.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (selectedCategory) params.append('category', selectedCategory);
//       if (priceRange.min) params.append('minPrice', priceRange.min);
//       if (priceRange.max) params.append('maxPrice', priceRange.max);
//       if (sortBy) params.append('sort', sortBy);
//       if (searchQuery) params.append('search', searchQuery);
//       params.append('page', currentPage.toString());
//       params.append('limit', '12');

//       const res = await fetch(`/api/products?${params.toString()}`);
//       const data = await res.json();

//       setProducts(data.data || []);
//       setTotalPages(data.pagination?.totalPages || 1);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setSelectedCategory('');
//     setPriceRange({ min: '', max: '' });
//     setSearchQuery('');
//     setCurrentPage(1);
//   };

//   const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || searchQuery;

//   return (
//     <div className="min-h-screen flex flex-col bg-neutral-50">
//       <Header />

//       <main className="flex-1">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-neutral-900">Shop</h1>
//             <p className="text-neutral-600 mt-1">
//               Browse our collection of premium mobiles and gadgets
//             </p>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Filters Sidebar - Desktop */}
//             <aside className="hidden lg:block w-64 flex-shrink-0">
//               <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="font-semibold text-lg">Filters</h2>
//                   {hasActiveFilters && (
//                     <button
//                       onClick={clearFilters}
//                       className="text-sm text-orange-500 hover:text-orange-600"
//                     >
//                       Clear all
//                     </button>
//                   )}
//                 </div>

//                 {/* Search */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-neutral-700 mb-2">
//                     Search
//                   </label>
//                   <form onSubmit={handleSearch} className="flex gap-2">
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search products..."
//                       className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
//                     />
//                     <button
//                       type="submit"
//                       className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                     >
//                       <Search className="w-4 h-4" />
//                     </button>
//                   </form>
//                 </div>

//                 {/* Categories */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-neutral-700 mb-2">
//                     Category
//                   </label>
//                   <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2 no-scrollbar">
//                     <button
//                       onClick={() => setSelectedCategory('')}
//                       className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
//                         !selectedCategory
//                           ? 'bg-orange-50 text-orange-600 font-semibold'
//                           : 'text-neutral-700 hover:bg-neutral-100'
//                       }`}
//                     >
//                       All Categories
//                     </button>
//                     {categories.map((category) => {
//                       const hasSubs = category.subcategories && category.subcategories.length > 0;
//                       const isMainSelected = selectedCategory === category.slug;
                      
//                       return (
//                         <div key={category._id} className="space-y-1">
//                           <button
//                             onClick={() => setSelectedCategory(category.slug)}
//                             className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
//                               isMainSelected
//                                 ? 'bg-orange-50 text-orange-600 font-semibold'
//                                 : 'text-neutral-800 hover:bg-neutral-50 hover:text-orange-500'
//                             }`}
//                           >
//                             {category.icon && <span>{category.icon}</span>}
//                             <span>{category.name}</span>
//                           </button>
                          
//                           {hasSubs && (
//                             <div className="pl-4 border-l border-neutral-200 ml-3 space-y-1">
//                               {category.subcategories.map((sub) => {
//                                 const isSubSelected = selectedCategory === sub.slug;
//                                 return (
//                                   <button
//                                     key={sub._id}
//                                     onClick={() => setSelectedCategory(sub.slug)}
//                                     className={`w-full text-left px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
//                                       isSubSelected
//                                         ? 'bg-neutral-100 text-orange-600 font-semibold'
//                                         : 'text-neutral-600 hover:bg-neutral-50 hover:text-orange-500'
//                                     }`}
//                                   >
//                                     {sub.icon && <span>{sub.icon}</span>}
//                                     <span>{sub.name}</span>
//                                   </button>
//                                 );
//                               })}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Price Range */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-neutral-700 mb-2">
//                     Price Range
//                   </label>
//                   <div className="flex gap-2 items-center">
//                     <input
//                       type="number"
//                       placeholder="Min"
//                       value={priceRange.min}
//                       onChange={(e) =>
//                         setPriceRange({ ...priceRange, min: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
//                     />
//                     <span className="text-neutral-400">-</span>
//                     <input
//                       type="number"
//                       placeholder="Max"
//                       value={priceRange.max}
//                       onChange={(e) =>
//                         setPriceRange({ ...priceRange, max: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
//                     />
//                   </div>
//                   <button
//                     onClick={() => {
//                       setCurrentPage(1);
//                       fetchProducts();
//                     }}
//                     className="w-full mt-2 px-3 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 text-sm"
//                   >
//                     Apply
//                   </button>
//                 </div>

//                 {/* Sort */}
//                 <div>
//                   <label className="block text-sm font-medium text-neutral-700 mb-2">
//                     Sort By
//                   </label>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
//                   >
//                     <option value="newest">Newest First</option>
//                     <option value="price-low">Price: Low to High</option>
//                     <option value="price-high">Price: High to Low</option>
//                     <option value="name">Name: A to Z</option>
//                   </select>
//                 </div>
//               </div>
//             </aside>

//             {/* Mobile Filters Button */}
//             <div className="lg:hidden mb-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg"
//               >
//                 <SlidersHorizontal className="w-4 h-4" />
//                 <span>Filters</span>
//                 {hasActiveFilters && (
//                   <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
//                     Active
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Mobile Filters */}
//             {showFilters && (
//               <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
//                 <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
//                   <div className="p-4">
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="font-semibold text-lg">Filters</h2>
//                       <button
//                         onClick={() => setShowFilters(false)}
//                         className="p-2 hover:bg-neutral-100 rounded-lg"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>

//                     {/* Same filter content as desktop */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-neutral-700 mb-2">
//                         Search
//                       </label>
//                       <form onSubmit={handleSearch} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           placeholder="Search products..."
//                           className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
//                         />
//                         <button
//                           type="submit"
//                           className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                         >
//                           <Search className="w-4 h-4" />
//                         </button>
//                       </form>
//                     </div>

//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-neutral-700 mb-2">
//                         Category
//                       </label>
//                       <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2 no-scrollbar">
//                         <button
//                           onClick={() => setSelectedCategory('')}
//                           className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
//                             !selectedCategory
//                               ? 'bg-orange-50 text-orange-600 font-semibold'
//                               : 'text-neutral-700 hover:bg-neutral-100'
//                           }`}
//                         >
//                           All Categories
//                         </button>
//                         {categories.map((category) => {
//                           const hasSubs = category.subcategories && category.subcategories.length > 0;
//                           const isMainSelected = selectedCategory === category.slug;
                          
//                           return (
//                             <div key={category._id} className="space-y-1">
//                               <button
//                                 onClick={() => setSelectedCategory(category.slug)}
//                                 className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
//                                   isMainSelected
//                                     ? 'bg-orange-50 text-orange-600 font-semibold'
//                                     : 'text-neutral-800 hover:bg-neutral-50 hover:text-orange-500'
//                                 }`}
//                               >
//                                 {category.icon && <span>{category.icon}</span>}
//                                 <span>{category.name}</span>
//                               </button>
                              
//                               {hasSubs && (
//                                 <div className="pl-4 border-l border-neutral-200 ml-3 space-y-1">
//                                   {category.subcategories.map((sub) => {
//                                     const isSubSelected = selectedCategory === sub.slug;
//                                     return (
//                                       <button
//                                         key={sub._id}
//                                         onClick={() => setSelectedCategory(sub.slug)}
//                                         className={`w-full text-left px-3 py-1 rounded-md text-xs flex items-center gap-1 ${
//                                           isSubSelected
//                                             ? 'bg-neutral-100 text-orange-600 font-semibold'
//                                             : 'text-neutral-600 hover:bg-neutral-50 hover:text-orange-500'
//                                         }`}
//                                       >
//                                         {sub.icon && <span>{sub.icon}</span>}
//                                         <span>{sub.name}</span>
//                                       </button>
//                                     );
//                                   })}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-neutral-700 mb-2">
//                         Sort By
//                       </label>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white"
//                       >
//                         <option value="newest">Newest First</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="name">Name: A to Z</option>
//                       </select>
//                     </div>

//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           clearFilters();
//                           setShowFilters(false);
//                         }}
//                         className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
//                       >
//                         Clear
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowFilters(false);
//                           fetchProducts();
//                         }}
//                         className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid */}
//             <div className="flex-1">
//               {loading ? (
//                 <div className="text-center py-12">Loading products...</div>
//               ) : products.length === 0 ? (
//                 <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
//                   <p className="text-neutral-500">No products found</p>
//                   {hasActiveFilters && (
//                     <button
//                       onClick={clearFilters}
//                       className="mt-4 text-orange-500 hover:text-orange-600"
//                     >
//                       Clear filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {products.map((product) => (
//                       <ProductCard
//                         key={product._id}
//                         product={product}
//                         onAddToCart={() => addToCart(product)}
//                       />
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="mt-8 flex justify-center gap-2">
//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                         (page) => (
//                           <button
//                             key={page}
//                             onClick={() => setCurrentPage(page)}
//                             className={`w-10 h-10 rounded-lg font-medium transition-colors ${
//                               currentPage === page
//                                 ? 'bg-orange-500 text-white'
//                                 : 'bg-white border border-neutral-200 hover:bg-neutral-100'
//                             }`}
//                           >
//                             {page}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//       <ScrollToTop />
//     </div>
//   );
// }

// export default function ShopPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
//       <ShopPageContent />
//     </Suspense>
//   );
// }
// new desing start
 'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Filter, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SidebarAd from '@/components/SidebarAd';
import { useCart } from '@/components/CartContext';
import ScrollToTop from '@/components/ScrollToTop';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const category = searchParams.get('category');
    const sub = searchParams.get('sub');
    const search = searchParams.get('search');
    if (sub) {
      setSelectedCategory(sub);
    } else if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('');
    }
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, sortBy, currentPage, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?tree=true');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (sortBy) params.append('sort', sortBy);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || searchQuery;

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                  Shop
                </h1>
                <p className="text-neutral-500 mt-2">
                  Browse our collection of premium mobiles and gadgets
                </p>
              </div>
              
              {/* Active Filters Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end">
                  <span className="text-sm text-neutral-500">Active filters:</span>
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                      Category
                      <button onClick={() => setSelectedCategory('')} className="hover:text-orange-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                      Price: {priceRange.min || '0'} - {priceRange.max || '∞'}
                      <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-green-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 sticky top-24 overflow-hidden">
                {/* Filter Header */}
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-orange-500" />
                      <h2 className="font-semibold text-lg text-neutral-800">Filters</h2>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Search Section */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Search Products
                    </label>
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full px-4 py-2.5 pl-11 pr-14 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-neutral-50"
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                      >
                        Go
                      </button>
                    </form>
                  </div>

                  {/* Categories Section */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Categories
                    </label>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                          !selectedCategory
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold border-l-4 border-orange-500'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-orange-500'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => {
                        const hasSubs = category.subcategories && category.subcategories.length > 0;
                        const isMainSelected = selectedCategory === category.slug;
                        const isExpanded = expandedCategories[category._id];
                        
                        return (
                          <div key={category._id} className="space-y-1">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 ${
                                  isMainSelected
                                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold border-l-4 border-orange-500'
                                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-orange-500'
                                }`}
                              >
                                {category.icon && <span className="text-lg">{category.icon}</span>}
                                <span>{category.name}</span>
                              </button>
                              {hasSubs && (
                                <button
                                  onClick={() => toggleCategory(category._id)}
                                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                                  )}
                                </button>
                              )}
                            </div>
                            
                            {hasSubs && isExpanded && (
                              <div className="pl-8 space-y-1 border-l-2 border-neutral-100 ml-4">
                                {category.subcategories.map((sub) => {
                                  const isSubSelected = selectedCategory === sub.slug;
                                  return (
                                    <button
                                      key={sub._id}
                                      onClick={() => setSelectedCategory(sub.slug)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                                        isSubSelected
                                          ? 'bg-neutral-100 text-orange-600 font-semibold'
                                          : 'text-neutral-500 hover:bg-neutral-50 hover:text-orange-500'
                                      }`}
                                    >
                                      {sub.icon && <span className="text-base">{sub.icon}</span>}
                                      <span>{sub.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range Section */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Price Range
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-neutral-500 mb-1 block">Min (৳)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange({ ...priceRange, min: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-neutral-50"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-neutral-500 mb-1 block">Max (৳)</label>
                          <input
                            type="number"
                            placeholder="Any"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange({ ...priceRange, max: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-neutral-50"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage(1);
                          fetchProducts();
                        }}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white rounded-xl hover:from-neutral-900 hover:to-neutral-950 transition-all text-sm font-medium"
                      >
                        Apply Price Filter
                      </button>
                    </div>
                  </div>

                  {/* Sort Section */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-neutral-50 cursor-pointer"
                    >
                      <option value="newest">✨ Newest First</option>
                      <option value="price-low">💰 Price: Low to High</option>
                      <option value="price-high">💎 Price: High to Low</option>
                      <option value="name">📝 Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sidebar Advertisement */}
              <div className="mt-6">
                <SidebarAd />
              </div>
            </aside>

            {/* Mobile Filters Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">Filters & Sort</span>
                {hasActiveFilters && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-in">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-neutral-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Filter className="w-5 h-5 text-orange-500" />
                          <h2 className="font-semibold text-lg">Filters</h2>
                        </div>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                      {/* Search */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Search Products
                        </label>
                        <form onSubmit={handleSearch} className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-4 py-2.5 pl-11 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          />
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </form>
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Categories
                        </label>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          <button
                            onClick={() => setSelectedCategory('')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                              !selectedCategory
                                ? 'bg-orange-50 text-orange-600 font-semibold'
                                : 'text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            All Categories
                          </button>
                          {categories.map((category) => {
                            const hasSubs = category.subcategories && category.subcategories.length > 0;
                            const isMainSelected = selectedCategory === category.slug;
                            const isExpanded = expandedCategories[category._id];
                            
                            return (
                              <div key={category._id} className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                                      isMainSelected
                                        ? 'bg-orange-50 text-orange-600 font-semibold'
                                        : 'text-neutral-800 hover:bg-neutral-50'
                                    }`}
                                  >
                                    {category.icon && <span>{category.icon}</span>}
                                    <span>{category.name}</span>
                                  </button>
                                  {hasSubs && (
                                    <button
                                      onClick={() => toggleCategory(category._id)}
                                      className="p-1"
                                    >
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                  )}
                                </div>
                                
                                {hasSubs && isExpanded && (
                                  <div className="pl-6 border-l border-neutral-200 ml-2 space-y-1">
                                    {category.subcategories.map((sub) => (
                                      <button
                                        key={sub._id}
                                        onClick={() => setSelectedCategory(sub.slug)}
                                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${
                                          selectedCategory === sub.slug
                                            ? 'bg-neutral-100 text-orange-600 font-semibold'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                        }`}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Sort By
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm bg-white"
                        >
                          <option value="newest">Newest First</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name">Name: A to Z</option>
                        </select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Price Range
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                          />
                          <span className="text-neutral-400">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-neutral-100 flex gap-2">
                      <button
                        onClick={() => {
                          clearFilters();
                          setShowFilters(false);
                        }}
                        className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 font-medium"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => {
                          setShowFilters(false);
                          fetchProducts();
                        }}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-neutral-500">Loading products...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-neutral-500 text-lg">No products found</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6 text-sm text-neutral-500">
                    Showing {products.length} products
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={() => addToCart(product)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                : 'bg-white border border-neutral-200 hover:bg-neutral-100 hover:border-orange-300'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
// new design end 