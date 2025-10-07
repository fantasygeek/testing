import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

// Define your expected JWT payload structure
interface MyJwtPayload extends JwtPayload {
  username: string;
  roles: string[];
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwtToken')?.value;

    console.log('🔍 Validating token:', token ? 'Token found' : 'No token');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify JWT token with type assertion
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    console.log('✅ Token valid for user:', decoded.username);

    return NextResponse.json({
      user: {
        username: decoded.username,
        roles: decoded.roles,
      },
    });
  } catch (error) {
    const err = error as jwt.JsonWebTokenError;

    console.error('❌ Token validation error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
