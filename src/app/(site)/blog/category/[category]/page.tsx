import BlogIndex from "@/components/blog/BlogIndex";
import { blogCategories, type BlogCategory } from "@/lib/blog";

export function generateStaticParams() {
  return Object.keys(blogCategories).map((category) => ({ category }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  return { title: `${blogCategories[category as BlogCategory]} | Blog` };
}

/** One category's posts. */
export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  return <BlogIndex category={category as BlogCategory} />;
}
