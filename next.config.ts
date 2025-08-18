import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for better Azure App Service compatibility
  output: 'standalone',
  
  trailingSlash: false,
  
  images: {
    unoptimized: true
  },
  
  // Server configuration
  serverExternalPackages: [],
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Ensure proper handling of API routes
  async rewrites() {
    return []
  },
};

export default nextConfig;
