import { NextResponse } from 'next/server';
import Coupon from '../../../models/Coupon';
import { requireAdmin } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const CouponModel = await Coupon();

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { code: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const all = searchParams.get('all') === 'true';
    const skip = (page - 1) * limit;

    let queryBuilder = CouponModel.find(query).sort({ createdAt: -1 });

    if (!all) {
      queryBuilder = queryBuilder.skip(skip).limit(limit);
    }

    const coupons = await queryBuilder;
    const total = await CouponModel.countDocuments(query);

    const activeCount = await CouponModel.countDocuments({ status: 'active' });
    const totalUsageAgg = await CouponModel.aggregate([
      { $group: { _id: null, totalUsage: { $sum: '$usageCount' }, totalDiscount: { $sum: '$totalDiscountGiven' }, totalRevenue: { $sum: '$totalRevenueGenerated' } } },
    ]);

    const stats = {
      total,
      active: activeCount,
      totalUsage: totalUsageAgg[0]?.totalUsage || 0,
      totalDiscount: totalUsageAgg[0]?.totalDiscount || 0,
      totalRevenue: totalUsageAgg[0]?.totalRevenue || 0,
    };

    return NextResponse.json({
      success: true,
      data: coupons,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();
    const CouponModel = await Coupon();

    const existing = await CouponModel.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A coupon with this code already exists' },
        { status: 400 }
      );
    }

    const coupon = await CouponModel.create({
      code: (body.code || '').trim().toUpperCase(),
      description: body.description || '',
      discountType: body.discountType,
      discountValue: body.discountValue || 0,
      minOrderAmount: body.minOrderAmount || 0,
      maxDiscountLimit: body.maxDiscountLimit || 0,
      startDate: body.startDate || null,
      expiryDate: body.expiryDate,
      totalUsageLimit: body.totalUsageLimit || 0,
      perUserUsageLimit: body.perUserUsageLimit ?? 1,
      customerEligibility: body.customerEligibility || 'all',
      status: body.status || 'active',
    });

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
