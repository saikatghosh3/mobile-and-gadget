import { NextResponse } from 'next/server';
import Review from '../../../models/Review';
import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');
    const admin = searchParams.get('admin');

    const ReviewModel = await Review();

    let query = {};
    if (productId) {
      query.product = productId;
    }
    if (!admin) {
      query.status = 'approved';
    }

    const reviews = await ReviewModel.find(query)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const User = (await import('../../../models/User')).default;
    const UserModel = await User();
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const ReviewModel = await Review();

    const review = await ReviewModel.create({
      ...body,
      user: user._id,
      authorName: body.authorName || user.fullName || 'Anonymous',
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
