import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { iconField, itemLabel, slugField } from "../fields/shared";

/** Where the rooms' building page and their own pages live. */
export const roomsPath = "/locations/old-oak";

/** Refreshes a room's pre-built pages (its page and its apply page), and the building's page with its card. */
function refresh(slug?: string | null) {
  if (!slug) return;
  try {
    revalidatePath(`${roomsPath}/rooms/${slug}`);
    revalidatePath(`${roomsPath}/rooms/${slug}/apply`);
    revalidatePath(roomsPath);
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

/**
 * Old Oak's co-living rooms: each one's card (via the Room cards section), its own page
 * (/locations/old-oak/rooms/<slug>) and its booking (the apply pages). Drag to reorder: cards
 * follow this order.
 */
export const Rooms: CollectionConfig = {
  slug: "rooms",
  orderable: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "price", "updatedAt"], description: "Old Oak's rooms: their cards, their own pages and their booking." },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("The page's address: /locations/old-oak/rooms/ensuite for “ensuite”."),
    {
      type: "row",
      fields: [
        { name: "price", type: "text", required: true, admin: { description: "Weekly, e.g. “£245”. The card shows “£245 per week”." } },
        { name: "location", type: "text", required: true, defaultValue: "Old Oak, Willesden Junction", admin: { description: "Shown under the room's name." } },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Room",
          fields: [
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
          ],
        },
        {
          label: "Booking",
          fields: [
            {
              type: "row",
              fields: [
                { name: "moveIn", label: "Move in", type: "text", required: true, admin: { description: "e.g. “Available now”" } },
                { name: "floor", type: "text", required: true, admin: { description: "e.g. “17–19”" } },
              ],
            },
            { name: "periods", label: "Membership lengths", type: "textarea", required: true, admin: { description: "One per line, e.g. “12 months”. The first is picked to start with." } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refresh(doc.slug);
        if (previousDoc && previousDoc.slug !== doc.slug) refresh(previousDoc.slug);
      },
    ],
    afterDelete: [({ doc }) => refresh(doc.slug)],
  },
};
