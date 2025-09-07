export async function POST(request) {
  try {
    const body = await request.json();

    // Set dateTo to today if not provided
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    if (!body.dateTo) {
      body.dateTo = today;
    }

    console.log('Get orders request:', body);

    // Get the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        {
          error: 'Missing or invalid Authorization header',
          message: 'Please provide a valid Bearer token',
        },
        { status: 401 }
      );
    }

    const response = await fetch(
      'https://cnsclick-api.azurewebsites.net/api/order/gets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader, // Pass through the Bearer token
        },
        body: JSON.stringify(body),
      }
    );

    console.log('External API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('External API error:', errorData);
      return Response.json(
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

    return Response.json(transformedData, { status: response.status });
  } catch (error) {
    console.error('Orders proxy error:', error);
    return Response.json(
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
  // Handle both array and object responses
  const orders = Array.isArray(apiData)
    ? apiData
    : apiData.orders || apiData.data || [];

  return orders.map((order, index) => ({
    id: order.id || index + 1, // Use order.id or fallback to index
    orderid:
      order.orderId || order.orderNumber || order.id || `ORD${index + 1}`,
    status: order.orderStatusDesc || 'Unknown',
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
  }));
}

function formatMedicine(orderItems) {
  if (!orderItems) return 'N/A';

  // If it's already a string, return as is
  if (typeof orderItems === 'string') {
    return orderItems;
  }

  // If it's an array of order items
  if (Array.isArray(orderItems)) {
    const medicines = orderItems.map((item) => {
      return item.name || item.drugName || item.medicine || 'Unknown Medicine';
    });

    // Join multiple medicines, truncate if too long
    const medicineText = medicines.join(', ');

    // Limit length for display (you can adjust this)
    if (medicineText.length > 150) {
      return medicineText.substring(0, 147) + '...';
    }

    return medicineText;
  }

  return 'N/A';
}

// Helper function to format date
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

// Helper function to format location
function formatLocation(locationData) {
  if (!locationData) return 'N/A';

  if (typeof locationData === 'string') {
    return locationData;
  }

  // If location is an object
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
