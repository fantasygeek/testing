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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState('nurse');
  const [emailAddress, setEmailAddress] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('all');

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

  // MUI DataGrid data for orders
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

  // Custom cell renderer for Order Date
  const OrderDateCell = ({ value }: { value: string }) => {
    const [date, time] = value.split('\n');
    return (
      <div>
        <div className="text-black font-medium text-sm">{date}</div>
        <div className="text-gray-500 text-xs">{time}</div>
      </div>
    );
  };

  // Custom cell renderer for Location
  const LocationCell = ({ value }: { value: string }) => {
    const [name, address] = value.split('\n');
    return (
      <div>
        <div className="text-black font-medium text-sm">{name}</div>
        <div className="text-[#0077bb] text-xs">{address}</div>
      </div>
    );
  };

  // Custom cell renderer for Order By with dropdown
  const OrderByCell = ({ value }: { value: string }) => {
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
            <DropdownMenuItem>Modify Order</DropdownMenuItem>
            <DropdownMenuItem>Approved Order</DropdownMenuItem>
            <DropdownMenuItem>Track Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  // Column definitions for MUI DataGrid
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

  const renderContent = () => {
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
    </div>
  );
}
