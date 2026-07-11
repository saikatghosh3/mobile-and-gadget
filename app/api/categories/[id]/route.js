import { NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import Product from '../../../../models/Product';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const CategoryModel = await Category();
    const category = await CategoryModel.findById(params.id).populate('parent', 'name slug');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const CategoryModel = await Category();

    let updateData = { ...body, updatedAt: Date.now() };

    // Regenerate slug if name changed
    if (body.name) {
      updateData.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Remove _id from update payload (safety)
    delete updateData._id;

    // If parent is being changed, validate the new parent
    if ('parent' in body) {
      if (body.parent) {
        // Can't set self as parent
        if (body.parent === params.id) {
          return NextResponse.json(
            { success: false, error: 'A category cannot be its own parent.' },
            { status: 400 }
          );
        }
        // Parent must exist and must be a main category (no nesting beyond 2 levels)
        const parentCat = await CategoryModel.findById(body.parent);
        if (!parentCat) {
          return NextResponse.json(
            { success: false, error: 'Parent category not found.' },
            { status: 404 }
          );
        }
        if (parentCat.parent) {
          return NextResponse.json(
            { success: false, error: 'Cannot nest subcategory inside another subcategory (max 2 levels).' },
            { status: 400 }
          );
        }
      }
      updateData.parent = body.parent || null;
    }

    const category = await CategoryModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const CategoryModel = await Category();

    // Check if this category has subcategories
    const childCount = await CategoryModel.countDocuments({ parent: params.id });
    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete: this category has ${childCount} subcategory(ies). Please delete subcategories first.`,
        },
        { status: 400 }
      );
    }

    // Check if any products are assigned to this category (main or sub)
    const ProductModel = await Product();
    const productCount = await ProductModel.countDocuments({
      $or: [{ category: params.id }, { subCategory: params.id }],
    });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete: ${productCount} product(s) are using this category. Please reassign products first.`,
        },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findByIdAndDelete(params.id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
