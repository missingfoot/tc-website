import { notFound } from "next/navigation";
import RenderBlocks from "@/components/payload/RenderBlocks";
import { getPage } from "@/lib/payload";

/**
 * The home page: the Payload page with the slug "home" (/admin → Pages → Home), served here at /
 * rather than at /home. Its title isn't used: the home page keeps the site's own.
 */
export default async function Home() {
  const page = await getPage("home");
  if (!page) notFound();
  return <RenderBlocks blocks={page.layout} />;
}
