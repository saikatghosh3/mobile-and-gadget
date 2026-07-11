import { NextResponse } from 'next/server';
import Coupon from '../../../../models/Coupon';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const CouponModel = await Coupon();
    const coupon = await CouponModel.findById(params.id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const CouponModel = await Coupon();

    const updateData = { ...body, updatedAt: Date.now() };

    if (body.code) {
      const existing = await CouponModel.findOne({
        code: body.code.toUpperCase(),
        _id: { $ne: params.id },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'A coupon with this code already exists' },
          { status: 400 }
        );
      }
      updateData.code = body.code.trim().toUpperCase();
    }

    const coupon = await CouponModel.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const CouponModel = await Coupon();
    const coupon = await CouponModel.findByIdAndDelete(params.id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
