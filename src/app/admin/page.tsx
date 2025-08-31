'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  ShoppingCart,
  Building2,
  Pill,
  Truck,
  MessageCircle,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import { MoreHorizontal, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DataGrid,
  type GridRowsProp,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { StatusCell } from '@/components/ui/status-cell';
import { ChooseDoctorPopup } from '@/dialogs/choose-doctor-popup';
import { PatientDetailsPopup } from '@/dialogs/patient-details-popup';
import { SaveWarningDialog } from '@/dialogs/save-warning-dialog';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState('nurse');
  const [emailAddress, setEmailAddress] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [showModifyOrder, setShowModifyOrder] = useState(false);
  const [showChooseDoctorPopup, setShowChooseDoctorPopup] = useState(false);
  const [showPatientDetailsPopup, setShowPatientDetailsPopup] = useState(false);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [drugRows, setDrugRows] = useState([
    {
      id: 1,
      rxNumber: '123',
      fillDate: '01/22/2024',
      drugName: 'Drug 1',
      quantity: 'tablet',
      units: '10',
      strength: '0.5',
    },
  ]);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'hospice', label: 'Hospice', icon: Building2 },
    { id: 'pharmacist', label: 'Pharmacist', icon: Pill },
    { id: 'delivery', label: 'Delivery Staff', icon: Truck },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Log out', icon: LogOut },
  ];

  const orderRows: GridRowsProp = [
    {
      id: 1,
      orderid: '123467',
      status: 'Delivered',
      medicine: 'Antibiotics 500, MG...',
      orderdate: '4 Mar, 2023\n1:00 P.M. EST',
      location: 'Health View Clinic\nGreen St. 32, Larkfield Town...',
      orderby: 'Dr. Milos I',
    },
    {
      id: 2,
      orderid: '123468',
      status: 'Cancelled',
      medicine: 'Paracetamol 250mg',
      orderdate: '4 Mar, 2023\n1:00 P.M. EST',
      location: 'Health View Clinic\nGreen St. 32, Lark',
      orderby: 'Dr. Smith',
    },
    {
      id: 3,
      orderid: '123469',
      status: 'In Progress',
      medicine: 'Ibuprofen 400mg',
      orderdate: '5 Mar, 2023\n2:30 P.M. EST',
      location: 'City Medical Center\nMain St. 15, Downtown',
      orderby: 'Dr. Johnson',
    },
    {
      id: 4,
      orderid: '123470',
      status: 'Dispatched',
      medicine: 'Aspirin 100mg',
      orderdate: '5 Mar, 2023\n3:45 P.M. EST',
      location: 'Community Hospital\nPark Ave. 22, Uptown',
      orderby: 'Dr. Williams',
    },
  ];

  const OrderDateCell = ({ value }: { value: string }) => {
    const [date, time] = value.split('\n');
    return (
      <div>
        <div className="text-black font-medium text-sm">{date}</div>
        <div className="text-gray-500 text-xs">{time}</div>
      </div>
    );
  };

  const LocationCell = ({ value }: { value: string }) => {
    const [name, address] = value.split('\n');
    return (
      <div>
        <div className="text-black font-medium text-sm">{name}</div>
        <div className="text-[#0077bb] text-xs">{address}</div>
      </div>
    );
  };

  const OrderByCell = ({ value }: { value: string }) => {
    const handleModifyOrder = () => {
      setShowModifyOrder(true);
    };

    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-gray-900 text-sm">{value}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
            <DropdownMenuItem>Cancel Order</DropdownMenuItem>
            <DropdownMenuItem onClick={handleModifyOrder}>
              Modify Order
            </DropdownMenuItem>
            <DropdownMenuItem>Approved Order</DropdownMenuItem>
            <DropdownMenuItem>Track Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const orderColumns: GridColDef[] = [
    {
      field: 'orderid',
      headerName: 'Order ID',
      width: 120,
      headerClassName: 'font-medium text-gray-600',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      headerClassName: 'font-medium text-gray-600',
      renderCell: (params: GridRenderCellParams) => (
        <StatusCell value={params.value} />
      ),
    },
    {
      field: 'medicine',
      headerName: 'Order Medicine',
      width: 200,
      headerClassName: 'font-medium text-gray-600',
    },
    {
      field: 'orderdate',
      headerName: 'Order Date',
      width: 150,
      headerClassName: 'font-medium text-gray-600',
      renderCell: (params: GridRenderCellParams) => (
        <OrderDateCell value={params.value} />
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 220,
      headerClassName: 'font-medium text-gray-600',
      renderCell: (params: GridRenderCellParams) => (
        <LocationCell value={params.value} />
      ),
    },
    {
      field: 'orderby',
      headerName: 'Order By',
      width: 180,
      headerClassName: 'font-medium text-gray-600',
      renderCell: (params: GridRenderCellParams) => (
        <OrderByCell value={params.value} />
      ),
    },
  ];

  const handleDeleteDrug = (id: number) => {
    setDrugRows(drugRows.filter((row) => row.id !== id));
  };

  const handleAddNewDrug = () => {
    const newId = Math.max(...drugRows.map((row) => row.id)) + 1;
    setDrugRows([
      ...drugRows,
      {
        id: newId,
        rxNumber: '',
        fillDate: '',
        drugName: '',
        quantity: '',
        units: '',
        strength: '',
      },
    ]);
  };

  const handleSaveOrder = () => {
    setShowSaveWarning(true);
  };

  const renderContent = () => {
    if (showModifyOrder) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-black mb-8">
            Modify Order
          </h1>
          <div className="bg-[#eaeaea] px-8 py-8 min-h-[600px] rounded-lg">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 gap-8">
                {/* First Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Order ID
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px] mt-2">
                      Patient Details
                    </label>
                    <div className="flex-1">
                      <textarea className="bg-white border border-gray-300 rounded-lg h-20 w-full px-3 py-2 resize-none" />
                      <button
                        onClick={() => setShowPatientDetailsPopup(true)}
                        className="mt-2 bg-[#5cb3f0] text-white px-4 py-1 rounded text-sm hover:bg-[#4a9fd9]"
                      >
                        Change/Add
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Status
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Pharmacy
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Order
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px] mt-2">
                      Doctor
                    </label>
                    <div className="flex-1">
                      <textarea className="bg-white border border-gray-300 rounded-lg h-20 w-full px-3 py-2 resize-none" />
                      <button
                        onClick={() => setShowChooseDoctorPopup(true)}
                        className="mt-2 bg-[#5cb3f0] text-white px-4 py-1 rounded text-sm hover:bg-[#4a9fd9]"
                      >
                        Choose Doctor
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Approval
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                </div>

                {/* Second Column */}
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[120px]">
                      Date Order
                    </label>
                    <input
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleSaveOrder}
                  className="bg-[#0077bb] text-white px-6 py-2 rounded hover:bg-[#005599]"
                >
                  Save Order
                </button>
                <button className="bg-[#0077bb] text-white px-6 py-2 rounded hover:bg-[#005599]">
                  Message
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
                  Cancel Order
                </button>
                <button
                  onClick={() => setShowModifyOrder(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'home') {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-black mb-8">
            Send Invitation
          </h1>

          <Card className="max-w-2xl bg-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                <RadioGroup
                  value={userType}
                  onValueChange={setUserType}
                  className="flex gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="nurse"
                      id="nurse"
                      className="border-gray-400"
                    />
                    <Label
                      htmlFor="nurse"
                      className="text-gray-600 font-medium"
                    >
                      Nurse
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="patient"
                      id="patient"
                      className="border-gray-400"
                    />
                    <Label
                      htmlFor="patient"
                      className="text-gray-600 font-medium"
                    >
                      Patient
                    </Label>
                  </div>
                </RadioGroup>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-email" className="text-gray-600">
                      Confirm Email
                    </Label>
                    <Input
                      id="confirm-email"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    className="px-8 py-2 text-white font-medium rounded"
                    style={{ backgroundColor: '#0077bb' }}
                  >
                    Send Invites
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'orders') {
      const filterButtons = [
        { id: 'all', label: 'All Orders' },
        { id: 'progress', label: 'In Progress' },
        { id: 'dispatched', label: 'Dispatched' },
        { id: 'delivered', label: 'Delivered' },
      ];

      return (
        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Track, Create Orders here...</p>

            <div className="flex gap-6 mb-6">
              {filterButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => setOrdersFilter(button.id)}
                  className={`px-4 py-2 font-medium transition-colors hover:text-[#0b9afe] ${
                    button.id === 'all' || ordersFilter === button.id
                      ? 'text-[#0b9afe]'
                      : 'text-[#929292]'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search Orders"
                className="pl-10 max-w-md bg-white border-gray-300"
              />
            </div>
          </div>

          <div
            className="bg-white rounded-lg border"
            style={{ height: 500, width: '100%' }}
          >
            <DataGrid
              rows={orderRows}
              columns={orderColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9fafb',
                },
              }}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'pharmacist') {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-black mb-8">Pharmacist</h1>
          <div className="bg-[#eaeaea] px-8 py-8 min-h-[600px] rounded-lg">
            <div className="max-w-6xl mx-auto">
              {/* Personal Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-600 mb-6">
                  Personal Details
                </h3>

                {/* Row 1: ID only - full width */}
                <div className="mb-6 flex items-center gap-2">
                  <label
                    htmlFor="id"
                    className="text-gray-600 font-normal text-sm min-w-[100px]"
                  >
                    ID
                  </label>
                  <input
                    id="id"
                    type="text"
                    className="bg-white border border-gray-300 rounded-lg h-10 max-w-md w-64 px-3"
                  />
                </div>

                {/* Row 2: First name, middle name, last name - three columns */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="firstName"
                      className="text-gray-600 font-normal text-sm min-w-[100px]"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="middleName"
                      className="text-gray-600 font-normal text-sm min-w-[100px]"
                    >
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="lastName"
                      className="text-gray-600 font-normal text-sm min-w-[100px]"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                </div>

                {/* Row 3: Date of birth, gender - two columns with empty third */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="dateOfBirth"
                      className="text-gray-600 font-normal text-sm min-w-[100px]"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-600 font-normal text-sm min-w-[100px]">
                      Gender
                    </label>
                    <div className="flex gap-6 flex-1">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            className="sr-only peer"
                          />
                          <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                          </div>
                        </div>
                        <span className="text-gray-600 text-sm ml-2">Male</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            className="sr-only peer"
                          />
                          <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                          </div>
                        </div>
                        <span className="text-gray-600 text-sm ml-2">
                          Female
                        </span>
                      </label>
                    </div>
                  </div>
                  <div></div> {/* Empty third column */}
                </div>

                {/* Row 4: Mobile number only - one column with empty second and third */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="mobileNumber"
                      className="text-gray-600 font-normal text-sm min-w-[100px]"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      className="bg-white border border-gray-300 rounded-lg h-10 flex-1 px-3"
                    />
                  </div>
                  <div></div> {/* Empty second column */}
                  <div></div> {/* Empty third column */}
                </div>

                {/* Info text instead of checkbox */}
                <div className="flex justify-center mb-6">
                  <span className="text-gray-600 text-sm">
                    This will send invite to New Pharmacy added to activate
                  </span>
                </div>

                {/* Bottom section with buttons */}
                <div className="relative pt-4">
                  {/* Buttons - centered */}
                  <div className="flex justify-center gap-4 mb-8">
                    <button
                      type="button"
                      className="bg-[#0077bb] hover:bg-[#005599] text-white text-base font-medium rounded-lg h-12 px-8"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 hover:bg-gray-500 text-white text-base font-medium rounded-lg h-12 px-8"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-black mb-8">
          {menuItems.find((item) => item.id === activeTab)?.label}
        </h1>
        <p className="text-gray-600">
          Content for {menuItems.find((item) => item.id === activeTab)?.label}{' '}
          will be displayed here.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-64 min-h-screen"
          style={{ backgroundColor: '#5e5e5e' }}
        >
          <div className="p-4">
            <Button className="w-full mb-6 bg-transparent border border-gray-400 text-white hover:bg-gray-600">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-gray-600 transition-colors ${
                      activeTab === item.id ? 'bg-gray-600' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">{renderContent()}</main>
      </div>

      {/* External Dialog Components */}
      <ChooseDoctorPopup
        open={showChooseDoctorPopup}
        onOpenChange={setShowChooseDoctorPopup}
        drugRows={drugRows}
        onDeleteDrug={handleDeleteDrug}
        onAddNewDrug={handleAddNewDrug}
        onUpdateDrug={setDrugRows}
      />
      <PatientDetailsPopup
        open={showPatientDetailsPopup}
        onOpenChange={setShowPatientDetailsPopup}
      />
      <SaveWarningDialog
        open={showSaveWarning}
        onOpenChange={setShowSaveWarning}
      />
    </div>
  );
}
