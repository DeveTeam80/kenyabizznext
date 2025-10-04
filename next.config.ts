import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/listings/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
        ]
      },
      {
        source: '/global-listings/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
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
