import Link from 'next/link';
import { Package, Truck, Clock, MapPin, Shield, Headphones } from 'lucide-react';

export default function ShippingPage() {
  const policies = [
    {
      icon: Truck,
      title: 'Delivery Options',
      items: [
        'Standard Delivery: 5-7 business days — Free on orders over $50',
        'Express Delivery: 2-3 business days — $9.99 flat rate',
        'Next Day Delivery: Order before 2 PM for next-day arrival — $14.99',
        'International Shipping: 10-15 business days via DHL/FedEx — rates calculated at checkout',
      ],
    },
    {
      icon: Clock,
      title: 'Order Processing',
      items: [
        'Orders are processed within 1-2 business days after payment confirmation.',
        'Orders placed on weekends or public holidays will be processed the next business day.',
        'You will receive a confirmation email with tracking details once your order ships.',
      ],
    },
    {
      icon: MapPin,
      title: 'Shipping Destinations',
      items: [
        'We currently ship to all 50 US states and select international destinations.',
        'PO Box and APO/FPO addresses are supported for standard delivery only.',
        'Some remote areas may experience longer delivery times.',
      ],
    },
    {
      icon: Shield,
      title: 'Order Protection',
      items: [
        'All shipments are insured against loss or damage during transit.',
        'Package tracking is included with every order at no extra cost.',
        'Signature on delivery is available upon request for high-value items.',
      ],
    },
    {
      icon: Package,
      title: 'Shipping Rates',
      items: [
        'Free standard shipping on all orders over $50 within the continental US.',
        'Flat rate of $4.99 for standard shipping on orders under $50.',
        'Heavy or oversized items may incur additional handling fees (notified before shipping).',
        'International shipping costs are calculated based on weight and destination.',
      ],
    },
    {
      icon: Headphones,
      title: 'Need Help?',
      items: [
        'Contact our support team at support@techgadget.com or call +1 (555) 123-4567.',
        'Live chat available Monday to Friday, 9 AM - 6 PM EST.',
        'Refer to our FAQ page for common shipping questions.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Truck className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">Shipping Information</h1>
          <p className="text-orange-100 text-lg">Fast, reliable delivery right to your doorstep.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {policies.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-600">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
