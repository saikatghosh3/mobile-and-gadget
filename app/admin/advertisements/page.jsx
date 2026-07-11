'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
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
import ImageUpload from '@/components/ImageUpload';

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    placement: 'hero',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const res = await fetch('/api/advertisements');
      const data = await res.json();
      setAdvertisements(data.data || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast({
        title: 'Error',
        description: 'Please upload an image for the advertisement',
        variant: 'destructive',
      });
      return;
    }

    const adData = {
      ...formData,
      startDate: new Date(`${formData.startDate}T00:00:00`),
      endDate: new Date(`${formData.endDate}T23:59:59.999`),
    };

    try {
      const url = editingAd ? `/api/advertisements/${editingAd._id}` : '/api/advertisements';
      const method = editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingAd ? 'Advertisement updated' : 'Advertisement created',
          description: 'Successfully saved the advertisement.',
        });
        setDialogOpen(false);
        resetForm();
        fetchAdvertisements();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save advertisement',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving advertisement:', error);
      toast({
        title: 'Error',
        description: 'Failed to save advertisement',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      image: ad.image,
      link: ad.link || '',
      placement: ad.placement,
      isActive: ad.isActive,
      startDate: new Date(ad.startDate).toISOString().split('T')[0],
      endDate: new Date(ad.endDate).toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const res = await fetch(`/api/advertisements/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast({ title: 'Advertisement deleted' });
        fetchAdvertisements();
      }
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete advertisement',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      const res = await fetch(`/api/advertisements/${ad._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: ad.isActive ? 'Advertisement deactivated' : 'Advertisement activated',
        });
        fetchAdvertisements();
      }
    } catch (error) {
      console.error('Error toggling advertisement:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      placement: 'hero',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    setEditingAd(null);
  };

  const currentImageList = formData.image ? [formData.image] : [];

  const placementBadge = (placement) => {
    const styles = {
      hero: 'bg-blue-100 text-blue-700 border-blue-200',
      sidebar: 'bg-green-100 text-green-700 border-green-200',
      banner: 'bg-purple-100 text-purple-700 border-purple-200',
      popup: 'bg-orange-100 text-orange-700 border-orange-200',
      'product-section': 'bg-pink-100 text-pink-700 border-pink-200',
      'product-details': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    const labels = {
      hero: 'Hero Banner',
      sidebar: 'Sidebar',
      banner: 'Banner',
      popup: 'Popup',
      'product-section': 'Product Section',
      'product-details': 'Product Details',
    };

    return (
      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${styles[placement] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
        {labels[placement] || placement}
      </span>
    );
  };

  const filteredAds = advertisements.filter((ad) => {
    const title = ad.title || '';
    const desc = ad.description || '';
    const placement = ad.placement || '';
    const search = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(search) ||
      desc.toLowerCase().includes(search) ||
      placement.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Advertisements</h1>
          <p className="text-neutral-600 mt-1">Manage promotional content</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Advertisement
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search advertisements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Advertisements Table */}
      {loading ? (
        <div className="text-center py-12">Loading advertisements...</div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No advertisements found' : 'No advertisements yet. Add your first advertisement!'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Image</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32">Placement</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-48">Duration</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredAds.map((ad) => (
                  <tr key={ad._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-10 bg-neutral-100 rounded border border-neutral-200 overflow-hidden relative flex items-center justify-center">
                        {ad.image ? (
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{ad.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1 max-w-sm">{ad.description}</div>
                      {ad.link && (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-orange-500 hover:underline mt-1 block truncate max-w-xs"
                        >
                          {ad.link}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {placementBadge(ad.placement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={ad.isActive}
                          onCheckedChange={() => handleToggleActive(ad)}
                        />
                        <span className={`text-xs font-medium ${ad.isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-neutral-700">
                        <span className="font-medium text-neutral-500">From:</span> {new Date(ad.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-700 mt-0.5">
                        <span className="font-medium text-neutral-500">To:</span> {new Date(ad.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                          className="h-8 px-2.5"
                        >
                          <Edit className="w-4 h-4 mr-1 text-neutral-600" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(ad._id)}
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
        </div>
      )}

      {/* Advertisement Form Dialog */}
      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="image" className="mb-2 block">Advertisement Image *</Label>
              <ImageUpload
                images={currentImageList}
                onImagesChange={(images) => setFormData({ ...formData, image: images[0] || '' })}
                maxImages={1}
              />
              {!formData.image && (
                <p className="text-xs text-red-500 mt-2">Image is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="link">Link URL (optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/product"
              />
            </div>

            <div>
              <Label htmlFor="placement">Placement</Label>
              <Select
                value={formData.placement}
                onValueChange={(value) =>
                  setFormData({ ...formData, placement: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Banner</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                     setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
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
                {editingAd ? 'Update Advertisement' : 'Add Advertisement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog> */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="image" className="mb-2 block">Advertisement Image *</Label>
        <ImageUpload
          images={currentImageList}
          onImagesChange={(images) => setFormData({ ...formData, image: images[0] || '' })}
          maxImages={1}
        />
        {!formData.image && (
          <p className="text-xs text-red-500 mt-2">Image is required</p>
        )}
      </div>

      <div>
        <Label htmlFor="link">Link URL (optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://example.com/product"
        />
      </div>

      <div>
        <Label htmlFor="placement">Placement</Label>
        <Select
          value={formData.placement}
          onValueChange={(value) =>
            setFormData({ ...formData, placement: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hero">Hero Banner</SelectItem>
            <SelectItem value="sidebar">Sidebar</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="popup">Popup</SelectItem>
            <SelectItem value="product-section">Product Section</SelectItem>
            <SelectItem value="product-details">Product Details</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
               setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <Label htmlFor="isActive">Active</Label>
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
          {editingAd ? 'Update Advertisement' : 'Add Advertisement'}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
    </div>
  );
}
