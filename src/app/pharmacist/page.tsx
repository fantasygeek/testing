'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/SidebarMenu';

import {
  Home,
  ShoppingCart,
  MessageCircle,
  HelpCircle,
  Settings,
  LogOut,
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
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    roles: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [ordersFilter, setOrdersFilter] = useState<number>(-1);
  const [currentFilter, setCurrentFilter] = useState<number>(-1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orderRows, setOrderRows] = useState<GridRowsProp>([]);
  const [searchText, setSearchText] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveRemarks, setApproveRemarks] = useState('');
  const [approveOrderId, setApproveOrderId] = useState<string | number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [filters, setFilters] = useState({
    orderStatus: null as number | null,
    dateFrom: '2025-01-01',
    dateTo: today,
    patientName: null as string | null,
    orderBy: null as string | null,
  });

  const checkAuth = useCallback(() => {
    if (typeof document === 'undefined') return;

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const username = cookies['username'];
    const rolesStr = cookies['roles'];

    if (!username || !rolesStr) {
      router.push('/login');
      return;
    }

    try {
      const roles = JSON.parse(rolesStr);

      if (!roles.includes('DOCTOR')) {
        router.push('/unauthorized');
        return;
      }

      setUser({ username, roles });
    } catch {
      router.push('/login');
    }
  }, [router]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Logout handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        router.push('/login');
        router.refresh();
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/login');
      }
    }
  };

  function handleApproveClick(orderId: number | string) {
    setApproveOrderId(orderId);
    setApproveDialogOpen(true);
  }

  async function handleApproveSubmit() {
    if (!approveOrderId) return;
    try {
      const response = await fetch('/api/orders/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: approveOrderId,
          remarks: approveRemarks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to approve order');
        return;
      }

      setApproveDialogOpen(false);
      setApproveRemarks('');
      setApproveOrderId(null);
      fetchOrders();
      alert('Order approved successfully');
    } catch (error) {
      alert('Failed to approve order. ' + error);
    }
  }

  const fetchOrders = useCallback(
    async (searchQuery = '', statusFilter: number | null = null) => {
      setLoading(true);
      try {
        const updatedFilters = {
          ...filters,
          patientName: searchQuery.trim() || null,
          orderStatus: statusFilter,
        };

        console.log('Sending filters to API:', updatedFilters);

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedFilters),
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const ordersData = await response.json();
        setOrderRows(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        alert('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    },
    [filters, router]
  );

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [ordersFilter, user, fetchOrders]);

  const handleStatusFilter = (status: number) => {
    console.log('Clicking status:', status);
    setCurrentFilter(status);
    const filterValue = status === -1 ? null : status;
    console.log('Sending to API:', filterValue);
    setOrdersFilter(status);
    setFilters((prev) => ({
      ...prev,
      orderStatus: filterValue,
    }));
    fetchOrders(searchText, filterValue);
  };

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

  const clearSearch = () => {
    setSearchText('');
    const filterValue = currentFilter === -1 ? null : currentFilter;
    fetchOrders('', filterValue);
  };

  const menuItems: SidebarMenuItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Log out', icon: LogOut, onClick: handleLogout },
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

  const OrderByCell = (params: GridRenderCellParams) => (
    <div className="flex items-center justify-between w-full">
      <span className="text-gray-900 text-sm">{params.value}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
          <DropdownMenuItem>Cancel</DropdownMenuItem>
          <DropdownMenuItem>Modify</DropdownMenuItem>
          {typeof params.row.status === 'string' &&
            params.row.status.replace(/_/g, ' ').toUpperCase() ===
              'WAITING FOR APPROVAL' &&
            params.row.approvalRequired === true && (
              <DropdownMenuItem
                onClick={() => handleApproveClick(params.row.orderid)}
              >
                Approve
              </DropdownMenuItem>
            )}
          <DropdownMenuItem>Track</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
      renderCell: (params: GridRenderCellParams) => <OrderByCell {...params} />,
    },
  ];

  const renderContent = () => {
    if (activeTab === 'orders') {
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

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by Patient Name (Press Enter to search)"
                value={searchText}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="pl-10 max-w-md bg-white border-gray-300"
              />
              {approveDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 className="text-lg font-semibold mb-4">
                      Approve Order
                    </h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Remarks
                      </label>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={approveRemarks}
                        onChange={(e) => setApproveRemarks(e.target.value)}
                        placeholder="Enter remarks (optional)"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setApproveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleApproveSubmit}
                        style={{ backgroundColor: '#DED1F0', color: '#3a2c4a' }}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
              <span style={{ color: '#929292' }}>Dr. {user.username}</span>
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
        <SidebarMenu
          items={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <main className="flex-1 bg-white">{renderContent()}</main>
      </div>
    </div>
  );
}
