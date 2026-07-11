'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Tag,
  FolderOpen,
  Folder,
  Download,
  AlertCircle,
  MoveRight,
  X,
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// ─── empty form state ────────────────────────────────────────────
const emptyForm = () => ({
  name: '',
  description: '',
  image: '',
  icon: '',
  showOnHome: true,
  order: 0,
  parent: '__NONE__',   // '__NONE__' = main category, otherwise parent _id
});

// ─── mode constants ──────────────────────────────────────────────
// mode: 'add-main' | 'add-sub' | 'edit'
const NO_PARENT = '__NONE__';

export default function CategoriesPage() {
  const [treeData, setTreeData] = useState([]);      // main cats with .subcategories[]
  const [allFlat, setAllFlat]   = useState([]);      // flat list for parent selector
  const [loading, setLoading]   = useState(true);
  const [seeding, setSeeding]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState({});
  const { toast } = useToast();

  // form dialog
  const [dialogOpen, setDialogOpen]       = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData]           = useState(emptyForm());
  const [saving, setSaving]               = useState(false);

  // delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null, error: null, loading: false });

  // ── fetch ────────────────────────────────────────────────────────
  const fetchTree = useCallback(async () => {
    try {
      // fetch tree + flat list in parallel
      const [treeRes, flatRes] = await Promise.all([
        fetch('/api/categories?tree=true'),
        fetch('/api/categories'),
      ]);
      const treeJson = await treeRes.json();
      const flatJson = await flatRes.json();

      if (treeJson.success) {
        const data = treeJson.data || [];
        setTreeData(data);
        // auto-expand if ≤ 8 main categories
        if (data.length <= 8) {
          const exp = {};
          data.forEach((c) => { exp[c._id] = true; });
          setExpandedIds(exp);
        }
      }
      if (flatJson.success) {
        setAllFlat(flatJson.data || []);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchTree(); }, [fetchTree]);

  // auto-expand matches during search
  useEffect(() => {
    if (searchQuery.trim()) {
      const exp = {};
      treeData.forEach((main) => {
        const q = searchQuery.toLowerCase();
        const mainMatch = main.name.toLowerCase().includes(q);
        const matchSubs = (main.subcategories || []).some((s) =>
          s.name.toLowerCase().includes(q)
        );
        if (mainMatch || matchSubs) {
          exp[main._id] = true;
        }
      });
      setExpandedIds(exp);
    }
  }, [searchQuery, treeData]);

  // ── expand/collapse ──────────────────────────────────────────────
  const toggleExpand = (id) => setExpandedIds((p) => ({ ...p, [id]: !p[id] }));

  // ── open dialogs ─────────────────────────────────────────────────
  const openAddMain = () => {
    setEditingCategory(null);
    setFormData(emptyForm());
    setDialogOpen(true);
  };

  const openAddSub = (parentCat) => {
    setEditingCategory(null);
    setFormData({ ...emptyForm(), parent: parentCat._id });
    setDialogOpen(true);
  };

  // edit: can change parent here too
  const openEdit = (category) => {
    setEditingCategory(category);
    const parentVal = category.parent
      ? (typeof category.parent === 'object' ? category.parent._id : category.parent)
      : NO_PARENT;
    setFormData({
      name:        category.name,
      description: category.description || '',
      image:       category.image || '',
      icon:        category.icon || '',
      showOnHome:  category.showOnHome !== false,
      order:       category.order || 0,
      parent:      parentVal,
    });
    setDialogOpen(true);
  };

  // ── submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name:        formData.name.trim(),
      description: formData.description.trim(),
      image:       formData.image.trim(),
      icon:        formData.icon.trim(),
      showOnHome:  formData.showOnHome,
      order:       Number(formData.order) || 0,
      parent:      formData.parent === NO_PARENT ? null : formData.parent,
    };

    try {
      const isEdit = !!editingCategory;
      const url    = isEdit ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: isEdit ? 'Category Updated ✓' : 'Category Created ✓',
          description: `"${formData.name}" saved successfully.`,
        });
        setDialogOpen(false);
        fetchTree();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to save', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── delete ───────────────────────────────────────────────────────
  const initiateDelete = (category) =>
    setDeleteDialog({ open: true, category, error: null, loading: false });

  const confirmDelete = async () => {
    const { category } = deleteDialog;
    if (!category) return;
    setDeleteDialog((p) => ({ ...p, loading: true, error: null }));
    try {
      const res  = await fetch(`/api/categories/${category._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted ✓', description: `"${category.name}" has been deleted.` });
        setDeleteDialog({ open: false, category: null, error: null, loading: false });
        fetchTree();
      } else {
        setDeleteDialog((p) => ({ ...p, error: data.error, loading: false }));
      }
    } catch {
      setDeleteDialog((p) => ({ ...p, error: 'Failed to delete category', loading: false }));
    }
  };

  // ── seed ─────────────────────────────────────────────────────────
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res  = await fetch('/api/categories/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Seeded ✓', description: data.message });
        fetchTree();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to seed categories', variant: 'destructive' });
    } finally {
      setSeeding(false);
    }
  };

  // ── filter ───────────────────────────────────────────────────────
  const filtered = searchQuery.trim()
    ? treeData
        .map((main) => {
          const q = searchQuery.toLowerCase();
          const mainMatch = main.name.toLowerCase().includes(q);
          const matchSubs = (main.subcategories || []).filter((s) =>
            s.name.toLowerCase().includes(q)
          );
          if (mainMatch || matchSubs.length > 0)
            return { ...main, subcategories: mainMatch ? main.subcategories : matchSubs };
          return null;
        })
        .filter(Boolean)
    : treeData;

  // main cats only (for parent selector in form)
  const mainCatsOnly = allFlat.filter(
    (c) => !c.parent && (!editingCategory || c._id !== editingCategory._id)
  );

  const totalSub = treeData.reduce((a, c) => a + (c.subcategories?.length || 0), 0);

  // ── dialog title helper ──────────────────────────────────────────
  const dialogTitle = () => {
    if (editingCategory) return `✏️ Edit "${editingCategory.name}"`;
    if (formData.parent !== NO_PARENT) return '➕ New Subcategory';
    return '➕ New Main Category';
  };

  // ── parent name for badge ─────────────────────────────────────────
  const parentName = formData.parent !== NO_PARENT
    ? (treeData.find((c) => c._id === formData.parent)?.name || 'Main Category')
    : null;

  // ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Categories</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            <span className="font-medium text-neutral-700">{treeData.length}</span> main &middot;{' '}
            <span className="font-medium text-neutral-700">{totalSub}</span> subcategories
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleSeed}
            disabled={seeding}
            className="gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            {seeding ? 'Seeding...' : 'Seed 13 Defaults'}
          </Button>
          <Button onClick={openAddMain} className="bg-orange-500 hover:bg-orange-600 gap-2">
            <Plus className="w-4 h-4" />
            Add Main Category
          </Button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
        <MoveRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Tip:</strong> Edit any existing category and change its &quot;Parent Category&quot; to move it inside a main category as a subcategory.
        </span>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search categories and subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Tree ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-neutral-600">
            {searchQuery ? 'No match found' : 'No categories yet'}
          </p>
          {!searchQuery && (
            <p className="text-sm mt-1 text-neutral-400">
              Click <strong>&quot;Seed 13 Defaults&quot;</strong> to start quickly, or add manually.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((mainCat) => {
            const isExpanded = expandedIds[mainCat._id];
            const hasSubs    = (mainCat.subcategories?.length || 0) > 0;

            return (
              <div
                key={mainCat._id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:border-neutral-300 transition-colors"
              >
                {/* ── Main category row ── */}
                <div className="flex items-center gap-3 px-5 py-4 group">

                  {/* expand toggle */}
                  <button
                    onClick={() => hasSubs && toggleExpand(mainCat._id)}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      hasSubs
                        ? 'hover:bg-orange-100 text-neutral-500 hover:text-orange-600 cursor-pointer'
                        : 'text-neutral-200 cursor-default'
                    }`}
                    title={hasSubs ? (isExpanded ? 'Collapse' : 'Expand') : ''}
                  >
                    {hasSubs ? (
                      isExpanded
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-200 block" />
                    )}
                  </button>

                  {/* icon / image */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {mainCat.image
                      ? <img src={mainCat.image} alt={mainCat.name} className="w-full h-full object-cover" />
                      : mainCat.icon
                        ? <span className="text-xl leading-none">{mainCat.icon}</span>
                        : <Folder className="w-5 h-5 text-orange-400" />
                    }
                  </div>

                  {/* name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900 text-[15px]">{mainCat.name}</span>
                      {hasSubs && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                          {mainCat.subcategories.length} subcategories
                        </span>
                      )}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        mainCat.showOnHome !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {mainCat.showOnHome !== false ? '● Visible' : '○ Hidden'}
                      </span>
                    </div>
                    {mainCat.description && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{mainCat.description}</p>
                    )}
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openAddSub(mainCat)}
                      className="h-8 px-2.5 text-xs text-orange-600 hover:bg-orange-50 gap-1 font-medium"
                      title="Add subcategory"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Sub
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(mainCat)}
                      className="h-8 w-8 p-0 hover:bg-neutral-100"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 text-neutral-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => initiateDelete(mainCat)}
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* ── Subcategories ── */}
                {isExpanded && hasSubs && (
                  <div className="border-t border-neutral-100 divide-y divide-neutral-100 bg-neutral-50/40">
                    {mainCat.subcategories.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center gap-3 pl-16 pr-5 py-3 hover:bg-white transition-colors group"
                      >
                        {/* sub icon */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center overflow-hidden shadow-sm">
                          {sub.image
                            ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                            : sub.icon
                              ? <span className="text-sm leading-none">{sub.icon}</span>
                              : <Tag className="w-3.5 h-3.5 text-neutral-400" />
                          }
                        </div>

                        {/* sub info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-neutral-800">{sub.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              sub.showOnHome !== false
                                ? 'bg-green-100 text-green-600'
                                : 'bg-neutral-100 text-neutral-400'
                            }`}>
                              {sub.showOnHome !== false ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                          {sub.description && (
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{sub.description}</p>
                          )}
                        </div>

                        {/* sub actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(sub)}
                            className="h-7 w-7 p-0 hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3 text-neutral-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => initiateDelete(sub)}
                            className="h-7 w-7 p-0 hover:bg-red-50 text-red-300 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* add sub button */}
                    <button
                      onClick={() => openAddSub(mainCat)}
                      className="w-full flex items-center gap-2 pl-16 pr-5 py-2.5 text-xs text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add subcategory to &quot;{mainCat.name}&quot;
                    </button>
                  </div>
                )}

                {/* collapsed: show add-sub when no subs yet */}
                {!hasSubs && !isExpanded && (
                  <div className="border-t border-dashed border-neutral-100">
                    <button
                      onClick={() => openAddSub(mainCat)}
                      className="w-full flex items-center gap-2 pl-16 pr-5 py-2 text-xs text-neutral-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add subcategory
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Category Form Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!saving) setDialogOpen(o); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{dialogTitle()}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-1">

            {/* ── Parent selector (key feature) ── */}
            <div>
              <Label htmlFor="cat-parent" className="text-sm font-medium">
                Category Type / Parent
              </Label>
              <Select
                value={formData.parent}
                onValueChange={(v) => setFormData({ ...formData, parent: v })}
              >
                <SelectTrigger id="cat-parent" className="mt-1">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>
                    <span className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-orange-500" />
                      Main Category (top level)
                    </span>
                  </SelectItem>
                  {mainCatsOnly.map((mc) => (
                    <SelectItem key={mc._id} value={mc._id}>
                      <span className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        Subcategory of &quot;{mc.name}&quot;
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-neutral-400 mt-1">
                {formData.parent === NO_PARENT
                  ? 'This will appear as a top-level main category.'
                  : `This will be a subcategory inside "${parentName}".`}
              </p>
            </div>

            {/* ── Name ── */}
            <div>
              <Label htmlFor="cat-name" className="text-sm font-medium">Name *</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.parent === NO_PARENT ? 'e.g. Phones, Tablets...' : 'e.g. iPhone, Samsung...'}
                required
                className="mt-1"
                autoFocus
              />
            </div>

            {/* ── Icon + Order row ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cat-icon" className="text-sm font-medium">Icon (emoji)</Label>
                <Input
                  id="cat-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📱"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cat-order" className="text-sm font-medium">Display Order</Label>
                <Input
                  id="cat-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            {/* ── Description ── */}
            <div>
              <Label htmlFor="cat-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="cat-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Optional description..."
                className="mt-1 resize-none"
              />
            </div>

            {/* ── Image URL ── */}
            <div>
              <Label htmlFor="cat-image" className="text-sm font-medium">Image URL</Label>
              <Input
                id="cat-image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/category.jpg"
                className="mt-1"
              />
            </div>

            {/* ── Show on Home ── */}
            <div className="flex items-center gap-3 pt-1 pb-1">
              <Switch
                id="cat-showOnHome"
                checked={formData.showOnHome}
                onCheckedChange={(c) => setFormData({ ...formData, showOnHome: c })}
              />
              <Label htmlFor="cat-showOnHome" className="cursor-pointer text-sm">
                Show on Home Page
              </Label>
            </div>

            {/* ── Buttons ── */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(o) => {
          if (!deleteDialog.loading) setDeleteDialog({ open: o, category: null, error: null, loading: false });
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-neutral-600 text-sm">
              Are you sure you want to delete{' '}
              <strong>&quot;{deleteDialog.category?.name}&quot;</strong>?
              This action <strong>cannot be undone</strong>.
            </p>

            {deleteDialog.error && (
              <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{deleteDialog.error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, category: null, error: null, loading: false })}
                disabled={deleteDialog.loading}
                className="flex-1"
              >
                Cancel
              </Button>
              {!deleteDialog.error && (
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleteDialog.loading}
                  className="flex-1"
                >
                  {deleteDialog.loading ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
