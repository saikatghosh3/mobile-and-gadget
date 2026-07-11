import { NextResponse } from 'next/server';
import Banner from '../../../models/Banner';
import { requireAdmin } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const active = searchParams.get('active');

    const BannerModel = await Banner();

    let query = {};
    if (position) {
      query.position = position;
    }
    if (active === 'true') {
      query.isActive = true;
    }

    const banners = await BannerModel.find(query)
      .populate('product', 'name slug images price')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();
    const BannerModel = await Banner();

    const existing = await BannerModel.findOne({ position: body.position });
    if (existing) {
      await BannerModel.findByIdAndDelete(existing._id);
    }

    const banner = await BannerModel.create(body);

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
