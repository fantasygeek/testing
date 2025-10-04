import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get token from cookies (automatically included in request)
  const token = request.cookies.get('jwtToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const baseUrl = 'https://cnsclick-api.azurewebsites.net';
    const response = await fetch(`${baseUrl}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('External API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
