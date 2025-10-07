import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET ?? JWT_SECRET;

interface DecodedToken extends JwtPayload {
  username: string;
  roles: string[];
}

export async function POST() {
  try {
    const cookieStore = await cookies(); // ✅ Required in App Router route handlers

    const refreshToken =
      cookieStore.get('refreshToken')?.value ??
      cookieStore.get('jwtToken')?.value;

    console.log(
      '🔄 Attempting token refresh:',
      refreshToken ? 'Token found' : 'No token'
    );

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 401 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET) as DecodedToken;
    } catch (err) {
      console.error('❌ Invalid refresh token:', err);
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    console.log('✅ Refresh token valid for user:', decoded.username);

    const newAccessToken = jwt.sign(
      {
        username: decoded.username,
        roles: decoded.roles,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      {
        username: decoded.username,
        roles: decoded.roles,
      },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      user: {
        username: decoded.username,
        roles: decoded.roles,
      },
    });

    response.cookies.set('jwtToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('✅ New tokens issued');
    return response;
  } catch (error) {
    console.error('❌ Token refresh error:', (error as Error).message);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
