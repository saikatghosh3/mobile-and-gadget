'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
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
import { formatTk } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // tree format
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');  // filter by main category
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    category: '',      // main category id
    subCategory: '',   // subcategory id (optional)
    brand: '',
    stock: '',
    images: [],
    features: '',
    specifications: '',
    isFeatured: false,
    isTopSelling: false,
    isNewArrival: false,
  });

  // Subcategories for the selected main category
  const availableSubCategories = categories.find(
    (c) => c._id === formData.category
  )?.subcategories || [];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?tree=true');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discount = parseFloat(formData.discountPercentage) || 0;
    const price = parseFloat(formData.price);
    let originalPrice = parseFloat(formData.originalPrice) || 0;

    if (discount > 0 && originalPrice === 0) {
      originalPrice = Math.round(price / (1 - discount / 100) * 100) / 100;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price,
      originalPrice,
      category: formData.category,
      subCategory: formData.subCategory || null,
      brand: formData.brand,
      stock: parseInt(formData.stock),
      images: formData.images,
      features: formData.features.split('\n').filter((f) => f.trim()),
      specifications: formData.specifications
        .split('\n')
        .filter((s) => s.trim())
        .reduce((acc, item) => {
          const [key, value] = item.split(':').map((s) => s.trim());
          if (key && value) acc[key] = value;
          return acc;
        }, {}),
      isFeatured: formData.isFeatured,
      isTopSelling: formData.isTopSelling,
      isNewArrival: formData.isNewArrival,
    };

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingProduct ? 'Product updated' : 'Product created',
          description: 'Successfully saved the product.',
        });
        setDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save product',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const discountPercentage = product.originalPrice > 0
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || 0).toString(),
      discountPercentage: discountPercentage > 0 ? discountPercentage.toString() : '',
      category: product.category?._id || product.category || '',
      subCategory: product.subCategory?._id || product.subCategory || '',
      brand: product.brand,
      stock: product.stock.toString(),
      images: product.images || [],
      features: product.features?.join('\n') || '',
      specifications: Object.entries(product.specifications || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
      isFeatured: product.isFeatured || false,
      isTopSelling: product.isTopSelling || false,
      isNewArrival: product.isNewArrival || false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast({ title: 'Product deleted' });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discountPercentage: '',
      category: '',
      subCategory: '',
      brand: '',
      stock: '',
      images: [],
      features: '',
      specifications: '',
      isFeatured: false,
      isTopSelling: false,
      isNewArrival: false,
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      (product.category?.name || '').toLowerCase().includes(q) ||
      (product.subCategory?.name || '').toLowerCase().includes(q);
    const matchCategory = !categoryFilter || product.category?._id === categoryFilter;
    return matchSearch && matchCategory;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const formatPrice = (price) => formatTk(price);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-600 mt-1">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search + Category Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, brand, category..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
        <Select
          value={categoryFilter || '__ALL__'}
          onValueChange={(v) => { setCategoryFilter(v === '__ALL__' ? '' : v); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-full sm:w-52 border-neutral-300 rounded-xl text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table/List */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No products found' : 'No products yet. Add your first product!'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-16">Image</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Category & Brand</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-24">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 relative">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                            No img
                          </div>
                        )}
                        {product.isFeatured && (
                          <span className="absolute top-0.5 left-0.5 w-2 h-2 bg-orange-500 rounded-full" title="Featured" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{product.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.stock === 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-805">
                            Out of Stock
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                            Featured
                          </span>
                        )}
                        {product.isTopSelling && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Top Selling
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            New Arrival
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{product.brand}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {product.category?.name || 'Uncategorized'}
                        {product.subCategory?.name && (
                          <span className="text-neutral-400"> › <span className="text-orange-600 font-medium">{product.subCategory.name}</span></span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-900">{formatPrice(product.price)}</div>
                      {product.originalPrice > 0 && (
                        <div className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 5 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="h-8 px-2.5"
                        >
                          <Edit className="w-4 h-4 mr-1 text-neutral-600" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="text-sm text-neutral-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discountPercentage">
                  Discount (%){' '}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 20"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price (optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Main Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value, subCategory: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory">
                  Subcategory{' '}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </Label>
                <Select
                  value={formData.subCategory || 'none'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subCategory: value === 'none' ? '' : value })
                  }
                  disabled={availableSubCategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        availableSubCategories.length === 0
                          ? 'No subcategories'
                          : 'Select subcategory'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {availableSubCategories.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.icon ? `${sub.icon} ` : ''}{sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>


            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Product Images</Label>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) =>
                  setFormData({ ...formData, images })
                }
                maxImages={5}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Upload up to 5 images. First image will be used as the primary image.
              </p>
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="6.7 inch display
5000mAh battery"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="specifications">Specifications (key: value per line)</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                placeholder="RAM: 8GB
Storage: 256GB
Processor: Snapdragon 8 Gen 2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isTopSelling"
                  checked={formData.isTopSelling}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isTopSelling: checked })
                  }
                />
                <Label htmlFor="isTopSelling">Top Selling</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNewArrival: checked })
                  }
                />
                <Label htmlFor="isNewArrival">New Arrival</Label>
              </div>
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
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
