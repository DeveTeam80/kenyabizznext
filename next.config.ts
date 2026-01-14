import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🟢 1. Add this images configuration block
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Allow all paths from Cloudinary
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/listings/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
          { key: 'Content-Language', value: 'en-KE' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        source: '/global-listings/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
          { key: 'Content-Language', value: 'en-KE' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        source: '/add-listing',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' }
        ]
      },
      {
        source: '/dashboard/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ]
      },
      // AI Agent specific headers
      {
        source: '/(.*)',
        headers: [
          { key: 'X-AI-Agent-Optimized', value: 'true' },
          { key: 'X-Knowledge-Graph-Enabled', value: 'true' },
          { key: 'X-Entity-Recognition', value: 'enabled' }
        ]
      }
    ]
  },
 async redirects() {
  return [
    // Category redirects (your existing ones)
    {
      source: '/real-estate/main',
      destination: '/listings/real-estate',
      permanent: true, 
    },
    {
      source: '/manufacturing/main',
      destination: '/listings/manufacturing',
      permanent: true,
    },
    {
      source: '/shops-and-suppliers/main',
      destination: '/listings/shops-and-suppliers',
      permanent: true,
    },
    {
      source: '/services/main',
      destination: '/listings/services',
      permanent: true,
    },
    {
      source: '/technology/main', 
      destination: '/listings/technology',
      permanent: true,
    },
    {
      source: '/all-listings',
      destination: '/listings',
      permanent: true,
    },
    {
      source: '/listing',
      destination: '/add-listing',
      permanent: true,
    },

    // KENYA LISTINGS (to /listings/category/slug)
    {
      source: '/manufacturing/hebatullah',
      destination: '/listings/manufacturing/hebatullah',
      permanent: true,
    },
    {
      source: '/technology/beem',
      destination: '/listings/technology/beem',
      permanent: true,
    },
    {
      source: '/services/ema-advisory',
      destination: '/listings/services/ema-advisory',
      permanent: true,
    },
    {
      source: '/manufacturing/saifee-chemicals',
      destination: '/listings/manufacturing/saifee-chemicals',
      permanent: true,
    },
    {
      source: '/technology/aqiq-solutions',
      destination: '/listings/technology/aqiq-solutions',
      permanent: true,
    },
    {
      source: '/real-estate/fairdeal-properties',
      destination: '/listings/real-estate/fairdeal-properties',
      permanent: true,
    },
    {
      source: '/services/african-quest-safaris',
      destination: '/listings/services/african-quest-safaris',
      permanent: true,
    },
    {
      source: '/shops-and-suppliers/mishkaat',
      destination: '/listings/shops-and-suppliers/mishkaat',
      permanent: true,
    },
    {
      source: '/shops-and-suppliers/nafees-creation',
      destination: '/listings/shops-and-suppliers/nafees-creation',
      permanent: true,
    },

    // GLOBAL LISTINGS (to /global-listings/category/slug)
    {
      source: '/manufacturing/rawat-foods',
      destination: '/global-listings/manufacturing/rawat-foods',
      permanent: true,
    },
    {
      source: '/manufacturing/royal-group-kenya',
      destination: '/global-listings/manufacturing/royal-group-kenya',
      permanent: true,
    },
    {
      source: '/manufacturing/unisaif-organic-cosmetics',
      destination: '/global-listings/manufacturing/unisaif-organic-cosmetics',
      permanent: true,
    },
    {
      source: '/real-estate/fakhruddin-properties',
      destination: '/global-listings/real-estate/fakhruddin-properties',
      permanent: true,
    },
  ]
},
};

export default nextConfig;