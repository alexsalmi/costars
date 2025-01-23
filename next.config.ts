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
  experimental: {
    ppr: 'incremental',
  },
};

export default withPlausibleProxy()(nextConfig);
