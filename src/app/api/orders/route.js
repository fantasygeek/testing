import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // ✅ Get JWT token from httpOnly cookie instead of Authorization header
    const token = request.cookies.get('jwtToken')?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: 'Missing or invalid token',
          message: 'Please login to continue',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Set dateTo to today if not provided
    const today = new Date().toISOString().split('T')[0];
    if (!body.dateTo) {
      body.dateTo = today;
    }

    console.log('Get orders request:', body);
    console.log('Using token from cookie');

    // Call external API with token from cookie
    const response = await fetch(
      'https://cnsclick-api.azurewebsites.net/api/order/gets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use token from cookie
        },
        body: JSON.stringify(body),
      }
    );

    console.log('External API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('External API error:', errorData);
      return NextResponse.json(
        {
          error: 'External API error',
          status: response.status,
          message: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Orders retrieved successfully');

    // Transform the data to MUI DataGrid format
    const transformedData = transformToMUIFormat(data);

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('Orders proxy error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to transform API response to MUI DataGrid format
function transformToMUIFormat(apiData) {
  const orders = Array.isArray(apiData)
    ? apiData
    : apiData.orders || apiData.data || [];

  return orders.map((order, index) => ({
    id: order.id || index + 1,
    orderid:
      order.orderId || order.orderNumber || order.id || `ORD${index + 1}`,
    status: order.orderStatusDesc || 'Unknown',
    patient: order.patientName || order.patient || 'N/A',
    medicine: formatMedicine(order.orderItems || order.items || order.medicine),
    orderdate: formatOrderDate(
      order.orderDate || order.createdAt || order.date
    ),
    location: formatLocation(order.location || order.facility || order.clinic),
    orderby:
      order.doctorName ||
      order.doctor ||
      order.physician ||
      order.prescriber ||
      'N/A',
    approvalRequired: order.approvalRequired || false, // ✅ Add this field
  }));
}

function formatMedicine(orderItems) {
  if (!orderItems) return 'N/A';

  if (typeof orderItems === 'string') {
    return orderItems;
  }

  if (Array.isArray(orderItems)) {
    const medicines = orderItems.map((item) => {
      return item.name || item.drugName || item.medicine || 'Unknown Medicine';
    });

    const medicineText = medicines.join(', ');

    if (medicineText.length > 150) {
      return medicineText.substring(0, 147) + '...';
    }

    return medicineText;
  }

  return 'N/A';
}

function formatOrderDate(dateString) {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    const [datePart, timePart] = formattedDate.split(', ');

    return `${datePart}\n${timePart} EST`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

function formatLocation(locationData) {
  if (!locationData) return 'N/A';

  if (typeof locationData === 'string') {
    return locationData;
  }

  if (typeof locationData === 'object') {
    const name =
      locationData.name ||
      locationData.facilityName ||
      locationData.clinic ||
      '';
    const address = locationData.address || locationData.street || '';
    const city = locationData.city || '';
    const state = locationData.state || '';

    let formattedLocation = name;
    if (address) {
      formattedLocation += `\n${address}`;
      if (city) formattedLocation += `, ${city}`;
      if (state) formattedLocation += `, ${state}`;
    }

    return formattedLocation || 'N/A';
  }

  return 'N/A';
}
