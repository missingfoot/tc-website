import type { Block, Field } from "payload";
import { iconField, itemLabel } from "./fields/shared";

// Sections for the Templates collection that fill themselves from the location (or room) being
// shown: placed in a template, they show that place's photo, intro, gallery, list, prices or
// directions. Their own fields are the words every page of that type shares.

const linkPicker = { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } };

export const LocationHeaderBlock: Block = {
  slug: "locationHeader",
  labels: { singular: "Location: header photo", plural: "Location: header photos" },
  fields: [],
};

export const LocationIntroBlock: Block = {
  slug: "locationIntro",
  labels: { singular: "Location: name and intro", plural: "Location: names and intros" },
  fields: [],
};

export const LocationGalleryBlock: Block = {
  slug: "locationGallery",
  labels: { singular: "Location: gallery", plural: "Location: galleries" },
  fields: [
    { name: "heading", type: "text", admin: { description: "Optional, e.g. “Explore the room”." } },
    {
      name: "tour",
      label: "3D tour button",
      type: "group",
      admin: { description: "Optional: a “View 3D Tour” button under the photos. Leave the link empty for none." },
      fields: [
        { name: "label", type: "text", defaultValue: "View 3D Tour" },
        { name: "href", label: "Link", type: "text", admin: linkPicker },
      ],
    },
  ],
};

export const LocationIncludedBlock: Block = {
  slug: "locationIncluded",
  labels: { singular: "Location: what's included", plural: "Location: what's included" },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "What’s included" },
    { name: "intro", type: "textarea" },
    {
      name: "standard",
      label: "Standard list",
      labels: { singular: "Item", plural: "Items" },
      type: "array",
      admin: { ...itemLabel("Item"), description: "Shown for a location without a list of its own (Locations → its Page tab)." },
      fields: [{ name: "label", type: "text", required: true }, iconField("", true)],
    },
  ],
};

export const LocationPricingBlock: Block = {
  slug: "locationPricing",
  labels: { singular: "Location: pricing", plural: "Location: pricing" },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "Pricing" },
    { name: "intro", type: "textarea" },
    { name: "note", label: "Note under the prices", type: "text", admin: { description: "Optional: a small line under the cards, e.g. “Prices exclude VAT.”" } },
    {
      name: "button",
      type: "group",
      fields: [
        {
          name: "opens",
          label: "The button",
          type: "radio",
          defaultValue: "enquiry",
          options: [
            { label: "Opens the enquiry form", value: "enquiry" },
            { label: "Goes to a link", value: "link" },
            { label: "No button", value: "none" },
          ],
          admin: { layout: "horizontal" },
        },
        { name: "href", label: "Link", type: "text", admin: { ...linkPicker, condition: (_, button) => button?.opens === "link" } },
        {
          name: "label",
          type: "text",
          admin: { condition: (_, button) => button?.opens !== "none", description: "For the enquiry form, leave empty for its usual label (e.g. “Get a free day trial”)." },
        },
      ],
    },
  ] as Field[],
};

export const LocationDirectionsBlock: Block = {
  slug: "locationDirections",
  labels: { singular: "Location: directions", plural: "Location: directions" },
  fields: [{ name: "heading", type: "text", required: true, defaultValue: "Well connected" }],
};

export const locationBlocks = [LocationHeaderBlock, LocationIntroBlock, LocationGalleryBlock, LocationIncludedBlock, LocationPricingBlock, LocationDirectionsBlock];

/** The location sections a room template can use: its main column (header, facts, booking) is fixed. */
export const roomLocationBlocks = [LocationGalleryBlock.slug];
