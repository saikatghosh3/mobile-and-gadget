import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { requireAuth } from '../../../../lib/auth';

async function getHandler(request) {
  try {
    const UserModel = await User();
    const user = await UserModel.findById(request.user._id).select('addresses');
    return NextResponse.json({ success: true, data: user?.addresses || [] });
  } catch (error) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get addresses' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const address = await request.json();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.zipCode) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, street, city, and zip code are required' },
        { status: 400 }
      );
    }

    const UserModel = await User();
    const user = await UserModel.findById(request.user._id);

    if (address.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    const savedAddress = user.addresses[user.addresses.length - 1];
    return NextResponse.json({ success: true, data: savedAddress }, { status: 201 });
  } catch (error) {
    console.error('Add address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
