import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Media, Page } from "@/payload-types";
import type { CircleImage } from "@/lib/types";

/**
 * Reading Payload content on the server, through Payload's local API (no HTTP round trip: Payload
 * runs inside this Next app). Server only.
 */
const payload = () => getPayload({ config });

/** The Payload page with this slug, if there is one. */
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { docs } = await (await payload()).find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1, depth: 2 });
  return docs[0] ?? null;
});

/** Every Payload page's slug, for pre-building them. */
export async function getPageSlugs(): Promise<string[]> {
  const { docs } = await (await payload()).find({ collection: "pages", limit: 1000, depth: 0, select: { slug: true } });
  return docs.map((doc) => doc.slug);
}

/** An uploaded image as the site's image shape. Uploads are in public/media for this proof of concept. */
export function mediaImage(media: number | Media | null | undefined, position?: string | null): CircleImage {
  if (!media || typeof media === "number") return { src: "", alt: "" };
  return { src: `/media/${media.filename}`, alt: media.alt, blur: media.blur ?? undefined, position: (position ?? undefined) as CircleImage["position"] };
}

/** Body text as paragraphs: editors separate them with a blank line. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
