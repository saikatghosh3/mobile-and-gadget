import { NextResponse } from 'next/server';
import Order from '../../../../../../models/Order';
import { requireAuth } from '../../../../../../lib/auth';

async function handler(request, { params }) {
  try {
    const { id: orderId, itemId } = params;
    const OrderModel = await Order();
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.user?.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const itemIndex = order.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in order' },
        { status: 404 }
      );
    }

    order.items.splice(itemIndex, 1);

    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.subtotal = subtotal;
    order.total = subtotal + order.shipping - order.couponDiscount;
    order.updatedAt = Date.now();

    await order.save();

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error removing order item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item' },
      { status: 500 }
    );
  }
}

export const DELETE = requireAuth(handler);
