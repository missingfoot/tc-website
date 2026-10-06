import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** /robots.txt: everything may be crawled except the members' account; points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/account" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
