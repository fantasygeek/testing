import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Clear all auth cookies
  response.cookies.delete('jwtToken');
  response.cookies.delete('username');
  response.cookies.delete('roles');

  return response;
}