import { NextResponse } from 'next/server';
import Advertisement from '../../../models/Advertisement';
import { requireAdmin } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const active = searchParams.get('active');

    const AdvertisementModel = await Advertisement();

    let query = {};
    if (placement) {
      query.placement = placement;
    }
    if (active === 'true') {
      query.isActive = true;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.startDate = { $lte: today };
      query.endDate = { $gte: today };
    }

    const ads = await AdvertisementModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();
    const AdvertisementModel = await Advertisement();

    const ad = await AdvertisementModel.create(body);

    return NextResponse.json({ success: true, data: ad }, { status: 201 });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
