import { NextResponse } from 'next/server';
import User from '../../../../../models/User';
import { requireAuth } from '../../../../../lib/auth';

const getHandler = requireAuth(async (request, { params }) => {
  try {
    const UserModel = await User();
    const user = await UserModel.findById(request.user._id).select('addresses');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error('Get address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get address' }, { status: 500 });
  }
});

const putHandler = requireAuth(async (request, { params }) => {
  try {
    const updates = await request.json();
    const UserModel = await User();
    const user = await UserModel.findById(request.user._id);

    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    if (updates.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    Object.keys(updates).forEach((key) => {
      if (key !== '_id') address[key] = updates[key];
    });

    await user.save();
    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update address' }, { status: 500 });
  }
});

const deleteHandler = requireAuth(async (request, { params }) => {
  try {
    const UserModel = await User();
    const user = await UserModel.findById(request.user._id);
    const address = user.addresses.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }
    const wasDefault = address.isDefault;
    address.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete address' }, { status: 500 });
  }
});

export const GET = getHandler;
export const PUT = putHandler;
export const DELETE = deleteHandler;
