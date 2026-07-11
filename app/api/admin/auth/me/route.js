import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    if (!token) {
      const cookie = request.cookies.get('admin_token');
      token = cookie?.value || null;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: decoded.userId,
        fullName: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin',
        status: 'active',
      },
    });
  } catch (error) {
    console.error('Admin me error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
