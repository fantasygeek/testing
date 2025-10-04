// Dynamic order view page using orderId from URL
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface OrderItem {
  drugId: number;
  name?: string;
  ndc?: string;
  controlClass?: number;
  pkgSize?: number;
  awpCost?: number;
  quantity: number;
  drugName?: string;
}

export default function NewOrderPage() {
  const { user, loading, logout } = useAuth([
    'DOCTOR',
    'NURSE',
    'ADMIN',
    'PHARMACIST',
    'HOSPICE',
  ]);
  const [address, setAddress] = React.useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [deliveryAddress, setDeliveryAddress] = React.useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [sameAsAddress] = React.useState(false);
  // Get orderId from dynamic route
  const params = useParams();
  const orderId = params.orderId;

  // ...existing state declarations...
  const [formData, setFormData] = useState({
    pharmacyId: 2,
    pharmacyName: 'CNS Store (Branch 1)',
    doctorId: '',
    doctorName: '',
    patientId: '',
    patientName: '',
    orderBy: '',
    orderDate: new Date().toISOString().split('T')[0],
    hospiceAdmitted: '',
    remarks: '',
    landmark: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Fetch order details from API
  const fetchOrderDetails = React.useCallback(async () => {
    try {
      const response = await fetch('/api/orders/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const result = await response.json();
      if (result.success && result.data) {
        const order = result.data;
        setFormData({
          pharmacyId: order.pharmacyId,
          pharmacyName: order.pharmacyName,
          doctorId: order.doctorId?.toString() || '',
          doctorName: order.doctorName || '',
          patientId: order.patientId?.toString() || '',
          patientName: order.patientName || '',
          orderBy: order.orderBy || '',
          orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
          hospiceAdmitted: order.hospiceAdmitted || '',
          remarks: order.remarks || '',
          landmark: order.Landmark || '',
        });
        setAddress(order.address || {});
        setDeliveryAddress(order.deliveryAddress || {});
        setOrderItems(order.orderItems || []);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to load order details.');
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId, fetchOrderDetails]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/cns-logo-1.png"
              alt="cns-logo-1"
              width={60}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-medium" style={{ color: '#004c7f' }}>
              Click
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/admin-icon.jpg"
                alt="admin-icon"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span style={{ color: '#929292' }}>Admin / Super</span>
              <Image
                src="/images/icons.png"
                alt="icons"
                width={48}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            style={{ backgroundColor: '#DED1F0', color: '#3a2c4a' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">View Orders</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-8">
            {/* Doctor and Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Doctor
                </label>
                <Input
                  className="h-12"
                  value={formData.doctorName}
                  readOnly
                  placeholder="Doctor Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Patient
                </label>
                <Input
                  className="h-12"
                  value={formData.patientName}
                  readOnly
                  placeholder="Patient Name"
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Order By
                </label>
                <Input
                  className="h-12"
                  value={formData.orderBy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderBy: e.target.value,
                    }))
                  }
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Order Date
                </label>
                <Input
                  className="h-12"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Hospice Admitted
                </label>
                <Input
                  className="h-12"
                  value={formData.hospiceAdmitted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hospiceAdmitted: e.target.value,
                    }))
                  }
                  placeholder="Enter hospice info"
                />
              </div>
            </div>

            {/* Patient Address */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Patient Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  className="h-12"
                  placeholder="Address Line 1"
                  value={address.addressLine1}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                />
                <Input
                  className="h-12"
                  placeholder="Address Line 2"
                  value={address.addressLine2}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                />
                <Input
                  className="h-12"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
                <Input
                  className="h-12"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                />
                <Input
                  className="h-12"
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                />
                <Input
                  className="h-12"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, country: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  className="h-12"
                  placeholder="Address Line 1"
                  value={deliveryAddress.addressLine1}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
                <Input
                  className="h-12"
                  placeholder="Address Line 2"
                  value={deliveryAddress.addressLine2}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
                <Input
                  className="h-12"
                  placeholder="City"
                  value={deliveryAddress.city}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
                <Input
                  className="h-12"
                  placeholder="State"
                  value={deliveryAddress.state}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
                <Input
                  className="h-12"
                  placeholder="Zip Code"
                  value={deliveryAddress.zipCode}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      zipCode: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
                <Input
                  className="h-12"
                  placeholder="Country"
                  value={deliveryAddress.country}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  disabled={sameAsAddress}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Landmark
                </label>
                <Input
                  className="h-12"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      landmark: e.target.value,
                    }))
                  }
                  placeholder="Enter landmark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Remarks
                </label>
                <Input
                  className="h-12"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  placeholder="Enter remarks"
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h3>
              </div>
              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No medicines added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">Drug Name</th>
                        <th className="px-4 py-2 border">NDC</th>
                        <th className="px-4 py-2 border">Control Class</th>
                        <th className="px-4 py-2 border">Package Size</th>
                        <th className="px-4 py-2 border">AWP Cost</th>
                        <th className="px-4 py-2 border">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.drugId} className="bg-white">
                          <td className="px-4 py-2 border">
                            {item.name || item.drugName}
                          </td>
                          <td className="px-4 py-2 border">{item.ndc || ''}</td>
                          <td className="px-4 py-2 border">
                            {item.controlClass ?? ''}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.pkgSize ?? ''}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.awpCost ?? ''}
                          </td>
                          <td className="px-4 py-2 border">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
