import type { CollectionConfig, Field } from "payload";
import { revalidatePath } from "next/cache";
import { iconField, itemLabel, moneyField, priceTerms, slugField, travelModes } from "../fields/shared";

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
    // {lowest-price:working:…} and the like can be in any page's text
    revalidatePath("/", "layout");
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

/** Icon-and-label items, e.g. a card's tiles or a list of facilities. */
const iconItems = (name: string, label: string, extra: Partial<Field> = {}): Field =>
  ({
    name,
    label,
    type: "array",
    admin: itemLabel("Item"),
    fields: [{ name: "label", type: "text", required: true }, iconField("", true)],
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
    defaultColumns: ["name", "type", "area", "updatedAt"],
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
            {
              name: "pill",
              label: "Card pill",
              type: "text",
              admin: { description: "Leave empty to show its lowest price (e.g. “From £150 per month”). Fill in for something else, like a venue's capacity (“Up to 225 guests”)." },
            },
            { name: "image", type: "upload", relationTo: "media", required: true },
            iconItems("features", "Highlights", { labels: { singular: "Highlight", plural: "Highlights" }, maxRows: 4, minRows: 1, admin: { ...itemLabel("Highlight"), description: "Transport and key facilities: the card's tiles and the page header's rows (up to 4)." } }),
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
            // Prices are edited on the Pricing page (/admin/pricing): this shows them, and offers to set them up
            { name: "pricesNote", type: "ui", admin: { components: { Field: "/payload/fields/PricesField#LocationPrices" } } },
            {
              name: "prices",
              type: "array",
              labels: { singular: "Price", plural: "Prices" },
              admin: {
                ...itemLabel("Price"),
                hidden: true,
                description: "Pricing cards, and the card pill's “From …”. Leave empty to leave pricing out (e.g. venues, priced on request).",
              },
              fields: [
                { name: "label", type: "text", required: true, admin: { description: "e.g. “Hot Desk”" } },
                { type: "row", fields: [moneyField("amount", "Amount"), ...priceTerms] },
                { name: "note", label: "Small print", type: "text", admin: { description: "Optional, after the period, e.g. “all bills included”." } },
              ],
            },
            {
              name: "included",
              label: "What's included",
              labels: { singular: "Group", plural: "Groups" },
              type: "array",
              admin: {
                ...itemLabel("Group", "No label"),
                initCollapsed: false,
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
            travelModes,
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
