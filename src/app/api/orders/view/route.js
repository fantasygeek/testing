import { NextResponse } from 'next/server';

export async function POST(req) {
  const { orderId } = await req.json();
  const token = req.cookies.get('jwtToken')?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing token' },
      { status: 401 }
    );
  }

  // Proxy request to external API
  const apiUrl = `https://cnsclick-api.azurewebsites.net/api/order/get/${orderId}`;
  const apiRes = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
