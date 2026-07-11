import { NextResponse } from 'next/server';
import Return from '../../../../models/Return';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const ReturnModel = await Return();
    const returnRequest = await ReturnModel.findById(params.id)
      .populate('order', 'orderNumber');

    if (!returnRequest) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: returnRequest });
  } catch (error) {
    console.error('Error fetching return:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch return request' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const ReturnModel = await Return();

    const allowedFields = ['status', 'adminNotes', 'reason', 'details', 'images', 'items'];
    const updateData = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    updateData.updatedAt = Date.now();

    const returnRequest = await ReturnModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('order', 'orderNumber');

    if (!returnRequest) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: returnRequest });
  } catch (error) {
    console.error('Error updating return:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update return request' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const ReturnModel = await Return();
    const returnRequest = await ReturnModel.findByIdAndDelete(params.id);

    if (!returnRequest) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Return request deleted' });
  } catch (error) {
    console.error('Error deleting return:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete return request' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
