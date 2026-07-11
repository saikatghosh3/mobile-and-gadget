'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

const POSITION_LABELS = {
  'above-featured': 'Above Featured Products',
  'above-top-selling': 'Above Top Selling',
  'above-new-arrivals': 'Above New Arrivals',
};

const POSITION_ORDER = ['above-featured', 'above-top-selling', 'above-new-arrivals'];

function ProductSearch({ selectedProduct, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/products?limit=50&admin=true')
      .then((r) => r.json())
      .then((data) => setProducts(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Label>Linked Product (optional)</Label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full mt-1 flex items-center justify-between px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white hover:border-neutral-400 transition-colors"
      >
        {selectedProduct ? (
          <div className="flex items-center gap-2">
            {selectedProduct.images?.[0] && (
              <img src={selectedProduct.images[0]} alt="" className="w-6 h-6 rounded object-cover" />
            )}
            <span className="text-neutral-900">{selectedProduct.name}</span>
            <span className="text-xs text-neutral-400">({selectedProduct.brand})</span>
          </div>
        ) : (
          <span className="text-neutral-400">Select a product...</span>
        )}
        <ChevronDown className="w-4 h-4 text-neutral-400" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-72 overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-56">
            {loading ? (
              <div className="p-4 text-center text-sm text-neutral-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-400">No products found</div>
            ) : (
              filtered.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => {
                    onSelect(product);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-orange-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-neutral-100 rounded border border-neutral-200 overflow-hidden shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 truncate">{product.name}</div>
                    <div className="text-xs text-neutral-500">{product.brand} - ৳{product.price}</div>
                  </div>
                  {selectedProduct?._id === product._id && (
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    product: null,
    position: '',
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast({ title: 'Error', description: 'Please upload an image', variant: 'destructive' });
      return;
    }
    if (!formData.position) {
      toast({ title: 'Error', description: 'Please select a position', variant: 'destructive' });
      return;
    }

    const bannerData = {
      title: formData.title,
      image: formData.image,
      product: formData.product?._id || null,
      position: formData.position,
      isActive: formData.isActive,
    };

    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingBanner ? 'Banner updated' : 'Banner created',
          description: 'Successfully saved.',
        });
        setDialogOpen(false);
        resetForm();
        fetchBanners();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      product: banner.product || null,
      position: banner.position,
      isActive: banner.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Banner deleted' });
        fetchBanners();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const res = await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: banner.isActive ? 'Deactivated' : 'Activated' });
        fetchBanners();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      product: null,
      position: '',
      isActive: true,
    });
    setEditingBanner(null);
  };

  const currentImageList = formData.image ? [formData.image] : [];

  const sortedBanners = [...banners].sort(
    (a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position)
  );

  const filteredBanners = sortedBanners.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.product?.name || '').toLowerCase().includes(q) ||
      POSITION_LABELS[b.position]?.toLowerCase().includes(q)
    );
  });

  const positionBadge = (pos) => {
    const colors = {
      'above-featured': 'bg-blue-100 text-blue-700 border-blue-200',
      'above-top-selling': 'bg-green-100 text-green-700 border-green-200',
      'above-new-arrivals': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return (
      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${colors[pos] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
        {POSITION_LABELS[pos] || pos}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Homepage Banners</h1>
          <p className="text-neutral-600 mt-1">Manage banners at 3 positions on the homepage</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search banners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading banners...</div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No banners found.' : 'No banners yet. Add your first banner!'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Image</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-48">Position</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Linked Product</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredBanners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 bg-neutral-100 rounded-lg border border-neutral-200 overflow-hidden flex items-center justify-center">
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-neutral-400">No img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{banner.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {positionBadge(banner.position)}
                    </td>
                    <td className="px-6 py-4">
                      {banner.product ? (
                        <div className="flex items-center gap-2">
                          {banner.product.images?.[0] && (
                            <img src={banner.product.images[0]} alt="" className="w-7 h-7 rounded border border-neutral-200 object-cover" />
                          )}
                          <span className="text-sm font-medium text-neutral-900 line-clamp-1">{banner.product.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">No product linked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Switch checked={banner.isActive} onCheckedChange={() => handleToggleActive(banner)} />
                        <span className={`text-xs font-medium ${banner.isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(banner)} className="h-8 px-2.5">
                          <Edit className="w-4 h-4 mr-1 text-neutral-600" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(banner._id)} className="h-8 px-2.5">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div>
              <Label className="mb-2 block">Banner Image *</Label>
              <ImageUpload images={currentImageList} onImagesChange={(images) => setFormData({ ...formData, image: images[0] || '' })} maxImages={1} />
              {!formData.image && <p className="text-xs text-red-500 mt-2">Image is required</p>}
            </div>

            <ProductSearch selectedProduct={formData.product} onSelect={(product) => setFormData({ ...formData, product })} />

            <div>
              <Label>Homepage Position *</Label>
              <Select value={formData.position} onValueChange={(val) => setFormData({ ...formData, position: val })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_ORDER.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {POSITION_LABELS[pos]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 mt-1">
                {formData.position && banners.some((b) => b.position === formData.position && b._id !== editingBanner?._id)
                  ? 'This position already has a banner. The old one will be replaced.'
                  : 'Each position can have only one banner.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
