'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, Check, Minus, Plus, ChevronLeft, ChevronRight, Heart, Share2, Truck, Shield, RotateCcw, ZoomIn } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { useAuth } from '@/components/AuthContext';
import ProductDetailsAd from '@/components/ProductDetailsAd';
import { formatTk } from '@/lib/utils';

function ProductPageContent() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [mounted, setMounted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const getProductUrl = () =>
    typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = [
    {
      name: 'WhatsApp',
      color: 'hover:bg-green-50 hover:text-green-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ),
      href: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      name: 'Facebook',
      color: 'hover:bg-blue-50 hover:text-blue-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
      href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'X / Twitter',
      color: 'hover:bg-neutral-100 hover:text-neutral-900',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      href: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Telegram',
      color: 'hover:bg-sky-50 hover:text-sky-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      ),
      href: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getProductUrl());
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close share dropdown on outside click
  useEffect(() => {
    if (!shareOpen) return;
    const handler = () => setShareOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [shareOpen]);

  const isWishlisted = mounted && product ? isInWishlist(product._id) : false;

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
      fetchReviews();
    }
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?slug=${params.slug}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setProduct(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews`);
      const data = await res.json();
      const productReviews = (data.data || []).filter(
        (r) => r.product?.slug === params.slug
      );
      setReviews(productReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product._id,
          rating: reviewForm.rating,
          title: reviewForm.title,
          content: reviewForm.content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        setReviewForm({ rating: 5, title: '', content: '' });
      }
    } catch {}
    setReviewSubmitting(false);
  };

  const formatPrice = (price) => formatTk(price);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/register?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (product && product.stock > 0) {
      addToCart(product, quantity);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-all ${
            i < rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-neutral-300'
          }`}
        />
      ));
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
            <p className="text-neutral-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-neutral-500">
              <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/shop" className="hover:text-orange-500 transition-colors">Shop</a></li>
              <li>/</li>
              <li className="text-neutral-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
         {/* Main Image with Zoom - Fixed Version */}
