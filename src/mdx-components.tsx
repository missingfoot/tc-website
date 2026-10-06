import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import BlogImage from "@/components/blog/BlogImage";
import Embed from "@/components/blog/Embed";

/**
 * Components for MDX (blog posts in src/content/blog). Plain elements are styled by the post
 * page's prose classes; images, figures and embeds get components, and links to our own pages
 * use Next's Link while others open in a new tab.
 */
const components: MDXComponents = {
  img: ({ src, alt }) => <BlogImage src={String(src)} alt={alt} />,
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  Figure: BlogImage,
  Embed,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
