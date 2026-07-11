import Link from 'next/link';
import { RotateCcw, RefreshCw, DollarSign, Clock, Shield, FileText } from 'lucide-react';

export default function ReturnsPage() {
  const sections = [
    {
      icon: RefreshCw,
      title: 'Return Policy',
      content: 'We offer a 30-day return policy from the date of delivery. If you are not completely satisfied with your purchase, you can return it for a full refund or exchange within 30 days.',
    },
    {
      icon: RotateCcw,
      title: 'Eligibility Criteria',
      items: [
        'Items must be unused and in original packaging with all accessories and tags intact.',
        'Electronics must not show signs of physical damage, water damage, or unauthorized modifications.',
        'Serial numbers must match the original product.',
        'Personalized or custom items are non-returnable unless defective.',
        'Software, digital downloads, and gift cards are non-refundable once redeemed.',
      ],
    },
    {
      icon: DollarSign,
      title: 'Refund Process',
      items: [
        'Refunds are processed within 5-7 business days after we receive and inspect the returned item.',
        'Refunds are issued to the original payment method used at checkout.',
        'Shipping costs are non-refundable unless the return is due to our error.',
        'You will receive an email notification once your refund has been initiated.',
      ],
    },
    {
      icon: Clock,
      title: 'How to Initiate a Return',
      steps: [
        'Login to your account and go to My Orders.',
        'Select the item you wish to return and click "Request Return".',
        'Choose the reason for return and submit the request.',
        'You will receive a return authorization and prepaid shipping label via email.',
        'Pack the item securely, attach the shipping label, and drop it off at the carrier location.',
      ],
    },
    {
      icon: Shield,
      title: 'Warranty Information',
      content: 'All products come with a manufacturer warranty covering defects in materials and workmanship. Warranty periods vary by product category (typically 1-2 years). Warranties do not cover accidental damage, normal wear and tear, or issues caused by improper use.',
    },
    {
      icon: FileText,
      title: 'Exceptions',
      items: [
        'Final sale items marked as "Clearance" or "Final Sale" cannot be returned.',
        'Opened software, gaming codes, and downloadable content are non-refundable.',
        'Items returned without prior authorization will be refused.',
        'Customers are responsible for return shipping costs unless the return is due to a defective or incorrect item.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">Returns & Refunds</h1>
          <p className="text-orange-100 text-lg">Hassle-free returns. We make it easy.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">{section.title}</h2>
            </div>

            {section.content && (
              <p className="text-neutral-600 leading-relaxed">{section.content}</p>
            )}

            {section.items && (
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-600">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.steps && (
              <ol className="space-y-3">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-600">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
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
