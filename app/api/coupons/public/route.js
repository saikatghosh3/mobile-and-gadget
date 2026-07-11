import { NextResponse } from 'next/server';
import Coupon from '../../../../models/Coupon';

export async function GET() {
  try {
    const CouponModel = await Coupon();
    
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

    const coupons = await CouponModel.find({
      status: 'active',
      expiryDate: { $gte: currentDateBst },
      $or: [
        { startDate: null },
        { startDate: { $lte: currentDateBst } },
      ],
    })
      .select('code description discountType discountValue minOrderAmount maxDiscountLimit expiryDate')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching public coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
