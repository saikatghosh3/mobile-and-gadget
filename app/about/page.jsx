// 'use client';

// import Link from 'next/link';
// import { ArrowRight, Target, Eye, Award, Shield, Truck, HeadphonesIcon, Star, HeartHandshake, Package, CheckCircle, Clock, BadgeCheck } from 'lucide-react';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

// const stats = [
//   { value: '10,000+', label: 'Happy Customers' },
//   { value: '5,000+', label: 'Products Delivered' },
//   { value: '98%', label: 'Satisfaction Rate' },
//   { value: '24/7', label: 'Customer Support' },
// ];

// const values = [
//   {
//     icon: Target,
//     title: 'Our Mission',
//     description: 'To provide everyone access to the latest technology at the most competitive prices, ensuring a seamless shopping experience from browse to delivery.',
//   },
//   {
//     icon: Eye,
//     title: 'Our Vision',
//     description: 'To become the most trusted and preferred online destination for mobiles and gadgets across Bangladesh, setting the standard for quality and service.',
//   },
// ];

// const whyChooseUs = [
//   {
//     icon: BadgeCheck,
//     title: 'Authentic Products',
//     description: 'Every product we sell is 100% genuine, sourced directly from authorized distributors and brand partners.',
//   },
//   {
//     icon: Award,
//     title: 'Best Price Guarantee',
//     description: 'We constantly monitor the market to ensure you get the best possible prices on every purchase.',
//   },
//   {
//     icon: Shield,
//     title: 'Secure Shopping',
//     description: 'Your privacy and security are our priority. All transactions are encrypted and protected.',
//   },
//   {
//     icon: HeadphonesIcon,
//     title: 'Dedicated Support',
//     description: 'Our customer service team is available 24/7 to assist you with any questions or concerns.',
//   },
// ];

// const qualityPoints = [
//   {
//     title: 'Rigorous Quality Checks',
//     description: 'Every product undergoes thorough inspection for authenticity, functionality, and condition before being listed on our platform.',
//   },
//   {
//     title: 'Brand Authorized',
//     description: 'We partner directly with authorized distributors and manufacturers to ensure every item meets the highest industry standards.',
//   },
//   {
//     title: 'Factory Sealed',
//     description: 'All products are delivered in factory-sealed packaging, guaranteeing that you receive untouched, brand-new items.',
//   },
//   {
//     title: 'Warranty Coverage',
//     description: 'Every purchase comes with manufacturer warranty and our additional satisfaction guarantee for complete peace of mind.',
//   },
// ];

// const deliverySteps = [
//   {
//     step: '01',
//     title: 'Order Placed',
//     description: 'Once you place your order, our system instantly processes it and sends a confirmation with estimated delivery time.',
//   },
//   {
//     step: '02',
//     title: 'Quality Check & Packing',
//     description: 'Our team carefully inspects your items, professionally packs them with secure materials to prevent any damage during transit.',
//   },
//   {
//     step: '03',
//     title: 'Shipped',
//     description: 'Your package is handed over to our trusted delivery partners with real-time tracking available.',
//   },
//   {
//     step: '04',
//     title: 'Delivered & Verified',
//     description: 'Our delivery agent contacts you before arrival. You can inspect the product at the time of delivery before making payment.',
//   },
// ];

// const trustElements = [
//   {
//     icon: Truck,
//     title: 'Free Delivery',
//     description: 'Free shipping on orders over TK 50 across Bangladesh.',
//   },
//   {
//     icon: Clock,
//     title: 'Fast Delivery',
//     description: 'Delivery within 3-7 business days anywhere in Bangladesh.',
//   },
//   {
//     icon: HeartHandshake,
//     title: 'Cash on Delivery',
//     description: 'Pay only when you receive your order. No advance payment needed.',
//   },
//   {
//     icon: Star,
//     title: 'Easy Returns',
//     description: 'Hassle-free returns within 7 days of delivery if you are not satisfied.',
//   },
// ];

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-neutral-50">
//       <Header />

