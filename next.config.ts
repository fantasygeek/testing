import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove output: 'standalone' for now - this might be causing issues
  trailingSlash: false,
  
  images: {
    unoptimized: true
  },
  
  // Fix the experimental config
  serverExternalPackages: [], // moved from experimental
  
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
