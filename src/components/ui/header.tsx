'use client';

import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  showLogo?: boolean;
  headerBgColor?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Login',
  logoSrc = '/images/cns-logo.png',
  logoAlt = 'CNS Logo',
  logoWidth = 120,
  logoHeight = 120,
  showLogo = true,
  headerBgColor = 'bg-[#1e4b7b]',
  className = '',
}) => {
  return (
    <header className={`bg-white ${className}`}>
      {/* Blue header bar */}
      <div className={`${headerBgColor} text-white px-6 py-4`}>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>

      {/* Logo section - positioned in upper right */}
      {showLogo && (
        <div className="flex justify-end pr-8 pt-4">
          <div className="flex flex-col items-center">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </header>
  );
};

export { Header };
