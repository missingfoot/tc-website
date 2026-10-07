import type { CollectionConfig, Condition, Field, Tab } from "payload";
import { revalidatePath } from "next/cache";
import { travelModes } from "../fields/shared";
import { placeFields, placeSlug, type Offering } from "../fields/place";

/** Shown while the offering's tab is switched on. */
const enabled: Condition = (_, siblingData) => Boolean(siblingData?.enabled);

/** A building's offering: a tab, switched on with its box, with the place's slug, card, page and directions. */
function offeringTab(name: Offering, label: string, has: string, path: string, extra: Field[] = []): Tab {
  return {
    name,
    label,
    fields: [
      { name: "enabled", label: `This building has ${has}`, type: "checkbox" },
      ...extra,
      placeSlug(name, `Its page's address: ${path}<slug>.`, { admin: { condition: enabled, description: `Its page's address: ${path}<slug>.` } }),
      ...placeFields(name, enabled),
    ],
  };
}

/**
 * The physical buildings, each holding what's in it: its co-living (and its bedrooms), its working
 * space, its serviced living, and its venue rooms. Each offering is a tab of the building with its
 * own card and page; bedrooms and venue rooms are their own collections, listed in its Rooms tab.
 * Its address and ways to get there are shared by all of them (each one's directions and map).
 */
export const Buildings: CollectionConfig = {
  slug: "buildings",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "address", "updatedAt"],
    description: "The physical buildings: their co-living, working space and serviced living (each a tab), and their bedrooms and venue rooms.",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, admin: { description: "Also the name its co-living, working space or serviced living go by." } },
    {
      type: "tabs",
      tabs: [
        {
          label: "Getting there",
          description: "Shared by everything in the building: its directions sections, maps and “open in Maps” links.",
          fields: [
            { name: "address", type: "text", admin: { description: "Street address: drives the maps. Without one, directions sections are left out." } },
            travelModes,
          ],
        },
        offeringTab("coliving", "Co-living", "co-living", "/locations/", [
          {
            name: "comingSoon",
            label: "Coming soon",
            type: "checkbox",
            admin: { condition: enabled, description: "Not open yet: no page of its own, and its card offers the waitlist. Untick when it opens (once it has bedrooms)." },
          },
        ]),
        offeringTab("working", "Working space", "a working space", "/working/"),
        offeringTab("serviced", "Serviced living", "serviced living", "/serviced-living/"),
        {
          label: "Rooms",
          description: "Its bedrooms and venue rooms. Add one from its list: it's made in this building.",
          fields: [
            { name: "bedrooms", label: "Bedrooms", type: "join", collection: "rooms", on: "building", admin: { defaultColumns: ["name", "slug", "updatedAt"] } },
            { name: "venueRooms", label: "Venue rooms", type: "join", collection: "venues", on: "building", admin: { defaultColumns: ["name", "pill", "updatedAt"] } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          // Its offerings' pages and cards, and its address and directions on everything in it
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
