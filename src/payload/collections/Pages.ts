import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { pageBlocks } from "../blocks";
import { slugField } from "../fields/shared";

/** Refreshes a page's pre-built HTML after an edit, so the change shows straight away. */
function refresh(slug?: string | null) {
  if (!slug) return;
  try {
    revalidatePath(slug === "home" ? "/" : `/${slug}`);
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

/**
 * Marketing pages built from blocks (see blocks.ts), served at /<slug> by
 * app/(frontend)/(site)/[slug]. Pages written in code (e.g. /co-living) take priority over a
 * Payload page with the same slug.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { useAsTitle: "title", defaultColumns: ["title", "slug", "updatedAt"] },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true, admin: { description: "The browser tab title, and the page's name here." } },
    slugField("The page's address: /foundation for “foundation”. Lowercase letters, numbers and hyphens."),
    // Sections start collapsed, so a page reads as a list of its sections (headers show each one's heading)
    { name: "layout", label: "Sections", type: "blocks", blocks: pageBlocks, required: true, admin: { initCollapsed: true } },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refresh(doc.slug);
        if (previousDoc?.slug !== doc.slug) refresh(previousDoc?.slug);
      },
    ],
    afterDelete: [({ doc }) => refresh(doc.slug)],
  },
};
