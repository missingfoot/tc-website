import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
import BlogImage from "@/components/blog/BlogImage";
import PostCard from "@/components/blog/PostCard";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { authorPhoto, blogCategories, formatPostDate, getPosts, loadPost, postSlugs, toCard } from "@/lib/blog";

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { post } = await loadPost((await params).slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, images: post.cover ? [post.cover] : [] },
  };
}

// The post's plain elements (from Markdown), styled here so posts stay plain Markdown
const prose = [
  "flex flex-col gap-6 text-lg leading-relaxed text-ink/80",
  "[&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-heading [&_h2]:text-ink",
  "[&_h3]:mt-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-heading [&_h3]:text-ink",
  "[&_strong]:font-bold [&_strong]:text-ink",
  "[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-70",
  // Pull quotes: big and bold, with a rule down the side
  "[&_blockquote]:border-l-2 [&_blockquote]:border-ink [&_blockquote]:pl-6 [&_blockquote]:text-2xl [&_blockquote]:font-bold [&_blockquote]:leading-heading [&_blockquote]:text-ink [&_blockquote_p+p]:mt-4",
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6 [&_li]:marker:text-ink/40",
  "[&_hr]:border-ink/10",
].join(" ");

/** A blog post: category, title, author and date, cover photo, the post, its tags and more posts. */
export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { Content, post } = await loadPost((await params).slug);
  const photo = authorPhoto(post.author);
  // More from the same category (newest first), topped up with the latest posts if it's a small one
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  const more = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);

  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section>
        <Container>
          <article>
            {/* A narrow column for comfortable reading; the cover is a little wider */}
            <header className="mx-auto max-w-3xl">
              <Link href={`/blog/category/${post.category}`} className="inline-flex items-center gap-2 text-base font-medium text-ink hover:opacity-70">
                <ArrowLeft />
                {blogCategories[post.category]}
              </Link>
              <h1 className="mt-6 text-4xl font-bold leading-heading text-ink lg:text-5xl">{post.title}</h1>
              <div className="mt-6 flex items-center gap-3">
                {photo && <Image src={photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />}
                <p className="text-base text-stone">
                  <span className="font-medium text-ink">{post.author}</span>
                  <br />
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </p>
              </div>
            </header>

            {post.cover && (
              <div className="mx-auto mt-10 max-w-5xl lg:mt-12">
                <BlogImage src={post.cover} alt="" />
              </div>
            )}

            <div className={`mx-auto mt-10 max-w-3xl lg:mt-12 ${prose}`}>
              <Content />
            </div>

            {post.tags.length > 0 && (
              <ul aria-label="Tags" className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-cream px-4 py-1.5 text-sm font-medium text-ink">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionIntro heading="More from the blog" />
          <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={toCard(p)} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
