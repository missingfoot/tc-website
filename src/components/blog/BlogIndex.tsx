import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { blogCategories, getPosts, toCard, type BlogCategory } from "@/lib/blog";
import { text } from "@/lib/styles";
import PostGrid from "./PostGrid";

// Each listing's title and line: the blog's own, or a category's
const headers: Record<BlogCategory | "all", { title: string; subtitle: string }> = {
  all: { title: "The Collective blog", subtitle: "Stories from our community, life in London, and news from The Collective." },
  news: { title: "News", subtitle: "The latest from The Collective: our buildings, projects and the company." },
  community: { title: "Community", subtitle: "Meet our members and hear what living and working with us is really like." },
  innovation: { title: "Innovation", subtitle: "The technology and ideas we’re working on to make shared living better." },
  "city-living": { title: "City Living", subtitle: "Tips, guides and inspiration for making the most of London." },
  "watch-and-listen": { title: "Watch & Listen", subtitle: "Playlists, performances and films from our community." },
};

/**
 * The blog's listing, all posts or one category's: a title, category links, then post cards. No
 * photo hero, so the posts start high on the page.
 */
export default async function BlogIndex({ category }: { category?: BlogCategory }) {
  const posts = (await getPosts()).filter((p) => !category || p.category === category);
  const header = headers[category ?? "all"];
  const links = [{ href: "/blog", label: "All", current: !category }, ...Object.entries(blogCategories).map(([slug, label]) => ({ href: `/blog/category/${slug}`, label, current: slug === category }))];

  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section>
        <Container>
          <h1 className="text-4xl font-bold leading-heading text-ink lg:text-5xl">{header.title}</h1>
          <p className={`mt-3 max-w-2xl ${text.body}`}>{header.subtitle}</p>
          <nav aria-label="Blog categories" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={`block rounded-full px-5 py-3 text-base font-medium whitespace-nowrap transition-colors ${link.current ? "bg-ink text-white" : "bg-cream text-ink hover:bg-cream-dark"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 lg:mt-12">
            <PostGrid posts={posts.map(toCard)} />
          </div>
        </Container>
      </Section>
    </>
  );
}
