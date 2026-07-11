import { NextResponse } from 'next/server';
import Advertisement from '../../../../models/Advertisement';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const AdvertisementModel = await Advertisement();
    const ad = await AdvertisementModel.findById(params.id);

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch advertisement' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const AdvertisementModel = await Advertisement();

    const ad = await AdvertisementModel.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const AdvertisementModel = await Advertisement();
    const ad = await AdvertisementModel.findByIdAndDelete(params.id);

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
