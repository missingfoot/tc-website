import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { placeFields, placeSlug } from "../fields/place";

/**
 * Venue rooms, each in a building: its card (on the event spaces page, via the Location cards
 * section) and its own page (/event-spaces/<slug>). Drag to reorder.
 */
export const Venues: CollectionConfig = {
  slug: "venues",
  labels: { singular: "Venue room", plural: "Venue rooms" },
  orderable: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "building", "pill", "updatedAt"], description: "Rooms for events, each in a building: their cards and their own pages." },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "building",
      type: "relationship",
      relationTo: "buildings",
      required: true,
      admin: { position: "sidebar", description: "The building it's in: its address and ways to get there are the building's." },
    },
    placeSlug("venue", "", { admin: { position: "sidebar", description: "Its page's address: /event-spaces/the-den for “the-den”." } }),
    ...placeFields("venue"),
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
