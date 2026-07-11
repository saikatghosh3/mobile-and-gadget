import { NextResponse } from 'next/server';
import Return from '../../../models/Return';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    const ReturnModel = await Return();
    let query = {};

    if (status) query.status = status;
    if (userId) query.user = userId;
    if (orderId) query.order = orderId;

    const returns = await ReturnModel.find(query)
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: returns });
  } catch (error) {
    console.error('Error fetching returns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch returns' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const ReturnModel = await Return();

    const returnRequest = await ReturnModel.create(body);
    const populated = await ReturnModel.findById(returnRequest._id)
      .populate('order', 'orderNumber');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error('Error creating return:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create return request' },
      { status: 500 }
    );
  }
}
