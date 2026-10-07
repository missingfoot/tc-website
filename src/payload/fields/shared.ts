import type { CollectionSlug, Field, PayloadRequest } from "payload";
import * as icons from "@/components/icons";

// Fields used in more than one place (page sections, locations).

/**
 * A list's items start collapsed, each header showing its name (see RowLabels.tsx), or e.g.
 * "Card 03" until it has one (or `unnamed`, for rows that may have no name on purpose).
 */
export const itemLabel = (fallback: string, unnamed?: string) => ({
  initCollapsed: true,
  components: { RowLabel: { path: "/payload/fields/RowLabels#ItemLabel", clientProps: { fallback, unnamed } } },
});

// Icons editors can pick: everything in the icon set except interface controls and brand logos,
// which mean something else on the page
const notForContent = ["ArrowLeft", "ArrowRight", "Menu", "Close", "ChevronDown", "Download", "Search", "YouTube", "Facebook", "Instagram", "Twitter", "VisaLogo", "MastercardLogo", "AmexLogo"];
export const contentIcons = Object.keys(icons).filter((name) => !notForContent.includes(name));

/** An icon picked from a searchable grid of the icons themselves (IconPicker.tsx); stores its name. */
export const iconField = (description: string, required = false): Field => ({
  name: "icon",
  type: "select",
  required,
  options: contentIcons,
  admin: { description, components: { Field: "/payload/fields/IconPicker#IconPicker" } },
});

/** An amount of money: typed in pounds, stored as whole pence (MoneyField.tsx). */
export const moneyField = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: "number",
  required: true,
  min: 0,
  admin: { description, components: { Field: "/payload/fields/MoneyField#MoneyField" } },
});

/** What a price is for, and how VAT applies to it (lib/pricing.ts writes the words from these). */
export const priceTerms: Field[] = [
  {
    name: "per",
    type: "select",
    required: true,
    defaultValue: "month",
    options: [
      { label: "Per night", value: "night" },
      { label: "Per week", value: "week" },
      { label: "Per month", value: "month" },
      { label: "One-off", value: "once" },
    ],
  },
  {
    name: "vat",
    label: "VAT",
    type: "select",
    required: true,
    defaultValue: "included",
    options: [
      { label: "Included in the price", value: "included" },
      { label: "Added on top (shows “+VAT”)", value: "excluded" },
      { label: "Not charged", value: "none" },
    ],
  },
];

/** A URL slug: lowercase letters, numbers and hyphens. */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugFormat = "Use lowercase letters, numbers and hyphens, e.g. our-story";

/**
 * A URL slug: lowercase letters, numbers and hyphens, unique in its collection. With `within`,
 * unique only among documents with the same value of that field (a location's type, a room's
 * building), as their pages live under different addresses.
 */
export const slugField = (description: string, within?: string): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: !within,
  index: true,
  admin: { position: "sidebar", description },
  validate: async (value: unknown, { data, id, req, collectionSlug }: { data: Record<string, unknown>; id?: string | number; req: PayloadRequest; collectionSlug?: string }) => {
    if (typeof value !== "string" || !SLUG.test(value)) return slugFormat;
    if (!within || !collectionSlug) return true;
    const scope = data?.[within];
    const scopeId = scope && typeof scope === "object" ? (scope as { id: unknown }).id : scope;
    const { totalDocs } = await req.payload.count({
      collection: collectionSlug as CollectionSlug,
      where: { and: [{ slug: { equals: value } }, { [within]: { equals: scopeId } }, ...(id ? [{ id: { not_equals: id } }] : [])] },
      req,
    });
    return totalDocs === 0 || "Another one here already has this address: pick a different slug.";
  },
});

/** Ways to get somewhere (underground, bus…), each with steps and a Google Maps link. */
export const travelModes: Field = {
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
};
