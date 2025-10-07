import {  NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // ⭐ AWAIT cookies() in Next.js 15+
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      // Blacklist refresh token in DB if needed
      // await db.blacklistedTokens.create({ data: { token: refreshToken } });
    }

    const response = NextResponse.json({
      message: 'Logged out successfully',
    });

    // Clear all auth cookies
    response.cookies.delete('jwtToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('username');
    response.cookies.delete('roles');

    console.log('✅ User logged out, cookies cleared');
    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
