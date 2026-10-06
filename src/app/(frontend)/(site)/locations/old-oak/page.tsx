import { notFound } from "next/navigation";
import { RenderPage } from "@/components/payload/RenderBlocks";
import { getPage } from "@/lib/payload";

export async function generateMetadata() {
  const page = await getPage("old-oak");
  return page ? { title: page.title } : {};
}

/** Old Oak's page: the Payload page with the slug "old-oak" (/admin → Pages → Old Oak), served here. */
export default async function OldOak() {
  const page = await getPage("old-oak");
  if (!page) notFound();
  return <RenderPage page={page} />;
}