<div className="relative aspect-square bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-lg group cursor-zoom-in">
  {product.images && product.images[selectedImage] ? (
    <div className="relative w-full h-full">
      {/* Normal Image */}
      <img
        src={product.images[selectedImage]}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      
      {/* Zoom Lens Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseMove={(e) => {
          const rect = e.currentTarget.parentElement?.getBoundingClientRect();
          if (rect) {
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const zoomElement = e.currentTarget;
            zoomElement.style.backgroundImage = `url(${product.images[selectedImage]})`;
            zoomElement.style.backgroundPosition = `${x}% ${y}%`;
            zoomElement.style.backgroundSize = '200%';
            zoomElement.style.backgroundRepeat = 'no-repeat';
          }
        }}
        style={{
          backgroundImage: `url(${product.images[selectedImage]})`,
          backgroundSize: '200%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
        }}
      />
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center text-neutral-400">
      <div className="text-center">
        <ZoomIn className="w-16 h-16 mx-auto mb-2 opacity-50" />
        <p>No image available</p>
      </div>
    </div>
  )}

  {/* Badges */}
  <div className="absolute top-4 left-4 flex flex-col gap-2">
    {discount > 0 && (
      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
        -{discount}% OFF
      </span>
    )}
    {product.stock <= 5 && product.stock > 0 && (
      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
        Only {product.stock} left!
      </span>
    )}
    {product.stock === 0 && (
      <span className="bg-neutral-800 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
        Out of Stock
      </span>
    )}
  </div>

  {/* Zoom Icon Hint */}
  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
    <ZoomIn className="w-5 h-5 text-neutral-600" />
  </div>

  {/* Action Buttons Floating */}
  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button
      onClick={() => {
        if (!isAuthenticated) {
          router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
          return;
        }
        toggleWishlist(product);
      }}
      className={`p-3 rounded-full shadow-lg transition-all ${
        isWishlisted
          ? 'bg-red-500 text-white'
          : 'bg-white text-neutral-600 hover:bg-red-50 hover:text-red-500'
      }`}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
    <div className="relative">
      <button
        onClick={() => setShareOpen((o) => !o)}
        className="p-3 rounded-full bg-white text-neutral-600 hover:bg-orange-50 hover:text-orange-500 shadow-lg transition-all"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {shareOpen && (
        <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50">
          <p className="px-4 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Share on</p>
          {shareLinks.map((s) => (
            <a
              key={s.name}
              href={s.href(getProductUrl(), product.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShareOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors ${s.color}`}
            >
              {s.icon}
              <span>{s.name}</span>
            </a>
          ))}
          <div className="border-t border-neutral-100 mt-1 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>{copyDone ? '✓ Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category?.name}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  {product.brand}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-900">{averageRating.toFixed(1)}</span> ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-neutral-50 to-orange-50 rounded-2xl p-6">
                <div className="flex items-end gap-4">
                  <span className="text-5xl font-bold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl text-neutral-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  product.stock > 0
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {product.stock > 0 ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-medium">In Stock</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Out of Stock</span>
                    </>
                  )}
                </div>
                {product.stock > 0 && (
                  <span className="text-sm text-neutral-500">
                    {product.stock} units available
                  </span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-3">
                <div className="flex items-center border-2 border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-semibold text-lg bg-neutral-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= (product.stock || 99)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-lg shadow-orange-500/30 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="flex flex-col items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                  <Truck className="w-6 h-6 text-orange-500" />
                  <span className="text-xs font-medium text-neutral-600 text-center">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                  <Shield className="w-6 h-6 text-orange-500" />
                  <span className="text-xs font-medium text-neutral-600 text-center">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                  <RotateCcw className="w-6 h-6 text-orange-500" />
                  <span className="text-xs font-medium text-neutral-600 text-center">Easy Returns</span>
                </div>
              </div>

              {/* Features Quick View */}
              {product.features && product.features.length > 0 && (
                <div className="bg-neutral-50 rounded-xl p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Key Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Advertisement */}
          <ProductDetailsAd />

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="border-b border-neutral-200">
              <div className="flex gap-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'reviews', label: `Reviews (${reviews.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-orange-500'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-neutral-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="bg-neutral-50 rounded-2xl overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, value], index) => (
                            <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                              <td className="font-semibold text-neutral-700 px-6 py-4 w-1/3 border-b border-neutral-100">
                                {key}
                              </td>
                              <td className="text-neutral-900 px-6 py-4 border-b border-neutral-100">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-8">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl">
                      <Star className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500 text-lg">No reviews yet for this product</p>
                      <p className="text-neutral-400 text-sm mt-2">Be the first to review!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.authorName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-semibold text-neutral-900">
                                  {review.authorName}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                  {review.isVerified && (
                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                      <Check className="w-3 h-3" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-neutral-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="font-medium text-neutral-900 mb-2">{review.title}</h5>
                          <p className="text-neutral-600">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Form — only for authenticated users */}
                  {isAuthenticated ? (
                    reviewSubmitted ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-green-800">Review submitted!</p>
                        <p className="text-sm text-green-600 mt-1">
                          Your review will appear once approved by the admin.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
                        <h3 className="font-semibold text-neutral-900 mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                  className="p-1 transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-7 h-7 ${
                                      star <= reviewForm.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-neutral-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="reviewTitle">Title</Label>
                            <Input
                              id="reviewTitle"
                              value={reviewForm.title}
                              onChange={(e) =>
                                setReviewForm({ ...reviewForm, title: e.target.value })
                              }
                              placeholder="Great product!"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="reviewContent">Review</Label>
                            <textarea
                              id="reviewContent"
                              value={reviewForm.content}
                              onChange={(e) =>
                                setReviewForm({ ...reviewForm, content: e.target.value })
                              }
                              placeholder="Share your experience with this product..."
                              required
                              rows={4}
                              className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={reviewSubmitting}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </form>
                      </div>
                    )
                  ) : reviews.length === 0 ? null : (
                    <p className="text-center text-sm text-neutral-500 mt-6">
                      <a href="/login" className="text-orange-500 hover:underline">Sign in</a> to write a review
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductPage() {
  return <ProductPageContent />;
}
