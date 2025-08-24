'use client';

import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
}

interface LeftMenuProps {
  menuItems?: MenuItem[];
  className?: string;
  onMenuItemClick?: (itemId: string) => void;
}

const defaultMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠', href: '/' },
  { id: 'products', label: 'Orders', icon: '📦', href: '/' },
  { id: 'users', label: 'Chat', icon: '💬', href: '/' },
  { id: 'analytics', label: 'Help', icon: '❓', href: '/' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/' },
];

const LeftMenu: React.FC<LeftMenuProps> = ({
  menuItems = defaultMenuItems,
  className = '',
  onMenuItemClick,
}) => {
  const handleItemClick = (
    e: React.MouseEvent,
    itemId: string,
    href?: string
  ) => {
    e.preventDefault();

    if (onMenuItemClick) {
      onMenuItemClick(itemId);
    }

    // If href is provided and no custom click handler, navigate
    if (href && !onMenuItemClick) {
      window.location.href = href;
    }
  };

  return (
    <div
      className={`w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 shadow-lg z-10 ${className}`}
    >
      <div className="p-6 mt-20">
        <h2 className="text-xl font-bold mb-8">Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href || '#'}
                  onClick={(e) => handleItemClick(e, item.id, item.href)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    item.isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LeftMenu;
