import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local network use the dev server (live reload, dev assets), e.g. testing
  // on an iPhone at http://192.168.1.x:3000. Dev only; has no effect on production builds.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    // WebP only (Next's default): AVIF is smaller but far too slow to encode from large photos.
    // 75 is Next's default; 90 is used for large photos (hero, gallery) so they stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
