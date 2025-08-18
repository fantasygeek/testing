import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove standalone output for Azure Web Apps
  // output: 'standalone', 
  
  // Add these for better Azure compatibility
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  
  // Ensure static files are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
};

export default nextConfig;
