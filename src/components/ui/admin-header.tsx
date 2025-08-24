'use client';

import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  leftTitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  showLogo?: boolean;
  className?: string;
  userProfile?: {
    name: string;
    avatar?: string;
    email?: string;
  };
}

const AdminHeader: React.FC<HeaderProps> = ({
  logoSrc = '/images/admincnslogo.png',
  logoAlt = 'CNS Logo',
  logoWidth = 120,
  logoHeight = 120,
  showLogo = true,
  className = '',
  userProfile,
}) => {
  return (
    <header className={`bg-white ${className}`}>
      {/* Logo and User Profile section */}
      <div className="flex items-center px-8 py-4">
        {/* Logo - fixed to the left side */}
        {showLogo && (
          <div className="flex-shrink-0">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* User Profile - fixed to the right side */}
        {userProfile && (
          <div className="flex-shrink-0 flex items-center space-x-3 ml-auto">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
              {userProfile.avatar ? (
                <Image
                  src={userProfile.avatar}
                  alt={`${userProfile.name} avatar`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xl">👤</span>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {userProfile.name}
              </p>
              {userProfile.email && (
                <p className="text-xs text-gray-600">{userProfile.email}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { AdminHeader };
