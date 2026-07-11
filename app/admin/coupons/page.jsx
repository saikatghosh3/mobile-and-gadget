'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatTk } from '@/lib/utils';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-neutral-100 text-neutral-600',
  expired: 'bg-red-100 text-red-800',
  disabled: 'bg-amber-100 text-amber-800',
};

const discountTypeLabels = {
  percentage: 'Percentage (%)',
  fixed: 'Fixed Amount',
  free_shipping: 'Free Shipping',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalUsage: 0, totalDiscount: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscountLimit: '0',
    startDate: '',
    expiryDate: '',
    totalUsageLimit: '0',
    perUserUsageLimit: '1',
    customerEligibility: 'all',
    status: 'active',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const params = new URLSearchParams({ all: 'true' });
      if (statusFilter) params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/coupons?${params}`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
        setStats(data.stats || { total: 0, active: 0, totalUsage: 0, totalDiscount: 0, totalRevenue: 0 });
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [statusFilter, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue) || 0,
      minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
      maxDiscountLimit: parseFloat(formData.maxDiscountLimit) || 0,
      startDate: formData.startDate || null,
      expiryDate: formData.expiryDate,
      totalUsageLimit: parseInt(formData.totalUsageLimit) || 0,
      perUserUsageLimit: parseInt(formData.perUserUsageLimit) || 1,
      customerEligibility: formData.customerEligibility,
      status: formData.status,
    };

    if (!payload.code.trim()) {
      toast({ title: 'Error', description: 'Coupon code is required', variant: 'destructive' });
      return;
    }
    if (!payload.expiryDate) {
      toast({ title: 'Error', description: 'Expiry date is required', variant: 'destructive' });
      return;
    }
    if (payload.discountType !== 'free_shipping' && (!payload.discountValue || payload.discountValue <= 0)) {
      toast({ title: 'Error', description: 'Discount value is required', variant: 'destructive' });
      return;
    }

    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingCoupon ? 'Coupon updated' : 'Coupon created',
          description: `Coupon ${formData.code} has been saved.`,
        });
        setDialogOpen(false);
        resetForm();
        fetchCoupons();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to save coupon', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({ title: 'Error', description: 'Failed to save coupon', variant: 'destructive' });
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue ? coupon.discountValue.toString() : '',
      minOrderAmount: (coupon.minOrderAmount || 0).toString(),
      maxDiscountLimit: (coupon.maxDiscountLimit || 0).toString(),
      startDate: formatDate(coupon.startDate),
      expiryDate: formatDate(coupon.expiryDate),
      totalUsageLimit: (coupon.totalUsageLimit || 0).toString(),
      perUserUsageLimit: (coupon.perUserUsageLimit || 1).toString(),
      customerEligibility: coupon.customerEligibility || 'all',
      status: coupon.status || 'active',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast({ title: 'Coupon deleted' });
        fetchCoupons();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({ title: 'Error', description: 'Failed to delete coupon', variant: 'destructive' });
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({ title: 'Copied!', description: `Coupon code "${code}" copied to clipboard.` });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast({ title: 'Error', description: 'Failed to copy code', variant: 'destructive' });
    }
  };

  const handleGenerateCode = () => {
    const prefix = 'SAVE';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, code: `${prefix}${random}` });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscountLimit: '0',
      startDate: '',
      expiryDate: '',
      totalUsageLimit: '0',
      perUserUsageLimit: '1',
      customerEligibility: 'all',
      status: 'active',
    });
    setEditingCoupon(null);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoupons = coupons.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Coupons</h1>
          <p className="text-neutral-600 mt-1">Manage promotional coupons and discounts</p>
        </div>
        <Button
          onClick={() => { resetForm(); setDialogOpen(true); }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Total Coupons</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Total Usage</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalUsage}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Discount Given</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{formatTk(stats.totalDiscount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Revenue Generated</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{formatTk(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
        <Select
          value={statusFilter || '__ALL__'}
          onValueChange={(v) => { setStatusFilter(v === '__ALL__' ? '' : v); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-full sm:w-44 border-neutral-300 rounded-xl text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="text-center py-12">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No coupons found' : 'No coupons yet. Create your first coupon!'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Code</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Discount</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Usage</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Eligibility</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Expiry</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {currentCoupons.map((coupon) => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  const displayStatus = isExpired && coupon.status === 'active' ? 'expired' : coupon.status;

                  return (
                    <tr key={coupon._id} className="hover:bg-neutral-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{coupon.code}</span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{coupon.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.discountType === 'percentage' && (
                          <span className="font-semibold text-neutral-900">{coupon.discountValue}% OFF</span>
                        )}
                        {coupon.discountType === 'fixed' && (
                          <span className="font-semibold text-neutral-900">{formatTk(coupon.discountValue)} OFF</span>
                        )}
                        {coupon.discountType === 'free_shipping' && (
                          <span className="font-semibold text-neutral-900">Free Shipping</span>
                        )}
                        {coupon.maxDiscountLimit > 0 && (
                          <p className="text-xs text-neutral-500">Max {formatTk(coupon.maxDiscountLimit)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[displayStatus] || statusColors.inactive}`}>
                          {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {coupon.usageCount}
                          {coupon.totalUsageLimit > 0 && (
                            <span className="text-neutral-400"> / {coupon.totalUsageLimit}</span>
                          )}
                        </div>
                        {coupon.perUserUsageLimit > 0 && (
                          <p className="text-xs text-neutral-500">{coupon.perUserUsageLimit}x per user</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {coupon.customerEligibility === 'all' ? 'All Users' :
                         coupon.customerEligibility === 'new' ? 'New Users' : 'VIP Users'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)} className="h-8 px-2.5">
                            <Edit className="w-4 h-4 mr-1 text-neutral-600" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(coupon._id)} className="h-8 px-2.5">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="text-sm text-neutral-600">
                Showing {startIndex + 1} to {Math.min(endIndex, coupons.length)} of {coupons.length} coupons
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3">Previous</Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600' : ''}`}>{page}</Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3">Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coupon Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Coupon Code */}
            <div>
              <Label htmlFor="code">Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.trim().toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  required
                  className={editingCoupon ? 'opacity-60' : ''}
                  readOnly={!!editingCoupon}
                />
                {!editingCoupon && (
                  <Button type="button" variant="outline" onClick={handleGenerateCode} className="shrink-0">
                    Generate
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description <span className="text-neutral-400 font-normal">(optional)</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 20% off for Eid festival sale"
                rows={2}
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(v) => setFormData({ ...formData, discountType: v, discountValue: v === 'free_shipping' ? '0' : formData.discountValue })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue">
                  {formData.discountType === 'free_shipping' ? 'Value' : 'Discount Value *'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                  disabled={formData.discountType === 'free_shipping'}
                />
              </div>
            </div>

            {/* Min Order & Max Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                />
              </div>
              {formData.discountType === 'percentage' && (
                <div>
                  <Label htmlFor="maxDiscountLimit">Max Discount Limit <span className="text-neutral-400 font-normal">(0 = no limit)</span></Label>
                  <Input
                    id="maxDiscountLimit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maxDiscountLimit}
                    onChange={(e) => setFormData({ ...formData, maxDiscountLimit: e.target.value })}
                  />
                </div>
              )}
              {formData.discountType !== 'percentage' && (
                <div />
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date <span className="text-neutral-400 font-normal">(optional)</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalUsageLimit">Total Usage Limit <span className="text-neutral-400 font-normal">(0 = unlimited)</span></Label>
                <Input
                  id="totalUsageLimit"
                  type="number"
                  min="0"
                  value={formData.totalUsageLimit}
                  onChange={(e) => setFormData({ ...formData, totalUsageLimit: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="perUserUsageLimit">Per User Usage Limit</Label>
                <Input
                  id="perUserUsageLimit"
                  type="number"
                  min="1"
                  value={formData.perUserUsageLimit}
                  onChange={(e) => setFormData({ ...formData, perUserUsageLimit: e.target.value })}
                />
              </div>
            </div>

            {/* Customer Eligibility */}
            <div>
              <Label htmlFor="customerEligibility">Customer Eligibility</Label>
              <Select
                value={formData.customerEligibility}
                onValueChange={(v) => setFormData({ ...formData, customerEligibility: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select eligibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Customers Only</SelectItem>
                  <SelectItem value="vip">VIP Customers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Coupon Usage Details Dialog could be added here for analytics drill-down */}
    </div>
  );
}
