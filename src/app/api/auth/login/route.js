'use-client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Call external API
    const baseUrl = 'https://cnsclick-api.azurewebsites.net';
    const apiResponse = await fetch(`${baseUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: apiResponse.status }
      );
    }

    const result = await apiResponse.json();

    // Check if login was successful
    if (!result.success || !result.data) {
      return NextResponse.json(
        { 
          error: result.messages?.[0]?.details || 'Login failed',
          success: false 
        },
        { status: 401 }
      );
    }

    const { jwtToken, roles, username: userName } = result.data;

    // Create response with user data (without token)
    const response = NextResponse.json(
      {
        success: true,
        user: {
          username: userName,
          roles: roles
        }
      },
      { status: 200 }
    );

    // Set httpOnly cookie with JWT token
    response.cookies.set('jwtToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Set username in a separate cookie (not httpOnly so client can read it)
    response.cookies.set('username', userName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Set roles in a separate cookie (not httpOnly so client can read it)
    response.cookies.set('roles', JSON.stringify(roles), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}