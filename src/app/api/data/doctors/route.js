import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('jwtToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiRes = await fetch(
    'https://cnsclick-api.azurewebsites.net/api/data/doctors',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
