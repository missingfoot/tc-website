import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { pageBlocks, withHeading } from "../blocks";
import { buildingLocationBlocks, locationBlocks, roomLocationBlocks } from "../templateBlocks";

/** The kinds of place with a template, and the route of their pages. */
const templateRoutes = {
  coliving: "/locations/[building]",
  room: "/locations/[building]/rooms/[slug]",
  working: "/working/[slug]",
  serviced: "/serviced-living/[slug]",
  venue: "/event-spaces/[slug]",
} as const;
export type TemplateType = keyof typeof templateRoutes;

/** Refreshes every page built from this type's template. */
function refresh(type?: string | null) {
  const route = type ? templateRoutes[type as TemplateType] : undefined;
  if (!route) return;
  try {
    revalidatePath(route, "page");
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

const blocks = [...locationBlocks.map(withHeading), ...pageBlocks];

/**
 * How every page of a kind of place is laid out: co-living and its bedrooms, working
 * spaces, serviced living houses and venues. A template is a list of sections like a page's: "Place" sections fill
 * themselves from the place being shown (its photos, intro, prices…), the rest show the same on
 * every one. One template per kind.
 */
export const Templates: CollectionConfig = {
  slug: "templates",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "updatedAt"],
    description: "The layout of every co-living's, bedroom's, working space's, house's and venue's page. Each place's own content (photos, prices, address…) is in Locations and Rooms.",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "type",
      label: "For",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Co-living", value: "coliving" },
        { label: "Bedrooms", value: "room" },
        { label: "Working spaces", value: "working" },
        { label: "Serviced living houses", value: "serviced" },
        { label: "Venues", value: "venue" },
      ],
      admin: { position: "sidebar", description: "The pages that use this template: one template each." },
    },
    {
      name: "floatingEnquiry",
      label: "Floating enquiry button",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        condition: (data) => data?.type !== "room",
        description: "An enquiry button that stays on screen on mobile (rooms have their own Apply bar).",
      },
    },
    {
      name: "roomColumn",
      label: "Room page main column",
      type: "group",
      admin: {
        condition: (data) => data?.type === "room",
        description: "The column beside the booking card, under each room's facts and description, and its building's “What's included” and “About” (Locations → the building → Room pages). The sections below come after it.",
      },
      fields: [
        { name: "coLivingAbout", label: "“About Co-living”", type: "textarea", admin: { description: "Leave a blank line between paragraphs." } },
      ],
    },
    {
      name: "layout",
      label: "Sections",
      type: "blocks",
      blocks,
      required: true,
      // A room's main column is fixed, so of the location sections its template only offers the gallery;
      // only a building has rooms to show
      filterOptions: ({ data }) =>
        blocks
          .map((b) => b.slug)
          .filter((slug) =>
            data?.type === "room" ? !slug.startsWith("location") || roomLocationBlocks.includes(slug) : data?.type === "coliving" || !buildingLocationBlocks.includes(slug),
          ),
      admin: { initCollapsed: true },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refresh(doc.type);
        if (previousDoc?.type && previousDoc.type !== doc.type) refresh(previousDoc.type);
      },
    ],
    afterDelete: [({ doc }) => refresh(doc.type)],
  },
};
