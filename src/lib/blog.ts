import { readdirSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import authors from "@/content/blog/authors.json";
import images from "@/content/blog/images.json";

/**
 * The blog: one MDX file per post in src/content/blog, each exporting its `metadata` (title,
 * date, category, author, excerpt, tags, cover) above the post in Markdown. Images live in
 * public/images/blog/<slug>/; `npm run blur` records their sizes and previews in images.json.
 * Imported from the old WordPress blog by scripts/import-blog.mjs. Server only (reads the folder).
 */

export const blogCategories = {
  news: "News",
  community: "Community",
  innovation: "Innovation",
  "city-living": "City Living",
  "watch-and-listen": "Watch & Listen",
} as const;
export type BlogCategory = keyof typeof blogCategories;

export type PostMetadata = {
  title: string;
  /** ISO date, e.g. "2018-06-15". */
  date: string;
  category: BlogCategory;
  /** A name in authors.json (for their photo). */
  author: string;
  /** A sentence or two for cards, search results and link previews. */
  excerpt: string;
  tags: string[];
  /** Path in public/images/blog. */
  cover: string | null;
};
export type Post = PostMetadata & { slug: string };

/** A blog image's size and blurred preview (from images.json), if `npm run blur` has seen it. */
export function blogImage(src: string): { width: number; height: number; blur: string } | undefined {
  return (images as Record<string, { width: number; height: number; blur: string }>)[src];
}

/** An author's photo, if we have one. */
export function authorPhoto(name: string): string | undefined {
  return (authors as Record<string, { avatar: string | null }>)[name]?.avatar ?? undefined;
}

const dir = path.join(process.cwd(), "src/content/blog");
export const postSlugs = () =>
  readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));

/** The post's content (as a component) and metadata. */
export async function loadPost(slug: string) {
  const mod: { default: React.ComponentType; metadata: PostMetadata } = await import(`@/content/blog/${slug}.mdx`);
  return { Content: mod.default, post: { slug, ...mod.metadata } satisfies Post };
}

/** Every post, newest first. */
export const getPosts = cache(async (): Promise<Post[]> => {
  const posts = await Promise.all(postSlugs().map(async (slug) => (await loadPost(slug)).post));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
});

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
/** "15 June 2018" */
export const formatPostDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));

/** A post as a card's plain data (dates formatted, cover preview looked up). */
export function toCard(post: Post) {
  return {
    slug: post.slug,
    title: post.title,
    date: formatPostDate(post.date),
    category: blogCategories[post.category],
    author: post.author,
    cover: post.cover ? { src: post.cover, blur: blogImage(post.cover)?.blur } : null,
  };
}
