import type { MetadataRoute } from "next";

/**
 * /robots.txt: asks every crawler to stay out of the whole site. This is a portfolio remake of
 * The Collective's site, so it shouldn't show up in search results; every page is also marked
 * noindex (root layout metadata, and an X-Robots-Tag header in next.config.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
