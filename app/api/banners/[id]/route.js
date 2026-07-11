import { NextResponse } from 'next/server';
import Banner from '../../../../models/Banner';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const BannerModel = await Banner();
    const banner = await BannerModel.findById(params.id).populate('product', 'name slug images price');

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const body = await request.json();
    const BannerModel = await Banner();

    if (body.position) {
      const existing = await BannerModel.findOne({ position: body.position, _id: { $ne: params.id } });
      if (existing) {
        await BannerModel.findByIdAndDelete(existing._id);
      }
    }

    const banner = await BannerModel.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const BannerModel = await Banner();
    const banner = await BannerModel.findByIdAndDelete(params.id);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
