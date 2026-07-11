import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { requireAuth } from '../../../../lib/auth';

async function handler(request) {
  try {
    const { fullName, email, phone, profilePicture } = await request.json();

    const UserModel = await User();
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) {
      const existing = await UserModel.findOne({ email: email.toLowerCase(), _id: { $ne: request.user._id } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email is already in use' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await UserModel.findByIdAndUpdate(
      request.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handler);
