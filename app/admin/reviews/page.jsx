'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Star, Check, Search, X, Eye } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const statusBadge = (status) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    product: '',
    authorName: '',
    rating: 5,
    title: '',
    content: '',
    status: 'pending',
    isVerified: false,
  });

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?admin=true');
      const data = await res.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      ...formData,
      rating: parseInt(formData.rating),
    };

    try {
      const url = editingReview
        ? `/api/reviews/${editingReview._id}`
        : '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingReview ? 'Review updated' : 'Review created',
          description: 'Successfully saved the review.',
        });
        setDialogOpen(false);
        resetForm();
        fetchReviews();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save review',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Review ${newStatus}` });
        fetchReviews();
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      product: review.product?._id || review.product || '',
      authorName: review.authorName,
      rating: review.rating,
      title: review.title,
      content: review.content,
      status: review.status || 'pending',
      isVerified: review.isVerified,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast({ title: 'Review deleted' });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      product: '',
      authorName: '',
      rating: 5,
      title: '',
      content: '',
      status: 'pending',
      isVerified: false,
    });
    setEditingReview(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'
              }`}
            />
          ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    if (statusFilter !== 'all' && review.status !== statusFilter) return false;
    const productTitle = review.product?.name || '';
    const author = review.authorName || '';
    const title = review.title || '';
    const content = review.content || '';
    const search = searchQuery.toLowerCase();
    return (
      productTitle.toLowerCase().includes(search) ||
      author.toLowerCase().includes(search) ||
      title.toLowerCase().includes(search) ||
      content.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Reviews</h1>
          <p className="text-neutral-600 mt-1">Manage product reviews &amp; approval</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({reviews.filter((r) => tab.key === 'all' || r.status === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No reviews found' : 'No reviews yet. Add your first review!'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32">Author</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-20">Rating</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-44">Review</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 line-clamp-2 max-w-[180px]">
                        {review.product?.name || 'Unknown Product'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{review.authorName}</div>
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-150">
                          <Check className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 text-sm line-clamp-1">{review.title}</div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 max-w-xs leading-relaxed">
                        {review.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(review.status || 'pending')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1.5">
                        {(review.status === 'pending' || review.status === 'rejected') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review._id, 'approved')}
                            className="h-8 px-2 text-green-700 border-green-300 hover:bg-green-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {(review.status === 'pending' || review.status === 'approved') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review._id, 'rejected')}
                            className="h-8 px-2 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(review)}
                          className="h-8 px-2.5"
                        >
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(review._id)}
                          className="h-8 px-2.5"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Review Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.product}
                onValueChange={(value) =>
                  setFormData({ ...formData, product: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isVerified"
                checked={formData.isVerified}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isVerified: checked })
                }
              />
              <Label htmlFor="isVerified">Verified Review</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                {editingReview ? 'Update Review' : 'Add Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}