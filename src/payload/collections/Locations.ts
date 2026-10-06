import type { CollectionConfig, Field } from "payload";
import { revalidatePath } from "next/cache";
import { iconField, slugField } from "../fields/shared";

/** Where each type of location's listing and pages live. */
export const locationPaths = { working: "/working", serviced: "/serviced-living", venue: "/event-spaces" } as const;
export type LocationType = keyof typeof locationPaths;

/** Refreshes a location's pre-built page, and its type's listing (which shows its card). */
function refresh(type?: string | null, slug?: string | null) {
  const base = type ? locationPaths[type as LocationType] : undefined;
  if (!base || !slug) return;
  try {
    revalidatePath(`${base}/${slug}`);
    revalidatePath(base);
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

const itemLabel = (fallback: string) => ({
  initCollapsed: true,
  components: { RowLabel: { path: "/payload/fields/RowLabels#ItemLabel", clientProps: { fallback } } },
});

/** Icon-and-label items, e.g. a card's tiles or a list of facilities. */
const iconItems = (name: string, label: string, extra: Partial<Field> = {}): Field =>
  ({
    name,
    label,
    type: "array",
    admin: itemLabel("Item"),
    fields: [{ type: "row", fields: [{ name: "label", type: "text", required: true }, iconField("", true)] }],
    ...extra,
  }) as Field;

/**
 * Working spaces, serviced living houses and event venues: each one's card (on its type's page,
 * via the Location cards section) and its own page (/working/<slug> etc.). Held once here, so a
 * price or photo changes in one place. Drag to reorder: cards follow this order.
 */
export const Locations: CollectionConfig = {
  slug: "locations",
  orderable: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "area", "fromPrice"],
    description: "Working spaces, serviced living houses and event venues: their cards and their own pages.",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("The page's address after its type's, e.g. /working/bedford-square for “bedford-square”."),
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Working space", value: "working" },
        { label: "Serviced living", value: "serviced" },
        { label: "Event venue", value: "venue" },
      ],
      admin: { position: "sidebar" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Card",
          description: "How it shows on its type's page, and the top of its own page.",
          fields: [
            { type: "row", fields: [{ name: "area", type: "text", required: true, admin: { description: "Neighbourhood, e.g. Bloomsbury" } }, { name: "postcode", type: "text", required: true }] },
            { name: "fromPrice", label: "Price pill", type: "text", required: true, admin: { description: "e.g. “From £150 per month”, or a venue's capacity." } },
            { name: "image", type: "upload", relationTo: "media", required: true },
            iconItems("features", "Highlights", { maxRows: 4, minRows: 1, admin: { ...itemLabel("Highlight"), description: "Transport and key facilities: the card's tiles and the page header's rows (up to 4)." } }),
          ],
        },
        {
          label: "Page",
          fields: [
            { name: "intro", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
            {
              name: "gallery",
              type: "array",
              admin: itemLabel("Photo"),
              minRows: 1,
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true },
                { name: "name", type: "text", admin: { description: "Shown with the photo, e.g. “Lounge area”. Leave empty to use the photo's alt text." } },
              ],
            },
            {
              name: "prices",
              type: "array",
              admin: { ...itemLabel("Price"), description: "Pricing cards. Leave empty to leave pricing out (e.g. venues, priced on request)." },
              fields: [{ type: "row", fields: [{ name: "label", type: "text", required: true }, { name: "amount", type: "text", required: true }, { name: "period", type: "text", required: true }] }],
            },
            {
              name: "included",
              label: "What's included",
              type: "array",
              admin: {
                ...itemLabel("Group"),
                description: "Facilities, in groups (a label is optional). Working spaces can leave it empty to show the standard list every working space has.",
              },
              fields: [{ name: "label", type: "text" }, iconItems("items", "Items")],
            },
          ],
        },
        {
          label: "Directions",
          fields: [
            { name: "address", type: "text", admin: { description: "Street address: drives the map and the “open in Maps” links. Without one, the map is left out." } },
            { name: "directionsIntro", label: "Intro", type: "textarea", required: true },
            {
              name: "travelModes",
              label: "Ways to get there",
              type: "array",
              admin: itemLabel("Way"),
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true },
                    {
                      name: "icon",
                      type: "select",
                      required: true,
                      options: [
                        { label: "Underground", value: "underground" },
                        { label: "Overground", value: "overground" },
                        { label: "Bus", value: "bus" },
                        { label: "Car", value: "car" },
                      ],
                    },
                  ],
                },
                { name: "steps", type: "textarea", required: true, admin: { description: "One step per line." } },
                { name: "mapsUrl", label: "Google Maps link", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refresh(doc.type, doc.slug);
        if (previousDoc && (previousDoc.slug !== doc.slug || previousDoc.type !== doc.type)) refresh(previousDoc.type, previousDoc.slug);
      },
    ],
    afterDelete: [({ doc }) => refresh(doc.type, doc.slug)],
  },
};
