import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Let phones on the local network use the dev server (live reload, dev assets), e.g. testing
  // on an iPhone at http://192.168.1.x:3000. Dev only; has no effect on production builds.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    // WebP only (Next's default): AVIF is smaller but far too slow to encode from large photos.
    // 75 is Next's default; 90 is used for large photos (hero, gallery) so they stay crisp.
    qualities: [75, 90],
  },
  // Keep every response (pages, images, videos) out of search results: this is a portfolio remake
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // The old site's addresses that moved, so links and search results still land on the right page
  async redirects() {
    const categories = "news|community|innovation|city-living|watch-and-listen";
    return [
      { source: "/co-living/old-oak", destination: "/locations/old-oak", permanent: true },
      { source: "/privacy-notice", destination: "/privacy", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/refer-a-friend/terms-and-conditions", destination: "/refer-a-friend/terms", permanent: true },
      // Old WordPress blog: posts lived under their category or their date; listings had tag, author and page views
      { source: `/blog/:category(${categories})/:slug`, destination: "/blog/:slug", permanent: true },
      { source: "/blog/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug", destination: "/blog/:slug", permanent: true },
      { source: `/blog/:category(${categories})`, destination: "/blog/category/:category", permanent: true },
      { source: "/blog/category/:category/page/:page", destination: "/blog/category/:category", permanent: true },
      { source: "/blog/:listing(tag|author|page)/:rest*", destination: "/blog", permanent: true },
    ];
  },
};

// Blog posts are MDX files in src/content/blog, imported by the blog pages (see mdx-components.tsx)
const withMDX = createMDX();

export default withMDX(nextConfig);
