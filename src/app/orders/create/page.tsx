'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Search, Trash2, ArrowLeft, ChevronDown } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  licenseNo?: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Medicine {
  id: number;
  name: string;
  description?: string;
}

interface OrderItem {
  drugId: number;
  drugName: string;
  quantity: number;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function NewOrderPage() {
  // Set orderBy from localStorage username on mount
  React.useEffect(() => {
    const username = localStorage.getItem('username') || '';
    setFormData((prev) => ({
      ...prev,
      orderBy: username,
    }));
  }, []);
  // Custom Select Component
  type CustomSelectOption = {
    value: string;
    label: string;
    description?: string;
  };

  interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: CustomSelectOption[];
    className?: string;
  }

  const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onValueChange,
    placeholder,
    options,
    className = '',
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] =
      useState<CustomSelectOption | null>(null);

    useEffect(() => {
      const option =
        options.find((opt: CustomSelectOption) => opt.value === value) || null;
      setSelectedOption(option);
    }, [value, options]);

    const handleSelect = (option: CustomSelectOption) => {
      onValueChange(option.value);
      setSelectedOption(option);
      setIsOpen(false);
    };

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option: CustomSelectOption) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  // Form state
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

  const [address, setAddress] = useState<Address>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showMedicinePopup, setShowMedicinePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  // API medicine type for mapping
  type ApiMedicine = {
    id: number;
    DrugName: string;
    Manufacturer?: string;
  };

  // Fetch medicines from API
  const fetchMedicines = React.useCallback(async () => {
    setLoadingMedicines(true);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(
        'https://cnsclick-api.azurewebsites.net/api/data/drug-info/a',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Map API response to our Medicine interface using DrugName
        const medicinesData = result.data.map((medicine: ApiMedicine) => ({
          id: medicine.id,
          name: medicine.DrugName,
          description: medicine.Manufacturer
            ? `Manufacturer: ${medicine.Manufacturer}`
            : undefined,
        }));
        setMedicines(medicinesData);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      alert('Failed to load medicines. Please try again.');
    } finally {
      setLoadingMedicines(false);
    }
  }, []);

  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // API doctor type for mapping
  type ApiDoctor = {
    id: number;
    name: string;
    licenseNo?: string;
  };

  // Fetch doctors from API
  const fetchDoctors = React.useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(
        'https://cnsclick-api.azurewebsites.net/api/data/doctors',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Map API response to our Doctor interface
        const doctorsData = result.data.map((doctor: ApiDoctor) => ({
          id: doctor.id,
          name: doctor.name,
          licenseNo: doctor.licenseNo,
        }));
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      alert('Failed to load doctors. Please try again.');
      // Fallback to sample data
      setDoctors([
        { id: 2, name: 'Ed Test' },
        { id: 4, name: 'Doctor 1 CNS' },
        { id: 7, name: '3 doctor' },
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // API patient type for mapping
  type ApiPatient = {
    id: number;
    name: string;
  };

  // Fetch patients from API
  const fetchPatients = React.useCallback(async () => {
    setLoadingPatients(true);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(
        'https://cnsclick-api.azurewebsites.net/api/data/patients',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Map API response to our Patient interface
        const patientsData = result.data.map((patient: ApiPatient) => ({
          id: patient.id,
          name: patient.name,
        }));
        setPatients(patientsData);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      alert('Failed to load patients. Please try again.');
      // Fallback to sample data
      setPatients([
        { id: 6, name: 'PatientFirstName PatientLastName' },
        { id: 26, name: 'Patient Test' },
      ]);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  // Load doctors, patients, and medicines on component mount
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchMedicines();
  }, [fetchDoctors, fetchPatients, fetchMedicines]);

  // Handle same as address checkbox
  const handleSameAsAddress = (checked: boolean) => {
    setSameAsAddress(checked);
    if (checked) {
      setDeliveryAddress({ ...address });
    }
  };

  // Update delivery address when main address changes (if same as address is checked)
  useEffect(() => {
    if (sameAsAddress) {
      setDeliveryAddress({ ...address });
    }
  }, [address, sameAsAddress]);

  // Handle doctor selection
  const handleDoctorSelect = (value: string) => {
    const doctor = doctors.find((d) => d.id.toString() === value);
    setFormData((prev) => ({
      ...prev,
      doctorId: value,
      doctorName: doctor?.name || '',
    }));
  };

  // Handle patient selection
  const handlePatientSelect = (value: string) => {
    const patient = patients.find((p) => p.id.toString() === value);
    setFormData((prev) => ({
      ...prev,
      patientId: value,
      patientName: patient?.name || '',
    }));
  };

  // Medicine popup component
  const MedicinePopup = () => {
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedicines = medicines.filter(
      (med) =>
        typeof med.name === 'string' &&
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addMedicine = () => {
      if (!selectedMedicine) return;

      const medicine = medicines.find(
        (m) => m.id.toString() === selectedMedicine
      );
      if (!medicine) return;

      // Check if medicine already exists
      const existingIndex = orderItems.findIndex(
        (item) => item.drugId === medicine.id
      );

      if (existingIndex >= 0) {
        // Update quantity if exists
        const updatedItems = [...orderItems];
        updatedItems[existingIndex].quantity += quantity;
        setOrderItems(updatedItems);
      } else {
        // Add new medicine
        setOrderItems((prev) => [
          ...prev,
          {
            drugId: medicine.id,
            drugName: medicine.name,
            quantity: quantity,
          },
        ]);
      }

      // Reset and close
      setSelectedMedicine('');
      setQuantity(1);
      setSearchTerm('');
      setShowMedicinePopup(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Medicine</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMedicinePopup(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Medicine Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Medicine
            </label>
            {loadingMedicines ? (
              <div className="h-12 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                <span className="text-gray-500">Loading medicines...</span>
              </div>
            ) : (
              <CustomSelect
                value={selectedMedicine}
                onValueChange={setSelectedMedicine}
                placeholder="Choose a medicine"
                options={filteredMedicines.map((medicine) => ({
                  value: medicine.id.toString(),
                  label: medicine.name,
                  description: medicine.description,
                }))}
              />
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={addMedicine}
              className="flex-1"
              style={{ backgroundColor: '#DED1F0', color: '#3a2c4a' }}
            >
              Add Medicine
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMedicinePopup(false)}
              className="flex-1"
              style={{
                backgroundColor: '#DED1F0',
                color: '#3a2c4a',
                borderColor: '#DED1F0',
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Remove medicine from order
  const removeMedicine = (drugId: number) => {
    setOrderItems((prev) => prev.filter((item) => item.drugId !== drugId));
  };

  // Submit order
  const handleSubmit = async () => {
    if (!formData.doctorId || !formData.patientId || orderItems.length === 0) {
      alert(
        'Please fill in all required fields and add at least one medicine.'
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No authentication token found');

      const orderData = {
        pharmacyId: formData.pharmacyId,
        pharmacyName: formData.pharmacyName,
        doctorId: parseInt(formData.doctorId),
        doctorName: formData.doctorName,
        patientId: parseInt(formData.patientId),
        patientName: formData.patientName,
        address: address,
        deliveryAddress: deliveryAddress,
        Landmark: formData.landmark,
        orderBy: formData.orderBy,
        orderDate: new Date(formData.orderDate).toISOString(),
        hospiceAdmitted: formData.hospiceAdmitted,
        remarks: formData.remarks,
        orderItems: orderItems.map((item) => ({
          drugId: item.drugId,
          quantity: item.quantity,
        })),
      };

      console.log('Submitting order data:', orderData);

      const response = await fetch(
        'https://cnsclick-api.azurewebsites.net/api/order/creation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order created successfully:', result);
      alert('Order created successfully!');

      // Reset form
      setFormData({
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
      setAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      });
      setDeliveryAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      });
      setOrderItems([]);
      setSameAsAddress(false);
      window.history.back();
    } catch (error) {
      console.error('Failed to create order:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      alert('Failed to create order: ' + message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-8">
            {/* Doctor and Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Doctor *
                </label>
                {loadingDoctors ? (
                  <div className="h-12 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                    <span className="text-gray-500">Loading doctors...</span>
                  </div>
                ) : (
                  <CustomSelect
                    value={formData.doctorId}
                    onValueChange={handleDoctorSelect}
                    placeholder="Select a doctor"
                    options={doctors.map((doctor) => ({
                      value: doctor.id.toString(),
                      label: doctor.name,
                      description: doctor.licenseNo
                        ? `License: ${doctor.licenseNo}`
                        : undefined,
                    }))}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Patient *
                </label>
                {loadingPatients ? (
                  <div className="h-12 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                    <span className="text-gray-500">Loading patients...</span>
                  </div>
                ) : (
                  <CustomSelect
                    value={formData.patientId}
                    onValueChange={handlePatientSelect}
                    placeholder="Select a patient"
                    options={patients.map((patient) => ({
                      value: patient.id.toString(),
                      label: patient.name,
                    }))}
                  />
                )}
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
                  readOnly
                  placeholder="Order By"
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsAddress}
                    onChange={(e) => handleSameAsAddress(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    Same as patient address
                  </span>
                </label>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Items *
                </h3>
                <Button
                  onClick={() => setShowMedicinePopup(true)}
                  style={{ backgroundColor: '#DED1F0', color: '#3a2c4a' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No medicines added yet</p>
                  <Button
                    onClick={() => setShowMedicinePopup(true)}
                    variant="outline"
                    style={{
                      backgroundColor: '#DED1F0',
                      color: '#3a2c4a',
                      borderColor: '#DED1F0',
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Medicine
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.drugId}
                      className="flex items-center justify-between bg-white p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {item.drugName}
                        </span>
                        <span className="text-gray-500 ml-3">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(item.drugId)}
                        style={{ backgroundColor: '#DED1F0', color: '#3a2c4a' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: '#DED1F0',
                  color: '#3a2c4a',
                  padding: '0.75rem 3rem',
                  height: '3rem',
                }}
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: '#DED1F0',
                  color: '#3a2c4a',
                  borderColor: '#DED1F0',
                  padding: '0.75rem 2rem',
                  height: '3rem',
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Popup */}
      {showMedicinePopup && <MedicinePopup />}
    </div>
  );
}
