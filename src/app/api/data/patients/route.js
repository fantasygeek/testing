import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get JWT token from cookies
    const token = req.cookies.get('jwtToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Proxy request to external API
    const apiResponse = await fetch(
      'https://cnsclick-api.azurewebsites.net/api/data/patients',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch patients',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
