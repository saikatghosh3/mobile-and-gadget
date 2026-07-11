'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'orders',
    title: 'Orders & Payments',
    questions: [
      { q: 'How do I place an order?', a: 'Simply browse our shop, add items to your cart, and proceed to checkout. You can pay using credit/debit cards, PayPal, or cash on delivery (where available).' },
      { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled or modified within 1 hour of placement. Contact our support team immediately if you need to make changes.' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Cash on Delivery for select locations.' },
      { q: 'Is my payment information secure?', a: 'Yes. We use industry-standard SSL encryption to protect your payment information. We never store full credit card details on our servers.' },
      { q: 'Do you offer installment plans?', a: 'Yes, we offer buy now, pay later options through Klarna and Afterpay on orders over $100.' },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    questions: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Next-day delivery is available for orders placed before 2 PM.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to select international destinations. Shipping costs and times vary by location. Check our <Link href="/shipping" className="text-orange-600 hover:underline">Shipping page</Link> for details.' },
      { q: 'How can I track my order?', a: 'Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard under My Orders.' },
      { q: 'What happens if my package is lost?', a: 'All shipments are insured. If your package is lost or damaged, contact our support team and we will send a replacement or issue a full refund.' },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unused items in original packaging. See our <Link href="/returns" className="text-orange-600 hover:underline">Returns page</Link> for full details.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount is credited to your original payment method.' },
      { q: 'Who pays for return shipping?', a: 'We provide a free prepaid return label for defective or incorrect items. For other returns, the shipping cost is deducted from the refund amount.' },
      { q: 'Can I exchange an item?', a: 'Yes, exchanges are processed as a return and a new order. Initiate a return from your account and place a new order for the desired item.' },
    ],
  },
  {
    id: 'account',
    title: 'Account & Support',
    questions: [
      { q: 'How do I create an account?', a: 'Click on the user icon in the top right corner and select "Sign Up". Fill in your details and verify your email to complete registration.' },
      { q: 'I forgot my password. What should I do?', a: 'On the login page, click "Forgot Password" and enter your email address. We will send you a password reset link.' },
      { q: 'How can I contact customer support?', a: 'You can reach us via email at support@techgadget.com, call +1 (555) 123-4567, or use the live chat feature on our website.' },
      { q: 'Can I update my shipping address after placing an order?', a: 'Address changes can be made within 1 hour of placing the order. Contact support immediately for assistance.' },
    ],
  },
  {
    id: 'products',
    title: 'Products & Warranty',
    questions: [
      { q: 'Are the products genuine?', a: 'Yes, we source all products directly from authorized distributors and manufacturers. Every product comes with a full manufacturer warranty.' },
      { q: 'What is the warranty period?', a: 'Warranty periods vary by product. Most electronics come with a 1-year manufacturer warranty. Premium items may have extended warranty options.' },
      { q: 'Do you offer price matching?', a: 'Yes, we offer price matching on identical items from major retailers. Contact our support team within 7 days of purchase with a valid proof of lower price.' },
      { q: 'Can I get a replacement for a defective item?', a: 'If your item arrives defective or gets damaged within the warranty period, contact our support team for a free replacement or repair.' },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-orange-100 text-lg">Find answers to common questions below.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenQuestion(null); }}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-orange-300 hover:text-orange-600'
              )}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {currentCategory.questions.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleQuestion(i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50"
              >
                <span className="font-medium text-neutral-900 pr-4">{item.q}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-200',
                    openQuestion === i && 'rotate-180'
                  )}
                />
              </button>
              {openQuestion === i && (
                <div className="px-5 pb-5 text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <Search className="w-8 h-8 mx-auto mb-3 text-orange-500" />
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Still have questions?</h2>
          <p className="text-neutral-600 mb-4">Our support team is here to help.</p>
          <Link
            href="/contact"
            className="inline-flex px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Contact Support
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
