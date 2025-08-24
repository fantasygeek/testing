'use client';
import * as React from 'react';
import { AdminHeader } from '@/components/ui/admin-header';
import LeftMenu from '@/components/ui/admin-leftmenu';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';

const StatusCell = ({ value }: { value: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        value
      )}`}
    >
      {value}
    </span>
  );
};

const rows: GridRowsProp = [
  {
    id: 1,
    orderid: '00001',
    patient: 'Patient 1',
    status: 'Pending',
    medicine: 'Medicine A',
    orderdate: '2024-06-01',
    location: 'Location X',
  },
  {
    id: 2,
    orderid: '00002',
    patient: 'Patient 2',
    status: 'Shipped',
    medicine: 'Medicine B',
    orderdate: '2024-06-02',
    location: 'Location Y',
  },
  {
    id: 3,
    orderid: '00003',
    patient: 'Patient 3',
    status: 'Delivered',
    medicine: 'Medicine C',
    orderdate: '2024-06-03',
    location: 'Location Z',
  },
];

const columns: GridColDef[] = [
  { field: 'orderid', headerName: 'Order ID', width: 120 },
  { field: 'patient', headerName: 'Patient', width: 300 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <StatusCell value={params.value} />
    ),
  },
  { field: 'medicine', headerName: 'Order Medicine', width: 200 },
  { field: 'orderdate', headerName: 'Order Date', width: 100 },
  { field: 'location', headerName: 'Location', width: 300 },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Blue header */}
      <AdminHeader
        title="Dashboard"
        leftTitle="Welcome Back"
        userProfile={{
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '',
        }}
      />
      {/* Main content */}
      <div className="flex">
        <LeftMenu className="relative h-auto" />

        <div className="flex-1 flex items-center justify-center font-medium py-8 px-10 mx-0">
          <div className="w-full max-w-6xl">
            <div style={{ height: 300, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
