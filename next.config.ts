import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'files.gemasaputera.id',
      port: '',
      pathname: '/**',
    }],
  },
};

export default nextConfig;
