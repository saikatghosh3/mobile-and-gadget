import { NextResponse } from 'next/server';
import Order from '../../../../models/Order';
import { requireAuth } from '../../../../lib/auth';

async function handler(request) {
  try {
    const OrderModel = await Order();
    const orders = await OrderModel.find({ user: request.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
