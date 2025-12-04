import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version || require('./package.json').version,
  },
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

export default withPWA(nextConfig);
