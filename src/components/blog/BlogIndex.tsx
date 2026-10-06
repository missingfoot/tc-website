import Link from "next/link";
import Hero from "@/components/sections/Hero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { blogCategories, getPosts, toCard, type BlogCategory } from "@/lib/blog";
import PostGrid from "./PostGrid";

const home = "/images/home";
// Each listing's header: the blog's own, or a category's
const headers: Record<BlogCategory | "all", { title: string; subtitle: string; image: string }> = {
  all: { title: "The Collective blog", subtitle: "Stories from our community, life in London, and news from The Collective.", image: `${home}/news.jpg` },
  news: { title: "News", subtitle: "The latest from The Collective: our buildings, projects and the company.", image: `${home}/news.jpg` },
  community: { title: "Community", subtitle: "Meet our members and hear what living and working with us is really like.", image: `${home}/community.jpg` },
  innovation: { title: "Innovation", subtitle: "The technology and ideas we’re working on to make shared living better.", image: `${home}/innovation.jpg` },
  "city-living": { title: "City Living", subtitle: "Tips, guides and inspiration for making the most of London.", image: `${home}/city-life.jpg` },
  "watch-and-listen": { title: "Watch & Listen", subtitle: "Playlists, performances and films from our community.", image: `${home}/community.jpg` },
};

/** The blog's listing, all posts or one category's: a header, category links, then post cards. */
export default async function BlogIndex({ category }: { category?: BlogCategory }) {
  const posts = (await getPosts()).filter((p) => !category || p.category === category);
  const header = headers[category ?? "all"];
  const links = [{ href: "/blog", label: "All", current: !category }, ...Object.entries(blogCategories).map(([slug, label]) => ({ href: `/blog/category/${slug}`, label, current: slug === category }))];

  return (
    <>
      <Hero image={header.image} title={header.title} subtitle={header.subtitle} />
      <Section raised>
        <Container>
          <nav aria-label="Blog categories">
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
