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
  async redirects() {
    return [
      {
        source: "/sitemap-index.xml",
        destination: "/sitemap",
        permanent: true,
      },
      {
        source: "/sitemap/:sitemapId(\\d+).xml",
        destination: "/sitemap/:sitemapId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
