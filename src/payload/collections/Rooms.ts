import type { CollectionConfig, PayloadRequest } from "payload";
import type { Room } from "@/payload-types";
import { revalidatePath } from "next/cache";
import { iconField, itemLabel, slugField } from "../fields/shared";

/** A bedroom's page: under its building's co-living page (/locations/old-oak/rooms/ensuite). */
export const roomPath = (coliving: string, slug: string) => `/locations/${coliving}/rooms/${slug}`;

/** Refreshes a room's pre-built pages (its page and its apply page), and its building's co-living page with its card. */
async function refresh(req: PayloadRequest, building: Room["building"] | undefined, slug?: string | null) {
  if (!slug || !building) return;
  const found = typeof building === "object" ? building : await req.payload.findByID({ collection: "buildings", id: building, depth: 0, req }).catch(() => null);
  const coliving = found?.coliving;
  if (!coliving?.enabled || !coliving.slug) return;
  try {
    revalidatePath(roomPath(coliving.slug, slug));
    revalidatePath(`${roomPath(coliving.slug, slug)}/apply`);
    revalidatePath(`/locations/${coliving.slug}`);
    // {lowest-price:rooms} and the like can be in any page's text
    revalidatePath("/", "layout");
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

/**
 * Bedrooms, each in a building: its card (on the building's co-living page), its own page
 * (/locations/<co-living>/rooms/<slug>) and its booking (the apply pages). Drag to reorder: cards
 * follow this order.
 */
export const Rooms: CollectionConfig = {
  slug: "rooms",
  labels: { singular: "Bedroom", plural: "Bedrooms" },
  orderable: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "building", "updatedAt"], description: "Bedrooms, each in a building: their cards, their own pages and their booking." },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "building",
      type: "relationship",
      relationTo: "buildings",
      required: true,
      admin: { position: "sidebar", description: "The building it's in: its page is under the building's co-living page." },
    },
    slugField("The page's address under its building's co-living page: /locations/old-oak/rooms/ensuite for “ensuite”.", "building"),
    { name: "location", type: "text", required: true, defaultValue: "Old Oak, Willesden Junction", admin: { description: "Shown under the room's name." } },
    { name: "image", label: "Photo", type: "upload", relationTo: "media", required: true, admin: { description: "The card's photo, the page's header and the gallery's first photo." } },
    {
      name: "features",
      label: "Highlights",
      labels: { singular: "Highlight", plural: "Highlights" },
      type: "array",
      minRows: 1,
      maxRows: 4,
      admin: { ...itemLabel("Highlight"), description: "The card's tiles and the page's key facts (up to 4)." },
      fields: [{ name: "label", type: "text", required: true }, iconField("", true)],
    },
    { name: "about", label: "About the room", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
    {
      name: "photos",
      label: "More photos",
      type: "array",
      admin: { ...itemLabel("Photo"), description: "The gallery, after the room's photo." },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "name", type: "text", admin: { description: "Shown with the photo. Leave empty to use the photo's alt text." } },
      ],
    },
    { name: "floorPlan", type: "upload", relationTo: "media", admin: { description: "Optional: the floor plan drawing. Left out until there is one." } },
    // Rates are edited on the Pricing page (/admin/pricing); this shows them with a link there
    { name: "ratesNote", type: "ui", admin: { disableListColumn: true, components: { Field: "/payload/fields/PricesField#RoomPrices" } } },
    {
      name: "rates",
      label: "Rates",
      type: "array",
      admin: { hidden: true, description: "A weekly price per membership length, longest first. Edited on the Pricing page." },
      fields: [
        { name: "months", label: "Membership length (months)", type: "number", required: true, min: 1 },
        { name: "weekly", label: "Weekly price", type: "number", required: true, min: 0 },
      ],
    },
    // Booking details, to come from elsewhere: hidden here, kept for the booking card meanwhile
    { name: "moveIn", label: "Move in", type: "text", admin: { hidden: true } },
    { name: "floor", type: "text", admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        await refresh(req, doc.building, doc.slug);
        if (previousDoc && (previousDoc.slug !== doc.slug || previousDoc.building !== doc.building)) await refresh(req, previousDoc.building, previousDoc.slug);
      },
    ],
    afterDelete: [({ doc, req }) => refresh(req, doc.building, doc.slug)],
  },
};
