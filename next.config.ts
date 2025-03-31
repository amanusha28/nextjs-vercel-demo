import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  experimental: {
    ppr: 'incremental'
  }
};

export default nextConfig;
