'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Search, RotateCcw, X, Loader2, Upload, Trash2 } from 'lucide-react';

const RETURN_REASONS = [
  'Defective or damaged product',
  'Wrong item received',
  'Item not as described',
  'Size or fit issue',
  'Changed mind',
  'Other',
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [returnDialog, setReturnDialog] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState('');
  const [returnImages, setReturnImages] = useState([]);
  const [returnUploading, setReturnUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (orderId, itemId, itemName) => {
    setDeleteConfirm({ orderId, itemId, itemName });
  };

  const confirmDeleteItem = async () => {
    if (!deleteConfirm) return;
    setDeletingItem(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${deleteConfirm.orderId}/items/${deleteConfirm.itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === deleteConfirm.orderId ? data.data : o
          )
        );
      } else {
        alert(data.error || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    } finally {
      setDeletingItem(false);
      setDeleteConfirm(null);
    }
  };

  const handleReturnImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReturnUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) uploaded.push(data.url);
      }
      setReturnImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setReturnUploading(false);
    }
  };

  const removeReturnImage = (index) => {
    setReturnImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitReturn = async () => {
    if (!returnReason) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order: returnDialog._id,
          user: returnDialog.user,
          orderNumber: returnDialog.orderNumber,
          items: returnDialog.items.map((item) => ({
            product: item.product?._id || item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          reason: returnReason,
          details: returnDetails,
          images: returnImages,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReturnDialog(null);
        setReturnReason('');
        setReturnDetails('');
        setReturnImages([]);
        alert('Return request submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit return request');
      }
    } catch (err) {
      console.error('Error submitting return:', err);
      alert('Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      processing: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${styles[status] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const paymentBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredOrders = orders.filter((o) =>
    o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
        <p className="text-neutral-500 mt-1">View all your previous orders.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
          <p className="text-neutral-500 text-sm">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm mb-4">{searchQuery ? 'No orders match your search' : 'You haven\'t placed any orders yet'}</p>
          {!searchQuery && (
            <Link href="/shop" className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm">Start Shopping</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{order.orderNumber}</span>
                      {statusBadge(order.status)}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => {
                          setReturnDialog(order);
                          setReturnReason('');
                          setReturnDetails('');
                          setReturnImages([]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Request Return
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">৳{order.total?.toFixed(2)}</p>
                      <div className="flex items-center gap-1.5 justify-end mt-1">{paymentBadge(order.paymentStatus)}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Shipping Address</p>
                      <p className="text-neutral-700">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                        {' '}- {order.shippingAddress?.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Items ({order.items?.length || 0})</p>
                      <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                        {(order.items || []).map((item, i) => (
                          <div key={item._id || i} className="flex items-center justify-between gap-2 p-1.5 bg-neutral-50 rounded-lg text-xs">
                            <span className="font-medium text-neutral-700 truncate">{item.name} x {item.quantity}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-neutral-500">৳{(item.price * item.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => handleDeleteItem(order._id, item._id, item.name)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => !deletingItem && setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Remove Item</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Are you sure you want to remove <span className="font-semibold">{deleteConfirm.itemName}</span> from this order?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingItem}
                className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteItem}
                disabled={deletingItem}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {deletingItem && <Loader2 className="w-4 h-4 animate-spin" />}
                {deletingItem ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Dialog */}
      {returnDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => !submitting && setReturnDialog(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Request Return</h2>
                <p className="text-sm text-neutral-500">Order: {returnDialog.orderNumber}</p>
              </div>
              <button onClick={() => !submitting && setReturnDialog(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Items to Return</label>
                <div className="space-y-2">
                  {returnDialog.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl text-sm">
                      <span className="font-medium text-neutral-700">{item.name}</span>
                      <span className="text-neutral-500">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Return Reason *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                >
                  <option value="">Select a reason</option>
                  {RETURN_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Additional Details</label>
                <textarea
                  value={returnDetails}
                  onChange={(e) => setReturnDetails(e.target.value)}
                  placeholder="Provide any additional information about the return..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Images (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {returnImages.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeReturnImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 text-sm text-neutral-600">
                  <Upload className="w-4 h-4" />
                  {returnUploading ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReturnImageUpload}
                    className="hidden"
                    disabled={returnUploading}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-neutral-200">
              <button
                onClick={() => setReturnDialog(null)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitReturn}
                disabled={submitting || !returnReason}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
