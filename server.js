import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Better Azure compatibility
  output: 'standalone',
  trailingSlash: false,
  
  images: {
    unoptimized: true
  },
  
  // Remove assetPrefix for Azure
  // assetPrefix is not needed for Azure App Service
  
  // Basic headers
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
