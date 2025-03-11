import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
