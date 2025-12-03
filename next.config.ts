import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'otakudesu.best',
      },
      {
        protocol: 'https',
        hostname: '**.otakudesu.best',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.otakudesu.cloud',
      },
    ],
  },
};

export default nextConfig;
