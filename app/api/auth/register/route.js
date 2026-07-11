import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { hashPassword, signToken } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rateLimiter';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please try again after 1 hour.',
});

export async function POST(request) {
  const rateLimitResponse = await limiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { fullName, email, phone, password, profilePicture } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    const UserModel = await User();
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      password: hashedPassword,
      profilePicture: profilePicture || '',
      registrationDate: new Date(),
    });

    const token = signToken(user._id.toString(), user.role);

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture || '',
    };

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: userData,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
