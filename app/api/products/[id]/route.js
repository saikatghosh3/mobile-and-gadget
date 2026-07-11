import { NextResponse } from 'next/server';
import Product from '../../../../models/Product';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const ProductModel = await Product();
    const product = await ProductModel.findById(params.id)
      .populate('category', 'name slug description image icon')
      .populate('subCategory', 'name slug description image icon');

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const ProductModel = await Product();

    const product = await ProductModel.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const ProductModel = await Product();
    const product = await ProductModel.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
