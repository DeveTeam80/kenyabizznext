import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Redirects for your main listing categories
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
      }
    ]
  },
};

export default nextConfig;
