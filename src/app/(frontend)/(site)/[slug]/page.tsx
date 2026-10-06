import { notFound, permanentRedirect } from "next/navigation";
import RenderBlocks from "@/components/payload/RenderBlocks";
import { getPage, getPageSlugs } from "@/lib/payload";

/**
 * Pages built in Payload (/admin → Pages), at /<slug>. Pre-built for every page that exists when the
 * site is built; a page created later is built on its first visit, and edits refresh it (see the
 * Pages collection's hooks). Pages written in code (e.g. /co-living) take priority over this route.
 */
export async function generateStaticParams() {
  return (await getPageSlugs()).filter((slug) => slug !== "home").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const page = await getPage((await params).slug);
  return page ? { title: page.title } : {};
}

export default async function PayloadPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  // The home page is served at / (app/(frontend)/(site)/page.tsx)
  if (slug === "home") permanentRedirect("/");
  const page = await getPage(slug);
  if (!page) notFound();
  return <RenderBlocks blocks={page.layout} />;
}
