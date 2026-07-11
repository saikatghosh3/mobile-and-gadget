'use client';

import { useEffect, useState } from 'react';
import { Eye, Truck, XCircle, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatTk } from '@/lib/utils';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url =
        statusFilter === 'all'
          ? '/api/orders?admin=true'
          : `/api/orders?status=${statusFilter}&admin=true`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: 'Order status updated' });
        fetchOrders();
        // If the updated order is currently viewed in detail, update that state too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

    const handleDelete = async (orderId) => {
      if (!confirm('Delete this order? This action cannot be undone.')) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          toast({ title: 'Order deleted' });
          fetchOrders();
          if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder(null);
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to delete order', variant: 'destructive' });
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({ title: 'Error', description: 'Failed to delete order', variant: 'destructive' });
      }
    };

  const formatPrice = (price) => formatTk(price);

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-250',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-250',
      processing: 'bg-purple-100 text-purple-700 border-purple-250',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-250',
      delivered: 'bg-green-100 text-green-700 border-green-250',
      cancelled: 'bg-red-100 text-red-700 border-red-250',
    };

    return (
      <span
        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}
      >
        {status}
      </span>
    );
  };

  const statusActions = (order) => {
    const actions = [];

    switch (order.status) {
      case 'pending':
        actions.push(
          <Button
            key="confirm"
            size="sm"
            variant="outline"
            onClick={() => updateOrderStatus(order._id, 'confirmed')}
            className="h-8 px-2.5"
          >
            <CheckCircle className="w-4 h-4 mr-1 text-neutral-650" />
            Confirm
          </Button>
        );
        break;
      case 'confirmed':
        actions.push(
          <Button
            key="process"
            size="sm"
            variant="outline"
            onClick={() => updateOrderStatus(order._id, 'processing')}
            className="h-8 px-2.5"
          >
            Process
          </Button>
        );
        break;
      case 'processing':
        actions.push(
          <Button
            key="ship"
            size="sm"
            variant="outline"
            onClick={() => updateOrderStatus(order._id, 'shipped')}
            className="h-8 px-2.5"
          >
            <Truck className="w-4 h-4 mr-1 text-neutral-650" />
            Ship
          </Button>
        );
        break;
      case 'shipped':
        actions.push(
          <Button
            key="deliver"
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white h-8 px-2.5 font-semibold"
            onClick={() => updateOrderStatus(order._id, 'delivered')}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Delivered
          </Button>
        );
        break;
    }

    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="destructive"
          onClick={() => updateOrderStatus(order._id, 'cancelled')}
          className="h-8 px-2.5"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      );
    }

    return actions;
  };

  const filteredOrders = orders.filter((order) => {
    const orderNum = order.orderNumber || '';
    const customerName = order.customerName || '';
    const customerEmail = order.customerEmail || '';
    const search = searchQuery.toLowerCase();
    return (
      orderNum.toLowerCase().includes(search) ||
      customerName.toLowerCase().includes(search) ||
      customerEmail.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-600 mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search orders (by order #, customer name, email)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white border border-neutral-300 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 border border-neutral-200 rounded-2xl bg-white">
          {searchQuery ? 'No matching orders found' : 'No orders found'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Order</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Items</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-neutral-900">
                        {order.orderNumber}
                      </p>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 mt-0.5">
                        COD
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-neutral-900 font-medium">{order.customerName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-neutral-700">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-neutral-900">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 px-2.5"
                        >
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </Button>
                          {statusActions(order)}
                          <Button
                            key="delete"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(order._id)}
                            className="h-8 px-2.5"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Order Number</p>
                  <p className="font-semibold text-lg">{selectedOrder.orderNumber}</p>
                </div>
                {statusBadge(selectedOrder.status)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-neutral-500">Name:</span>{' '}
                      {selectedOrder.customerName}
                    </p>
                    <p>
                      <span className="text-neutral-500">Email:</span>{' '}
                      {selectedOrder.customerEmail}
                    </p>
                    <p>
                      <span className="text-neutral-500">Phone:</span>{' '}
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    Shipping Address
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city},{' '}
                      {selectedOrder.shippingAddress?.state}{' '}
                      {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-neutral-200"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping || 0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Notes</h4>
                  <p className="text-sm text-neutral-600">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
                {statusActions(selectedOrder)}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="h-8 px-2.5"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
