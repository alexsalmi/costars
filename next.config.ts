import type { NextConfig } from 'next';

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
        source: '/init-script.js',
        destination: `${process.env.NEXT_PUBLIC_UMAMI_DOMAIN}/init-script.js`,
      },
      {
        source: '/api/event', // Or '/api/event/' if you have `trailingSlash: true` in this config
        destination: `${process.env.NEXT_PUBLIC_UMAMI_DOMAIN}/api/event`,
      },
    ];
  },
};

export default nextConfig;
