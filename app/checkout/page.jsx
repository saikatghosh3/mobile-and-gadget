'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, FileText, Download, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { formatTk } from '@/lib/utils';

function CheckoutPageContent() {
  const { cart, getCartTotal, getCartCount, clearCart, appliedCoupon, removeCoupon, getDiscount, getDiscountedTotal } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    notes: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.fullName || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || '',
      }));
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSavedAddresses(data.data);
        const defaultAddr = data.data.find((a) => a.isDefault);
        if (defaultAddr) applyAddress(defaultAddr);
      }
    } catch {}
  };

  const applyAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      customerName: addr.fullName || prev.customerName,
      customerPhone: addr.phone || prev.customerPhone,
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      country: addr.country || 'Bangladesh',
    }));
    setSelectedAddressId(addr._id || 'new');
  };

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (id === 'new') return;
    const addr = savedAddresses.find((a) => a._id === id);
    if (addr) applyAddress(addr);
  };

  const formatPrice = (price) => formatTk(price);

  const subtotal = getCartTotal();
  const discount = getDiscount(subtotal);
  const isFreeShippingCoupon = appliedCoupon?.discountType === 'free_shipping';
  const shipping = isFreeShippingCoupon ? 0 : (subtotal > 50 ? 0 : 9.99);
  const total = getDiscountedTotal(subtotal) + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Snapshot the cart before clearing it
    const cartSnapshot = [...cart];
    const subtotalSnapshot = getCartTotal();
    const discountSnapshot = getDiscount(subtotalSnapshot);
    const isFreeShip = appliedCoupon?.discountType === 'free_shipping';
    const shippingSnapshot = isFreeShip ? 0 : (subtotalSnapshot > 50 ? 0 : 9.99);
    const totalSnapshot = getDiscountedTotal(subtotalSnapshot) + shippingSnapshot;

    const orderData = {
      user: user?._id || null,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      items: cartSnapshot.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: subtotalSnapshot,
      shipping: shippingSnapshot,
      total: totalSnapshot,
      couponCode: appliedCoupon?.code || '',
      couponDiscount: discountSnapshot,
      notes: formData.notes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        const num = data.data.orderNumber;
        setOrderNumber(num);
        setOrderDetails({
          orderNumber: num,
          orderDate: new Date(),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: cartSnapshot,
          subtotal: subtotalSnapshot,
          shipping: shippingSnapshot,
          total: totalSnapshot,
          couponCode: appliedCoupon?.code || '',
          couponDiscount: discountSnapshot,
          notes: formData.notes,
        });
        setOrderPlaced(true);
        clearCart();
        toast({
          title: 'Order placed successfully!',
          description: 'We will contact you shortly to confirm your order.',
        });
      } else {
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = () => {
    if (!orderDetails) return;

    const {
      orderNumber,
      orderDate,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      notes,
    } = orderDetails;

    const formattedDate = new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(orderDate);

    const formattedDateEn = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(orderDate);

    const itemRows = items
      .map(
        (item, idx) => `
        <tr class="${idx % 2 === 0 ? 'row-even' : 'row-odd'}">
          <td>${idx + 1}</td>
          <td class="product-name">${item.name}</td>
          <td class="center">${item.quantity}</td>
          <td class="right">${formatPrice(item.price)}</td>
          <td class="right bold">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
      )
      .join('');

    const invoiceHTML = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invoice / ইনভয়েস - ${orderNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
      background: #f8f9fa;
      color: #1a1a2e;
      font-size: 13px;
      line-height: 1.6;
    }

    .page-wrapper {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .invoice-card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    /* ── Header ──────────────────────────────── */
    .invoice-header {
      background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
      padding: 36px 40px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-block .brand-name {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-block .brand-tagline {
      font-size: 12px;
      opacity: 0.85;
      margin-top: 4px;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-meta .invoice-label {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .invoice-meta .invoice-label-bn {
      font-family: 'Noto Sans Bengali', sans-serif;
      font-size: 18px;
      font-weight: 600;
      opacity: 0.9;
    }

    .invoice-meta .invoice-number {
      font-size: 13px;
      margin-top: 8px;
      opacity: 0.9;
    }

    .invoice-meta .invoice-date {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 3px;
    }

    /* ── Status strip ─────────────────────────── */
    .status-strip {
      background: #fff7ed;
      border-bottom: 2px solid #fed7aa;
      padding: 10px 40px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
      flex-shrink: 0;
    }

    .status-strip span {
      font-size: 12px;
      font-weight: 600;
      color: #9a3412;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    /* ── Info Grid ──────────────────────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .info-block {
      padding: 28px 40px;
    }

    .info-block:first-child {
      border-right: 1px solid #f1f5f9;
    }

    .info-block-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #ea580c;
      margin-bottom: 12px;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    .info-block .customer-name {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .info-block p {
      font-size: 12.5px;
      color: #475569;
      margin-bottom: 2px;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    /* ── Items Table ──────────────────────────── */
    .table-wrapper {
      padding: 0 40px 30px;
    }

    .section-heading {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #ea580c;
      padding: 24px 0 12px;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr {
      background: #1e293b;
      color: #fff;
    }

    thead th {
      padding: 11px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    thead th.center { text-align: center; }
    thead th.right  { text-align: right; }

    tbody td {
      padding: 11px 14px;
      font-size: 12.5px;
      color: #334155;
      vertical-align: middle;
    }

    td.center { text-align: center; }
    td.right  { text-align: right; }
    td.bold   { font-weight: 600; color: #0f172a; }
    td.product-name { font-weight: 500; color: #0f172a; max-width: 260px; }

    .row-even { background: #ffffff; }
    .row-odd  { background: #f8fafc; }

    /* ── Totals ───────────────────────────────── */
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      padding: 0 40px 32px;
    }

    .totals-box {
      width: 260px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 9px 16px;
      font-size: 12.5px;
      border-bottom: 1px solid #f1f5f9;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    .totals-row:last-child { border-bottom: none; }

    .totals-row .label { color: #64748b; }
    .totals-row .value { font-weight: 600; color: #0f172a; }

    .totals-row.total-final {
      background: linear-gradient(135deg, #ea580c, #c2410c);
      color: #fff !important;
    }

    .totals-row.total-final .label,
    .totals-row.total-final .value {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
    }

    /* ── Notes ──────────────────────────────────── */
    .notes-wrapper {
      padding: 0 40px 28px;
    }

    .notes-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 12px;
      color: #78350f;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
    }

    /* ── COD Banner ─────────────────────────────── */
    .cod-banner {
      margin: 0 40px 28px;
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      border-radius: 10px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cod-icon {
      font-size: 22px;
    }

    .cod-text-en {
      font-size: 12.5px;
      font-weight: 600;
      color: #15803d;
    }

    .cod-text-bn {
      font-family: 'Noto Sans Bengali', sans-serif;
      font-size: 12px;
      color: #166534;
    }

    /* ── Footer ──────────────────────────────────── */
    .invoice-footer {
      background: #1e293b;
      color: #94a3b8;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    .invoice-footer .thank-you {
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
      font-size: 12.5px;
      color: #e2e8f0;
      font-weight: 500;
    }

    .invoice-footer .brand-small {
      font-weight: 700;
      color: #fb923c;
      font-size: 13px;
    }

    /* ── Print ────────────────────────────────── */
    .print-btn-wrapper {
      text-align: center;
      padding: 24px 0 8px;
    }

    .print-btn {
      background: linear-gradient(135deg, #ea580c, #c2410c);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
      margin: 0 6px;
      box-shadow: 0 2px 8px rgba(234,88,12,0.3);
    }

    .print-btn:hover { opacity: 0.9; }

    @media print {
      body { background: #fff; }
      .page-wrapper { padding: 0; max-width: 100%; }
      .invoice-card { box-shadow: none; border-radius: 0; }
      .print-btn-wrapper { display: none; }
    }
  </style>
</head>
<body>
  <div class="page-wrapper">

    <div class="print-btn-wrapper">
      <button class="print-btn" onclick="window.print()">
        🖨️ &nbsp;প্রিন্ট করুন / Print Invoice
      </button>
      <button class="print-btn" style="background: linear-gradient(135deg,#0f172a,#1e293b)" onclick="window.close()">
        ✕ &nbsp;বন্ধ করুন / Close
      </button>
    </div>

    <div class="invoice-card">

      <!-- Header -->
      <div class="invoice-header">
        <div class="brand-block">
          <div class="brand-name">TechGadget</div>
          <div class="brand-tagline">প্রিমিয়াম মোবাইল ও গ্যাজেট শপ</div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-label">Invoice</div>
          <div class="invoice-label-bn">ইনভয়েস</div>
          <div class="invoice-number"># ${orderNumber}</div>
          <div class="invoice-date">${formattedDateEn}</div>
        </div>
      </div>

      <!-- Status strip -->
      <div class="status-strip">
        <div class="status-dot"></div>
        <span>অর্ডার সফলভাবে সম্পন্ন হয়েছে &nbsp;|&nbsp; Order Placed Successfully</span>
      </div>

      <!-- Info grid -->
      <div class="info-grid">
        <div class="info-block">
          <div class="info-block-title">গ্রাহকের তথ্য / Customer Info</div>
          <div class="customer-name">${customerName}</div>
          <p>📧 ${customerEmail}</p>
          <p>📞 ${customerPhone}</p>
        </div>
        <div class="info-block">
          <div class="info-block-title">ডেলিভারি ঠিকানা / Shipping Address</div>
          <p>${shippingAddress.street}</p>
          <p>${shippingAddress.city}${shippingAddress.state ? ', ' + shippingAddress.state : ''} ${shippingAddress.zipCode || ''}</p>
          <p>${shippingAddress.country}</p>
          <p style="margin-top:6px; font-size:11px; color:#94a3b8;">${formattedDate}</p>
        </div>
      </div>

      <!-- Items table -->
      <div class="table-wrapper">
        <div class="section-heading">পণ্যের তালিকা / Order Items</div>
        <table>
          <thead>
            <tr>
              <th style="width:36px">#</th>
              <th>পণ্যের নাম / Product Name</th>
              <th class="center" style="width:70px">পরিমাণ / Qty</th>
              <th class="right" style="width:90px">একক মূল্য / Unit</th>
              <th class="right" style="width:100px">মোট / Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="totals-wrapper">
        <div class="totals-box">
            <div class="totals-row">
            <span class="label">সাবটোটাল / Subtotal</span>
            <span class="value">${formatPrice(subtotal)}</span>
          </div>
          <div class="totals-row">
            <span class="label">ডেলিভারি / Shipping</span>
            <span class="value">${shipping === 0 ? '🎉 বিনামূল্যে / FREE' : formatPrice(shipping)}</span>
          </div>
          <div class="totals-row total-final">
            <span class="label">সর্বমোট / Grand Total</span>
            <span class="value">${formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <!-- Payment method -->
      <div class="cod-banner">
        <div class="cod-icon">💵</div>
        <div>
          <div class="cod-text-en">Cash on Delivery (COD)</div>
          <div class="cod-text-bn">ক্যাশ অন ডেলিভারি — পণ্য পেলে পরে পেমেন্ট করুন</div>
        </div>
      </div>

      ${notes ? `
      <!-- Notes -->
      <div class="notes-wrapper">
        <div class="section-heading" style="padding-top:0">বিশেষ নির্দেশনা / Special Notes</div>
        <div class="notes-box">${notes}</div>
      </div>` : ''}

      <!-- Footer -->
      <div class="invoice-footer">
        <div class="thank-you">
          আপনার কেনাকাটার জন্য ধন্যবাদ! &nbsp;|&nbsp; Thank you for shopping with us!
        </div>
        <div class="brand-small">TechGadget</div>
      </div>

    </div><!-- /.invoice-card -->
  </div><!-- /.page-wrapper -->

  <script>
    // Auto-focus for better UX on open
    window.onload = () => { document.querySelector('.print-btn')?.focus(); };
  </script>
</body>
</html>`;

    const invoiceWindow = window.open('', '_blank', 'width=900,height=700');
    if (!invoiceWindow) {
      toast({
        title: 'Pop-up blocked',
        description: 'Please allow pop-ups for this site to download your invoice.',
        variant: 'destructive',
      });
      return;
    }
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  // ─── Order Success Screen ────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-lg w-full">
            {/* Success Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-600" />

              <div className="p-10 text-center">
                {/* Animated checkmark */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-100">
                  <CheckCircle className="w-11 h-11 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                  Order Placed! 🎉
                </h1>
                <p className="text-base font-medium text-neutral-500 mb-6" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে
                </p>

                {/* Order number chip */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">Order</span>
                  <span className="text-sm font-bold text-orange-700">{orderNumber}</span>
                </div>

                <p className="text-sm text-neutral-500 mb-1">
                  We will contact you shortly to confirm your order.
                </p>
                <p className="text-sm text-neutral-400 mb-8" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব। পেমেন্ট ডেলিভারিতে করুন।
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Invoice Download — primary CTA */}
                  <button
                    onClick={generateInvoice}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>ইনভয়েস ডাউনলোড করুন</span>
                    <span className="opacity-70 text-xs font-normal">/ Download Invoice</span>
                  </button>

                  {/* Continue Shopping */}
                  <Link href="/shop" className="block">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-sm transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-neutral-400 mt-6" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              ইনভয়েসটি একটি নতুন ট্যাবে খুলবে &bull; The invoice will open in a new tab.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Checkout Form ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
                <h2 className="font-semibold text-lg text-neutral-900 mb-6">
                  Checkout
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-4">
                      Shipping Address
                    </h3>

                    {savedAddresses.length > 0 && (
                      <div className="mb-4">
                        <Label htmlFor="savedAddress">Saved Address</Label>
                        <select
                          id="savedAddress"
                          value={selectedAddressId}
                          onChange={handleAddressSelect}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="new">Enter new address</option>
                          {savedAddresses.map((addr) => (
                            <option key={addr._id} value={addr._id}>
                              {addr.label || 'Address'} — {addr.street}, {addr.city}{addr.state ? ', ' + addr.state : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({ ...formData, state: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) =>
                              setFormData({ ...formData, zipCode: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({ ...formData, country: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <Label htmlFor="notes">Order Notes (optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Any special instructions for your order"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-900 mb-2">
                      Payment Method
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Cash on Delivery — Pay when you receive your order
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-neutral-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {appliedCoupon && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-orange-600 font-mono">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-orange-500">
                        {appliedCoupon.discountType === 'free_shipping' ? 'Free shipping' :
                         `${appliedCoupon.discountType === 'percentage' ? appliedCoupon.discountValue + '%' : formatPrice(appliedCoupon.discountValue)} discount`}
                      </p>
                    </div>
                    <button onClick={removeCoupon} className="text-orange-400 hover:text-orange-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
