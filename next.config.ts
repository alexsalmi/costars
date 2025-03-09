import type { NextConfig } from 'next';
import { withPlausibleProxy } from 'next-plausible';

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
        search: '',
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: '/js/script.outbound-links.tagged-events.js',
        destination: `${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}/js/script.outbound-links.tagged-events.js`,
      },
      {
        source: '/api/event', // Or '/api/event/' if you have `trailingSlash: true` in this config
        destination: `${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}/api/event`,
      },
      {
        source: '/proxy/api/event', // Or '/api/event/' if you have `trailingSlash: true` in this config
        destination: `${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}/api/event`,
      },
    ];
  },
};

export default withPlausibleProxy()(nextConfig);
