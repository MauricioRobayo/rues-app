import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // dynamicIO: true,
    // ppr: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
      // hmrRefreshes: true,
    },
  },
};

export default nextConfig;
