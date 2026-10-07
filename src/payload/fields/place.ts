import type { CollectionSlug, Condition, Field, PayloadRequest } from "payload";
import { iconField, itemLabel } from "./shared";

// The fields of a place with a card and a page of its own: a building's co-living, working space
// or serviced living (each a tab of the building), or a venue room. Held once here so they match.

/** The kinds of place, and where their pages live (co-living's bedrooms are under its: /locations/old-oak/rooms/…). */
export const placePaths = { coliving: "/locations", working: "/working", serviced: "/serviced-living", venue: "/event-spaces" } as const;
export type PlaceKind = keyof typeof placePaths;

/** A building's offerings: each a tab of the building, switched on with its "enabled" box. */
export const offerings = ["coliving", "working", "serviced"] as const;
export type Offering = (typeof offerings)[number];

/** Icon-and-label items, e.g. a card's tiles or a list of facilities. */
const iconItems = (name: string, label: string, extra: Partial<Field> = {}): Field =>
  ({ name, label, type: "array", admin: itemLabel("Item"), fields: [{ name: "label", type: "text", required: true }, iconField("", true)], ...extra }) as Field;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * A place's slug: its page's address after its kind's (/working/bedford-square). Unique among its
 * kind: a venue room's among venue rooms, an offering's among buildings' same offering.
 */
export const placeSlug = (kind: PlaceKind, description: string, extra: Partial<Field> = {}): Field =>
  ({
    name: "slug",
    type: "text",
    required: true,
    index: kind === "venue",
    unique: kind === "venue",
    admin: { description },
    validate: async (value: unknown, { id, req }: { id?: number | string; req: PayloadRequest }) => {
      if (typeof value !== "string" || !SLUG.test(value)) return "Use lowercase letters, numbers and hyphens, e.g. bedford-square";
      if (kind === "venue") return true;
      const collection: CollectionSlug = "buildings";
      const { totalDocs } = await req.payload.count({
        collection,
        where: { and: [{ [`${kind}.slug`]: { equals: value } }, { [`${kind}.enabled`]: { equals: true } }, ...(id ? [{ id: { not_equals: id } }] : [])] },
        req,
      });
      return totalDocs === 0 || "Another building already uses this address for this: pick a different slug.";
    },
    ...extra,
  }) as Field;

/** These fields, each shown (and required) only when `when` is true: the ones in collapsibles and rows too. */
const shownWhen = (fields: Field[], when?: Condition): Field[] =>
  when
    ? fields.map((field) => {
        const shown = { ...field, admin: { ...field.admin, condition: when } } as Field;
        return field.type === "collapsible" || field.type === "row" ? ({ ...shown, fields: shownWhen(field.fields, when) } as Field) : shown;
      })
    : fields;

/**
 * A place's card, page and directions fields, for its kind: what its card and the top of its page
 * show, its intro, gallery and what's included, its prices (set on the Pricing page), and for
 * co-living what its bedrooms' pages say about it and its membership lengths. `when` shows them
 * only while it's switched on (a building's offering).
 */
export function placeFields(kind: PlaceKind, when?: Condition): Field[] {
  const priced = kind === "working" || kind === "serviced";
  const fields: Field[] = [
    {
      type: "collapsible",
      label: "Card",
      admin: { description: "How it shows on its kind's page, and the top of its own page." },
      fields: [
        { type: "row", fields: [{ name: "area", type: "text", required: true, admin: { description: "Neighbourhood, e.g. Bloomsbury" } }, { name: "postcode", type: "text", required: true }] },
        ...(kind === "coliving"
          ? []
          : [
              {
                name: "pill",
                label: "Card pill",
                type: "text",
                admin: {
                  description:
                    kind === "venue" ? "Its capacity, e.g. “Up to 225 guests”." : "Leave empty to show its lowest price (e.g. “From £150 per month”). Fill in for something else.",
                },
              } as Field,
            ]),
        { name: "image", type: "upload", relationTo: "media", required: true },
        ...(kind === "coliving"
          ? []
          : [
              iconItems("features", "Highlights", {
                labels: { singular: "Highlight", plural: "Highlights" },
                maxRows: 4,
                minRows: 1,
                admin: { ...itemLabel("Highlight"), description: "Transport and key facilities: the card's tiles and the page header's rows (up to 4)." },
              }),
            ]),
      ],
    },
    {
      type: "collapsible",
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
        ...(priced
          ? [
              // Prices are edited on the Pricing page (/admin/pricing): this shows them, with a link there
              { name: "pricesNote", type: "ui", admin: { disableListColumn: true, components: { Field: `/payload/fields/PricesField#${kind === "working" ? "WorkingPrices" : "ServicedPrices"}` } } } as Field,
              {
                name: "prices",
                type: "array",
                // Edited on the Pricing page: a plan of its kind's pricing structure, with its own price or the standard one (null)
                admin: { hidden: true },
                fields: [
                  { name: "plan", type: "text", required: true },
                  { name: "amount", type: "number", min: 0 },
                ],
              } as Field,
            ]
          : []),
        {
          name: "included",
          label: kind === "venue" ? "Capacity & facilities" : "What's included",
          labels: { singular: "Group", plural: "Groups" },
          type: "array",
          admin: {
            ...itemLabel("Group", "No label"),
            initCollapsed: false,
            description: "In groups (a label is optional). A working space can leave it empty to show the standard list every working space has.",
          },
          fields: [{ name: "label", type: "text" }, iconItems("items", "Items")],
        },
      ],
    },
    ...(kind === "coliving"
      ? [
          {
            type: "collapsible",
            label: "Bedroom pages",
            admin: { description: "What every one of its bedrooms' pages shows about it, beside the booking card." },
            fields: [
              iconItems("roomsIncluded", "What's included", { labels: { singular: "Item", plural: "Items" } }),
              {
                name: "about",
                label: "About the building",
                type: "group",
                fields: [
                  { name: "heading", type: "text", admin: { description: "e.g. “About Old Oak”. Leave empty to leave this part out." } },
                  { name: "text", type: "textarea", admin: { description: "Leave a blank line between paragraphs." } },
                  { name: "poster", label: "Video poster", type: "upload", relationTo: "media" },
                  { name: "video", label: "Video link", type: "text", admin: { description: "YouTube, Vimeo or an .mp4, played over the poster." } },
                ],
              },
              // Edited on the Pricing page (/admin/pricing): the lengths its bedrooms can be booked for
              { name: "roomLengths", type: "array", admin: { hidden: true }, fields: [{ name: "months", type: "number", required: true, min: 1 }] },
            ],
          } as Field,
        ]
      : []),
    {
      type: "collapsible",
      label: "Directions",
      fields: [
        { name: "directionsIntro", label: "Intro", type: "textarea", admin: { description: "The words above the map. The address and ways to get there are the building's (its Getting there tab)." } },
      ],
    },
  ];
  return shownWhen(fields, when);
}
