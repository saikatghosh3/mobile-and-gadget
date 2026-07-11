import { NextResponse } from 'next/server';
import Coupon from '../../../../models/Coupon';
import Order from '../../../../models/Order';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, subtotal, userId } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ valid: false, error: 'Coupon code is required' });
    }

    const CouponModel = await Coupon();
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await CouponModel.findOne({ code: normalizedCode });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    // Check status
    if (coupon.status !== 'active') {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active' });
    }

    // Helper to get date parts in Bangladesh time (GMT+6)
    const getBstDateParts = (date) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const parts = formatter.formatToParts(date);
      const year = parseInt(parts.find(p => p.type === 'year').value, 10);
      const month = parseInt(parts.find(p => p.type === 'month').value, 10);
      const day = parseInt(parts.find(p => p.type === 'day').value, 10);
      return new Date(Date.UTC(year, month - 1, day));
    };

    const currentDateBst = getBstDateParts(new Date());

    // Check expiry date — represents the end of the day in Bangladesh time
    if (coupon.expiryDate) {
      const couponExpiryDate = getBstDateParts(coupon.expiryDate);
      if (couponExpiryDate < currentDateBst) {
        return NextResponse.json({ valid: false, error: 'This coupon has expired' });
      }
    }

    // Check start date — represents the beginning of the day in Bangladesh time
    if (coupon.startDate) {
      const couponStartDate = getBstDateParts(coupon.startDate);
      if (couponStartDate > currentDateBst) {
        return NextResponse.json({ valid: false, error: 'This coupon is not yet valid' });
      }
    }

    // Check minimum order amount
    const orderSubtotal = parseFloat(subtotal) || 0;
    if (coupon.minOrderAmount > 0 && orderSubtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of Tk ${coupon.minOrderAmount} is required`,
      });
    }

    // Check total usage limit
    if (coupon.totalUsageLimit > 0 && coupon.usageCount >= coupon.totalUsageLimit) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' });
    }

    // Check per-user usage limit
    if (userId && coupon.perUserUsageLimit > 0) {
      const userUsageCount = coupon.usedBy.filter(
        (u) => u.user && u.user.toString() === userId.toString()
      ).length;

      if (userUsageCount >= coupon.perUserUsageLimit) {
        return NextResponse.json({
          valid: false,
          error: `You have already used this coupon ${userUsageCount} time(s)`,
        });
      }
    }

    // Check customer eligibility
    if (userId && coupon.customerEligibility === 'new') {
      const OrderModel = await Order();
      const previousOrders = await OrderModel.countDocuments({ user: userId });
      if (previousOrders > 0) {
        return NextResponse.json({
          valid: false,
          error: 'This coupon is only for new customers',
        });
      }
    }

    if (userId && coupon.customerEligibility === 'vip') {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is only for VIP customers',
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountLimit > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountLimit);
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'free_shipping') {
      discountAmount = 0;
    }

    // Ensure discount does not exceed subtotal
    discountAmount = Math.min(discountAmount, orderSubtotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountLimit: coupon.maxDiscountLimit,
        minOrderAmount: coupon.minOrderAmount,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
