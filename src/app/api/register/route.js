import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      'https://cnsclick-api.azurewebsites.net/api/user/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body).toString(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to submit');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Submission failed' }, { status: 500 });
  }
}
