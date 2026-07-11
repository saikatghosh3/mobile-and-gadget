import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}

export async function GET(request) {
  return NextResponse.redirect(new URL('/', request.url));
}
