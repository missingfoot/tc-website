import type { Block, Field } from "payload";
import { iconField, itemLabel } from "./fields/shared";

// Sections for the Templates collection that fill themselves from the location (or room) being
// shown: placed in a template, they show that place's photo, intro, gallery, list, prices,
// directions or rooms. Their own fields are the words every page of that type shares, where
// {name} is the place's name (e.g. “Co-living at {name}”).

const linkPicker = { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } };

export const LocationHeaderBlock: Block = {
  slug: "locationHeader",
  labels: { singular: "Place: header photo", plural: "Place: header photos" },
  fields: [],
};

export const LocationHeroBlock: Block = {
  slug: "locationHero",
  labels: { singular: "Place: hero (name over its photo)", plural: "Place: heroes" },
  fields: [
    { name: "subtitle", type: "text", admin: { description: "Under the name, e.g. “Live somewhere that's home, and so much more.”" } },
    { name: "enquiryButton", label: "Enquiry button", type: "checkbox", defaultValue: true, admin: { description: "Opens the enquiry form for its kind of place." } },
  ],
};

export const LocationIntroBlock: Block = {
  slug: "locationIntro",
  labels: { singular: "Place: name and intro", plural: "Place: names and intros" },
  fields: [],
};

export const LocationTextIntroBlock: Block = {
  slug: "locationTextIntro",
  labels: { singular: "Place: intro under a heading", plural: "Place: intros under a heading" },
  fields: [
    { name: "heading", type: "text", required: true, admin: { description: "Beside its intro, e.g. “Co-living at {name}”." } },
    { name: "enquiryButton", label: "Enquiry button", type: "checkbox", defaultValue: true },
  ],
};

export const LocationGalleryBlock: Block = {
  slug: "locationGallery",
  labels: { singular: "Place: gallery", plural: "Place: galleries" },
  fields: [
    { name: "heading", type: "text", admin: { description: "Optional, e.g. “Explore the room”." } },
    { name: "intro", type: "textarea" },
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
  labels: { singular: "Place: what's included", plural: "Place: what's included" },
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
  labels: { singular: "Place: pricing", plural: "Place: pricing" },
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
  labels: { singular: "Place: directions", plural: "Place: directions" },
  fields: [{ name: "heading", type: "text", required: true, defaultValue: "Well connected" }],
};

export const LocationRoomsBlock: Block = {
  slug: "locationRooms",
  labels: { singular: "Place: rooms", plural: "Place: rooms" },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "Explore the rooms" },
    { name: "intro", type: "textarea" },
    { name: "ctaLabel", label: "Card button", type: "text", defaultValue: "View Room" },
  ],
};

export const locationBlocks = [
  LocationHeaderBlock,
  LocationHeroBlock,
  LocationIntroBlock,
  LocationTextIntroBlock,
  LocationGalleryBlock,
  LocationIncludedBlock,
  LocationPricingBlock,
  LocationDirectionsBlock,
  LocationRoomsBlock,
];

/** Location sections only the co-living template can use. */
export const buildingLocationBlocks = [LocationRoomsBlock.slug];

/** The location sections a room template can use: its main column (header, facts, booking) is fixed. */
export const roomLocationBlocks = [LocationGalleryBlock.slug];
