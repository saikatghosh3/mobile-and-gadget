import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '../../../../models/User';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();
    if (!email || !token || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, token, and new password are required' },
        { status: 400 }
      );
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const UserModel = await User();
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
