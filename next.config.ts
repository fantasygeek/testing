/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // This is the key setting!
  trailingSlash: true,
  images: {
    unoptimized: true, // Recommended for Azure
  },
  // Optional: if you have custom domains or CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};
