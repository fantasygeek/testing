import React from 'react';
import Link from 'next/link';
import { Menu, ChevronLeft, Plus } from 'lucide-react';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

interface SidebarMenuProps {
  items: SidebarMenuItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  return (
    <aside
      className={`min-h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ backgroundColor: '#5e5e5e' }}
    >
      {/* Toggle Button at the top */}
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        {!collapsed && <span className="text-white font-medium">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-gray-600 p-2 rounded transition-colors"
          title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {collapsed ? (
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
            collapsed ? 'px-2' : 'px-4 py-2'
          } rounded-md`}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span className="ml-2">New</span>}
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-gray-600 transition-colors ${
                  activeTab === item.id ? 'bg-gray-600' : ''
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
