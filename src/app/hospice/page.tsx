'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Home,
  ShoppingCart,
  MessageCircle,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
  Menu,
  ChevronLeft,
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
  const [activeTab, setActiveTab] = useState('orders');
  const [ordersFilter, setOrdersFilter] = useState<number>(-1);
  const [currentFilter, setCurrentFilter] = useState<number>(-1); // ✅ Add separate state for immediate UI updates
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // ✅ Add sidebar collapse state
  const [orderRows, setOrderRows] = useState<GridRowsProp>([]);
  const [searchText, setSearchText] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    orderStatus: null as number | null, // ✅ Initialize with null for "All Orders"
    dateFrom: '2025-01-01',
    dateTo: today,
    patientName: null as string | null,
    orderBy: null as string | null,
  });

  // ✅ Fixed fetchOrders - useCallback to stabilize reference for useEffect
  const fetchOrders = useCallback(
    async (searchQuery = '', statusFilter: number | null = null) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('No authentication token found');

        const updatedFilters = {
          ...filters,
          patientName: searchQuery.trim() || null,
          orderStatus: statusFilter, // ✅ Use the parameter directly
        };

        console.log('Sending filters to API:', updatedFilters); // ✅ Add logging

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFilters),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const ordersData = await response.json();
        setOrderRows(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        alert('Failed to fetch orders: ');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchOrders();
  }, [ordersFilter, fetchOrders]);

  // ✅ Fixed handleStatusFilter using separate state for UI
  const handleStatusFilter = (status: number) => {
    console.log('Clicking status:', status);

    // Immediately update the UI state
    setCurrentFilter(status);

    // Convert -1 to null for API call
    const filterValue = status === -1 ? null : status;
    console.log('Sending to API:', filterValue);

    // Update the main state
    setOrdersFilter(status);
    setFilters((prev) => ({
      ...prev,
      orderStatus: filterValue,
    }));

    // Fetch orders after state is updated
    fetchOrders(searchText, filterValue);
  };

  // ✅ Add useEffect to handle re-render after state update
  useEffect(() => {
    // This will trigger a re-render whenever ordersFilter changes
  }, [ordersFilter]);

  // ✅ Fixed handleSearch
  const handleSearch = () => {
    const filterValue = currentFilter === -1 ? null : currentFilter;
    fetchOrders(searchText, filterValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // ✅ Fixed clearSearch
  const clearSearch = () => {
    setSearchText('');
    const filterValue = currentFilter === -1 ? null : currentFilter;
    fetchOrders('', filterValue);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Log out', icon: LogOut },
  ];

  // Custom renderers...
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

  const OrderByCell = ({ value }: { value: string }) => (
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

  // Columns
  const orderColumns: GridColDef[] = [
    { field: 'orderid', headerName: 'Order ID', width: 120, sortable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <StatusCell value={params.value} />
      ),
    },
    {
      field: 'patient',
      headerName: 'Patient Name',
      width: 140,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <StatusCell value={params.value} />
      ),
    },
    {
      field: 'medicine',
      headerName: 'Order Medicine',
      width: 200,
      sortable: true,
    },
    {
      field: 'orderdate',
      headerName: 'Order Date',
      width: 150,
      sortable: true,
      sortComparator: (v1, v2) =>
        new Date(v1.split('\n')[0]).getTime() -
        new Date(v2.split('\n')[0]).getTime(),
      renderCell: (params: GridRenderCellParams) => (
        <OrderDateCell value={params.value} />
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 220,
      sortable: true,
      sortComparator: (v1, v2) =>
        v1.split('\n')[0].localeCompare(v2.split('\n')[0]),
      renderCell: (params: GridRenderCellParams) => (
        <LocationCell value={params.value} />
      ),
    },
    {
      field: 'orderby',
      headerName: 'Order By',
      width: 180,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <OrderByCell value={params.value} />
      ),
    },
  ];

  // Main content
  const renderContent = () => {
    if (activeTab === 'orders') {
      // ✅ Fixed filterButtons - use -1 for "All Orders"
      const filterButtons = [
        { id: -1, label: 'All Orders' },
        { id: 1, label: 'CREATED' },
        { id: 2, label: 'APPROVED' },
        { id: 3, label: 'CANCELLED' },
        { id: 7, label: 'DELIVERED' },
      ];

      return (
        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Track, Create Orders here...</p>

            {/* ✅ Status filter buttons using currentFilter for immediate UI updates */}
            <div className="flex gap-6 mb-6">
              {filterButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => handleStatusFilter(button.id)}
                  className={`px-4 py-2 font-medium transition-colors hover:text-[#0b9afe] ${
                    currentFilter === button.id
                      ? 'text-[#0b9afe]'
                      : 'text-[#929292]'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by Patient Name (Press Enter to search)"
                value={searchText}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="pl-10 max-w-md bg-white border-gray-300"
              />
              {searchText && (
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div
            className="bg-white rounded-lg border"
            style={{ height: 500, width: '100%' }}
          >
            <DataGrid
              rows={orderRows}
              columns={orderColumns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                sorting: { sortModel: [{ field: 'orderdate', sort: 'desc' }] },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sortingOrder={['asc', 'desc']}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #f3f4f6' },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                },
                '& .MuiDataGrid-columnHeader:hover': {
                  backgroundColor: '#f3f4f6',
                },
                '& .MuiDataGrid-sortIcon': { opacity: 1, color: '#0b9afe' },
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 500 },
              }}
              loading={loading}
              onRowClick={(params) => {
                window.location.href = `/orders/view/${params.row.orderid}`;
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

  // Layout
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
          className={`min-h-screen transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
          style={{ backgroundColor: '#5e5e5e' }}
        >
          {/* Toggle Button at the top */}
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            {!sidebarCollapsed && (
              <span className="text-white font-medium">Menu</span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-gray-600 p-2 rounded transition-colors"
              title={sidebarCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {sidebarCollapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="p-4">
            {/* New Link */}
            <Link
              href="/orders/create"
              className={`w-full mb-6 flex items-center justify-center bg-transparent border border-gray-400 text-white hover:bg-gray-600 transition-colors ${
                sidebarCollapsed ? 'px-2' : 'px-4 py-2'
              } rounded-md`}
            >
              <Plus className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">New</span>}
            </Link>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-gray-600 transition-colors ${
                      activeTab === item.id ? 'bg-gray-600' : ''
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white">{renderContent()}</main>
      </div>
    </div>
  );
}
