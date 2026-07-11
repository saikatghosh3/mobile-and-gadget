import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import { requireAdmin } from '../../../lib/auth';

// GET /api/categories - returns all categories (flat list with parent info)
// Use ?tree=true for nested tree structure
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get('tree');

    const CategoryModel = await Category();

    if (tree === 'true') {
      // Return nested tree: main categories with their subcategories
      const mainCategories = await CategoryModel
        .find({ parent: null })
        .sort({ order: 1, name: 1 })
        .lean();

      const subcategories = await CategoryModel
        .find({ parent: { $ne: null } })
        .sort({ order: 1, name: 1 })
        .lean();

      const tree = mainCategories.map((cat) => ({
        ...cat,
        subcategories: subcategories.filter(
          (sub) => sub.parent?.toString() === cat._id.toString()
        ),
      }));

      return NextResponse.json({ success: true, data: tree });
    }

    // Flat list with parent info populated
    const categories = await CategoryModel
      .find({})
      .populate('parent', 'name slug')
      .sort({ parent: 1, order: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - create main category or subcategory
async function postHandler(request) {
  try {
    const body = await request.json();
    const CategoryModel = await Category();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const parentId = body.parent || null;

    // Check uniqueness within same parent scope
    const existingCategory = await CategoryModel.findOne({ slug, parent: parentId });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists at this level' },
        { status: 400 }
      );
    }

    // If parent provided, verify it exists and is a main category
    if (parentId) {
      const parentCat = await CategoryModel.findById(parentId);
      if (!parentCat) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 404 }
        );
      }
      if (parentCat.parent !== null) {
        return NextResponse.json(
          { success: false, error: 'Cannot create subcategory of a subcategory (max 2 levels)' },
          { status: 400 }
        );
      }
    }

    const category = await CategoryModel.create({
      name: body.name,
      slug,
      description: body.description || '',
      image: body.image || '',
      icon: body.icon || '',
      parent: parentId,
      order: body.order || 0,
      showOnHome: body.showOnHome !== false,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
