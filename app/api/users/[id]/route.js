import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { requireAdmin } from '../../../../lib/auth';

async function getHandler(request, { params }) {
  try {
    const UserModel = await User();
    const user = await UserModel.findById(params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}

async function putHandler(request, { params }) {
  try {
    const { status, role, fullName, phone } = await request.json();
    const UserModel = await User();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    if (status !== undefined) user.status = status;
    if (role !== undefined) user.role = role;
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    const updatedUser = await UserModel.findById(params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export const GET = requireAdmin(getHandler);
export const PUT = requireAdmin(putHandler);
