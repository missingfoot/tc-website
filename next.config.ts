import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP only (Next's default): AVIF is smaller but far too slow to encode from large photos.
    // 75 is Next's default; 90 is used for large photos (hero, gallery) so they stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
