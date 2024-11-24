import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/public/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/w500/**',
        search: '',
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  }
};

export default nextConfig;
