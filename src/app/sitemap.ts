import type { MetadataRoute } from "next";
import { pageTitles } from "@/config/page-titles";
import { site } from "@/config/site";
import { getPosts } from "@/lib/blog";

/**
 * /sitemap.xml: every public page, so search engines find them all (blog posts with their dates).
 * Pages come from pageTitles, which lists each public page, detail pages included, from the same
 * data that builds them; the forms and the members' account are left out.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = new Map((await getPosts()).map((post) => [`/blog/${post.slug}`, post.date]));
  return Object.keys(pageTitles).map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: posts.get(path),
  }));
}
