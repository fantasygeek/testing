import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Better Azure compatibility
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  
  // Ensure static files are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  
  // Add experimental features for better Azure support
  experimental: {
    serverComponentsExternalPackages: []
  },
  
  // Ensure proper headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