//       <main className="flex-1">
//         {/* Hero Banner */}
//         <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
//           <div className="absolute inset-0">
//             <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
//           </div>
//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//             <div className="max-w-3xl">
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
//                 <ArrowRight className="w-3.5 h-3.5" />
//                 About Us
//               </div>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
//                 Your Trusted Destination for{' '}
//                 <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
//                   Premium Mobiles & Gadgets
//                 </span>
//               </h1>
//               <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl">
//                 At TechGadget, we are passionate about bringing you the latest technology 
//                 at the best prices. With a commitment to quality, authenticity, and 
//                 exceptional service, we strive to make your shopping experience seamless and enjoyable.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Stats Counter */}
//         <section className="bg-white border-b border-neutral-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {stats.map((stat) => (
//                 <div key={stat.label} className="text-center">
//                   <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-neutral-500">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Company Introduction */}
//         <section className="py-20 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//               <div>
//                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-4">
//                   <ArrowRight className="w-3.5 h-3.5" />
//                   Who We Are
//                 </div>
//                 <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-6">
//                   Leading the Way in{' '}
//                   <span className="text-orange-500">Tech Retail</span>
//                 </h2>
//                 <div className="space-y-4 text-neutral-600 leading-relaxed">
//                   <p>
//                     TechGadget is a premier online retailer of mobiles, tablets, laptops, 
//                     accessories, and cutting-edge gadgets. Founded with a simple vision — 
//                     to make the latest technology accessible to everyone — we have grown 
//                     into one of the most trusted names in tech retail across Bangladesh.
//                   </p>
//                   <p>
//                     We carefully curate our product selection, partnering only with 
//                     authorized distributors and reputable brands. From the newest smartphone 
//                     releases to essential accessories, every item in our catalog meets 
//                     stringent quality standards.
//                   </p>
//                   <p>
//                     Our dedicated team works tirelessly to ensure that every customer 
//                     receives personalized attention, expert guidance, and a shopping 
//                     experience that exceeds expectations.
//                   </p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
//                   <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
//                     <Package className="w-6 h-6 text-orange-600" />
//                   </div>
//                   <h3 className="font-semibold text-neutral-900 mb-2">Wide Selection</h3>
//                   <p className="text-sm text-neutral-500">Hundreds of products from top global brands</p>
//                 </div>
//                 <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 mt-8">
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
//                     <CheckCircle className="w-6 h-6 text-green-600" />
//                   </div>
//                   <h3 className="font-semibold text-neutral-900 mb-2">100% Authentic</h3>
//                   <p className="text-sm text-neutral-500">Genuine products with manufacturer warranty</p>
//                 </div>
//                 <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
//                   <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
//                     <HeadphonesIcon className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <h3 className="font-semibold text-neutral-900 mb-2">Expert Support</h3>
//                   <p className="text-sm text-neutral-500">Knowledgeable team ready to help you choose</p>
//                 </div>
//                 <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 mt-8">
//                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
//                     <Truck className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <h3 className="font-semibold text-neutral-900 mb-2">Fast Delivery</h3>
//                   <p className="text-sm text-neutral-500">Quick and reliable shipping nationwide</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Mission & Vision */}
//         <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-14">
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
//                 <ArrowRight className="w-3.5 h-3.5" />
//                 Our Purpose
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
//                 What Drives Us{' '}
//                 <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
//                   Every Day
//                 </span>
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {values.map((item) => (
//                 <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
//                   <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5">
//                     <item.icon className="w-7 h-7 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
//                   <p className="text-neutral-400 leading-relaxed">{item.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Why Choose Us */}
//         <section className="py-20 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-14">
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-4">
//                 <ArrowRight className="w-3.5 h-3.5" />
//                 Why TechGadget
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
//                 Why Thousands Choose{' '}
//                 <span className="text-orange-500">Us</span>
//               </h2>
//               <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
//                 We don't just sell products — we build lasting relationships with our customers 
//                 through trust, quality, and exceptional service.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {whyChooseUs.map((item) => (
//                 <div key={item.title} className="group bg-neutral-50 rounded-2xl p-6 border border-neutral-200 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
//                   <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                     <item.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
//                   <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Product Quality Information */}
//         <section className="py-20 bg-neutral-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//               <div className="order-2 lg:order-1">
//                 <div className="relative">
//                   <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-2xl -z-10" />
//                   <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
//                     <div className="p-8">
//                       <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
//                         100%
//                       </div>
//                       <h3 className="text-lg font-bold text-neutral-900 mb-3">Authentic Products Guaranteed</h3>
//                       <p className="text-neutral-600 text-sm leading-relaxed">
//                         We take product authenticity seriously. Every item in our inventory 
//                         is sourced directly from authorized distributors and brand partners, 
//                         ensuring you receive genuine products with full manufacturer warranty.
//                       </p>
//                     </div>
//                     <div className="border-t border-neutral-200 grid grid-cols-2 divide-x divide-neutral-200">
//                       <div className="p-6 text-center">
//                         <div className="text-2xl font-bold text-green-600 mb-1">0%</div>
//                         <div className="text-xs text-neutral-500">Counterfeit Risk</div>
//                       </div>
//                       <div className="p-6 text-center">
//                         <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
//                         <div className="text-xs text-neutral-500">Satisfaction</div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-100 rounded-2xl -z-10" />
//                 </div>
//               </div>
//               <div className="order-1 lg:order-2">
//                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-4">
//                   <ArrowRight className="w-3.5 h-3.5" />
//                   Product Quality
//                 </div>
//                 <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-6">
//                   We Never Compromise on{' '}
//                   <span className="text-orange-500">Quality</span>
//                 </h2>
//                 <div className="space-y-6">
//                   {qualityPoints.map((point) => (
//                     <div key={point.title} className="flex gap-4">
//                       <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                         <CheckCircle className="w-4 h-4 text-green-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-neutral-900 mb-1">{point.title}</h3>
//                         <p className="text-sm text-neutral-500 leading-relaxed">{point.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Delivery Process */}
//         <section className="py-20 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-14">
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-4">
//                 <ArrowRight className="w-3.5 h-3.5" />
//                 Delivery Process
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
//                 From Our Store to{' '}
//                 <span className="text-orange-500">Your Doorstep</span>
//               </h2>
//               <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
//                 A seamless delivery experience designed for your convenience
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {deliverySteps.map((step, index) => (
//                 <div key={step.title} className="relative group">
//                   {index < deliverySteps.length - 1 && (
//                     <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-200 to-orange-400" />
//                   )}
//                   <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 group-hover:border-orange-200 group-hover:shadow-lg transition-all duration-300">
//                     <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg">
//                       {step.step}
//                     </div>
//                     <h3 className="font-semibold text-neutral-900 mb-2">{step.title}</h3>
//                     <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Customer Trust Elements */}
//         <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-14">
//               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
//                 <ArrowRight className="w-3.5 h-3.5" />
//                 Why Trust Us
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
//                 Built on{' '}
//                 <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
//                   Trust & Reliability
//                 </span>
//               </h2>
//               <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
//                 We earn your trust through transparency, quality, and unwavering commitment to customer satisfaction
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {trustElements.map((item) => (
//                 <div key={item.title} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300">
//                   <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
//                     <item.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-white mb-2">{item.title}</h3>
//                   <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-20 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden">
//               <div className="absolute inset-0">
//                 <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//                 <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
//               </div>
//               <div className="relative px-8 py-14 md:px-16 md:py-20 text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                   Ready to Find Your Perfect Device?
//                 </h2>
//                 <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
//                   Explore our extensive collection of premium mobiles and gadgets. 
//                   Experience the TechGadget difference today.
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-4">
//                   <Link
//                     href="/shop"
//                     className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg"
//                   >
//                     Shop Now
//                     <ArrowRight className="w-4 h-4" />
//                   </Link>
//                   <Link
//                     href="/faq"
//                     className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 border border-white/20"
//                   >
//                     Visit FAQ
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// }



'use client';

import Link from 'next/link';
import { ArrowRight, Target, Eye, Award, Shield, Truck, HeadphonesIcon, Star, HeartHandshake, Package, CheckCircle, Clock, BadgeCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '5,000+', label: 'Products Delivered' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Customer Support' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide everyone access to the latest technology at the most competitive prices, ensuring a seamless shopping experience from browse to delivery.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become the most trusted and preferred online destination for mobiles and gadgets across Bangladesh, setting the standard for quality and service.',
  },
];

const whyChooseUs = [
  {
    icon: BadgeCheck,
    title: 'Authentic Products',
    description: 'Every product we sell is 100% genuine, sourced directly from authorized distributors and brand partners.',
  },
  {
    icon: Award,
    title: 'Best Price Guarantee',
    description: 'We constantly monitor the market to ensure you get the best possible prices on every purchase.',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your privacy and security are our priority. All transactions are encrypted and protected.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Our customer service team is available 24/7 to assist you with any questions or concerns.',
  },
];

const qualityPoints = [
  {
    title: 'Rigorous Quality Checks',
    description: 'Every product undergoes thorough inspection for authenticity, functionality, and condition before being listed on our platform.',
  },
  {
    title: 'Brand Authorized',
    description: 'We partner directly with authorized distributors and manufacturers to ensure every item meets the highest industry standards.',
  },
  {
    title: 'Factory Sealed',
    description: 'All products are delivered in factory-sealed packaging, guaranteeing that you receive untouched, brand-new items.',
  },
  {
    title: 'Warranty Coverage',
    description: 'Every purchase comes with manufacturer warranty and our additional satisfaction guarantee for complete peace of mind.',
  },
];

const deliverySteps = [
  {
    step: '01',
    title: 'Order Placed',
    description: 'Once you place your order, our system instantly processes it and sends a confirmation with estimated delivery time.',
  },
  {
    step: '02',
    title: 'Quality Check & Packing',
    description: 'Our team carefully inspects your items, professionally packs them with secure materials to prevent any damage during transit.',
  },
  {
    step: '03',
    title: 'Shipped',
    description: 'Your package is handed over to our trusted delivery partners with real-time tracking available.',
  },
  {
    step: '04',
    title: 'Delivered & Verified',
    description: 'Our delivery agent contacts you before arrival. You can inspect the product at the time of delivery before making payment.',
  },
];

const trustElements = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free shipping on orders over TK 50 across Bangladesh.',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Delivery within 3-7 business days anywhere in Bangladesh.',
  },
  {
    icon: HeartHandshake,
    title: 'Cash on Delivery',
    description: 'Pay only when you receive your order. No advance payment needed.',
  },
  {
    icon: Star,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days of delivery if you are not satisfied.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <Header />

      <main className="flex-1">
        {/* Hero Banner - Redesigned with better visual impact */}
        <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900/80 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-orange-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Welcome to TechGadget
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 md:mb-8">
                Your Trusted Destination for{' '}
                <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Premium Tech
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
                At TechGadget, we're passionate about bringing you the latest technology 
                at the best prices. Quality, authenticity, and exceptional service — 
                that's our promise to you.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#mission"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Counter - Redesigned with cards */}
        <section className="relative -mt-8 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Introduction - Redesigned layout */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Who We Are
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                  Leading the Way in{' '}
                  <span className="text-orange-500">Tech Retail</span>
                </h2>
                <div className="space-y-4 md:space-y-5 text-slate-600 leading-relaxed text-base md:text-lg">
                  <p className="font-medium text-slate-700">
                    TechGadget is a premier online retailer of mobiles, tablets, laptops, 
                    accessories, and cutting-edge gadgets.
                  </p>
                  <p>
                    Founded with a simple vision — to make the latest technology accessible 
                    to everyone — we have grown into one of the most trusted names in tech 
                    retail across Bangladesh.
                  </p>
                  <p className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                    <span className="font-semibold text-orange-600">Our Promise:</span> Every 
                    product is carefully curated, partnered only with authorized distributors 
                    and reputable brands.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Wide Selection</h3>
                  <p className="text-sm text-slate-600">Hundreds of products from top global brands</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300 mt-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">100% Authentic</h3>
                  <p className="text-sm text-slate-600">Genuine products with manufacturer warranty</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                    <HeadphonesIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Expert Support</h3>
                  <p className="text-sm text-slate-600">Knowledgeable team ready to help you choose</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 mt-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Fast Delivery</h3>
                  <p className="text-sm text-slate-600">Quick and reliable shipping nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Redesigned with cards */}
        <section id="mission" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                Our Purpose
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                What Drives Us{' '}
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Every Day
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((item) => (
                <div key={item.title} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-orange-500/40 hover:bg-white/20 transition-all duration-500 hover:scale-[1.02]">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Redesigned with icons */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Why TechGadget
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Why Thousands Choose{' '}
                <span className="text-orange-500">Us</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
                We don't just sell products — we build lasting relationships through trust, quality, and exceptional service.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Quality - Redesigned with better visuals */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl -z-10 rotate-12" />
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="p-10 bg-gradient-to-br from-orange-50 to-white">
                      <div className="text-7xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                        100%
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Authentic Products</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        Every item is sourced directly from authorized distributors and brand partners.
                      </p>
                    </div>
                    <div className="border-t border-slate-200 grid grid-cols-2 divide-x divide-slate-200">
                      <div className="p-8 text-center bg-gradient-to-br from-green-50 to-white">
                        <div className="text-3xl font-bold text-green-600 mb-1">0%</div>
                        <div className="text-sm text-slate-600 font-medium">Counterfeit Risk</div>
                      </div>
                      <div className="p-8 text-center bg-gradient-to-br from-orange-50 to-white">
                        <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
                        <div className="text-sm text-slate-600 font-medium">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-3xl -z-10 -rotate-12" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Product Quality
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-8">
                  We Never Compromise on{' '}
                  <span className="text-orange-500">Quality</span>
                </h2>
                <div className="space-y-6">
                  {qualityPoints.map((point, index) => (
                    <div key={point.title} className="flex gap-4 p-4 rounded-2xl hover:bg-white/70 transition-all duration-300 border border-transparent hover:border-slate-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{point.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Process - Redesigned with timeline */}
        <section className="py-24 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Delivery Process
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                From Our Store to{' '}
                <span className="text-orange-500">Your Doorstep</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
                A seamless delivery experience designed for your convenience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {deliverySteps.map((step, index) => (
                <div key={step.title} className="relative group">
                  {index < deliverySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-[55%] w-[70%] h-1 bg-gradient-to-r from-orange-300 to-orange-400" />
                  )}
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 group-hover:border-orange-300 group-hover:shadow-2xl group-hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-50 to-transparent rounded-full -translate-y-20 translate-x-20" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 text-white font-bold text-2xl shadow-xl shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Trust - Redesigned with better cards */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                Why Trust Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Built on{' '}
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Trust & Reliability
                </span>
              </h2>
              <p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-lg">
                Transparency, quality, and unwavering commitment to customer satisfaction
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustElements.map((item) => (
                <div key={item.title} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-orange-500/30 hover:bg-white/20 transition-all duration-500 hover:scale-[1.02]">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-orange-500/20 group-hover:shadow-orange-500/40">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Redesigned with better call to action */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/30">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
              </div>
              <div className="relative px-10 py-16 md:px-20 md:py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Ready to Find Your Perfect Device?
                </h2>
                <p className="text-orange-100 text-xl mb-10 max-w-2xl mx-auto">
                  Explore our collection of premium mobiles and gadgets. Experience the TechGadget difference today.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 hover:scale-105"
                  >
                    Visit FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}