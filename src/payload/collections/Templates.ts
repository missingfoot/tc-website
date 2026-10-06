import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { pageBlocks, withHeading } from "../blocks";
import { iconField, itemLabel } from "../fields/shared";
import { locationBlocks, roomLocationBlocks } from "../templateBlocks";
import { locationPaths } from "./Locations";
import { roomsPath } from "./Rooms";

/** The kinds of place with a template, and where their pages live. */
const templatePaths = { ...locationPaths, room: `${roomsPath}/rooms` } as const;
export type TemplateType = keyof typeof templatePaths;

/** Refreshes every page built from this type's template. */
function refresh(type?: string | null) {
  const base = type ? templatePaths[type as TemplateType] : undefined;
  if (!base) return;
  try {
    revalidatePath(`${base}/[slug]`, "page");
  } catch {
    // Outside Next (e.g. the seed script) there's no page cache to refresh
  }
}

const blocks = [...locationBlocks.map(withHeading), ...pageBlocks];

/**
 * How every page of a kind of place is laid out: working spaces, serviced living houses, venues
 * and Old Oak rooms. A template is a list of sections like a page's: "Location" sections fill
 * themselves from the place being shown (its photos, intro, prices…), the rest show the same on
 * every one. One template per kind.
 */
export const Templates: CollectionConfig = {
  slug: "templates",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "updatedAt"],
    description: "The layout of every working space's, house's, venue's and room's page. Each place's own content (photos, prices, address…) is in Locations and Rooms.",
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
        { label: "Working spaces", value: "working" },
        { label: "Serviced living houses", value: "serviced" },
        { label: "Venues", value: "venue" },
        { label: "Old Oak rooms", value: "room" },
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
        description: "The column beside the booking card, under each room's facts and description. The sections below come after it.",
      },
      fields: [
        {
          name: "included",
          label: "What's included",
          labels: { singular: "Item", plural: "Items" },
          type: "array",
          admin: itemLabel("Item"),
          fields: [{ name: "label", type: "text", required: true }, iconField("", true)],
        },
        {
          name: "about",
          label: "About the building",
          type: "group",
          fields: [
            { name: "heading", type: "text" },
            { name: "text", type: "textarea", admin: { description: "Leave a blank line between paragraphs." } },
            { name: "poster", label: "Video poster", type: "upload", relationTo: "media" },
            { name: "video", label: "Video link", type: "text", admin: { description: "YouTube, Vimeo or an .mp4, played over the poster." } },
          ],
        },
        { name: "coLivingAbout", label: "“About Co-living”", type: "textarea", admin: { description: "Leave a blank line between paragraphs." } },
      ],
    },
    {
      name: "layout",
      label: "Sections",
      type: "blocks",
      blocks,
      required: true,
      // A room's main column is fixed, so of the location sections its template only offers the gallery
      filterOptions: ({ data }) =>
        data?.type === "room" ? blocks.map((b) => b.slug).filter((slug) => !slug.startsWith("location") || roomLocationBlocks.includes(slug)) : true,
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
