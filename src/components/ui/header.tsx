'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  leftTitle?: string;
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
  leftTitle = '',
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

      {/* Logo and Left Title section */}
      <div className="flex justify-between items-center px-8 py-4">
        {/* Left Title - takes available space */}
        <div className="flex-1">
          {leftTitle && (
            <h2 className="text-2xl font-bold text-gray-800">{leftTitle}</h2>
          )}
        </div>

        {/* Logo - fixed to the right side */}
        {showLogo && (
          <div className="flex-shrink-0 ml-4">
            <Link href="/">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain"
              priority
            />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
