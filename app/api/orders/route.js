import { NextResponse } from 'next/server';
import Order from '../../../models/Order';
import Coupon from '../../../models/Coupon';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const OrderModel = await Order();

    let query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.user = userId;
    }

    const all = searchParams.get('all') === 'true' || searchParams.get('admin') === 'true';
    const skip = (page - 1) * limit;

    let queryBuilder = OrderModel.find(query)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    if (!all) {
      queryBuilder = queryBuilder.skip(skip).limit(limit);
    }

    const orders = await queryBuilder;

    const total = await OrderModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const OrderModel = await Order();

    const count = await OrderModel.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${count + 1}`;

    const orderData = {
      ...body,
      orderNumber,
      paymentMethod: 'cod',
      couponCode: body.couponCode || '',
      couponDiscount: body.couponDiscount || 0,
    };

    const order = await OrderModel.create(orderData);

    // Update coupon analytics if a coupon was used
    if (body.couponCode) {
      try {
        const CouponModel = await Coupon();
        const coupon = await CouponModel.findOne({ code: (body.couponCode || '').trim().toUpperCase() });
        if (coupon) {
          await CouponModel.findByIdAndUpdate(coupon._id, {
            $inc: {
              usageCount: 1,
              totalDiscountGiven: body.couponDiscount,
              totalRevenueGenerated: order.total,
            },
            $push: {
              usedBy: {
                user: body.user || null,
                orderId: order._id,
                discountAmount: body.couponDiscount,
                orderTotal: order.total,
                usedAt: new Date(),
              },
            },
          });
        }
      } catch (couponError) {
        console.error('Error updating coupon analytics:', couponError);
      }
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
