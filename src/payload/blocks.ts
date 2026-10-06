import type { Block, Field } from "payload";
import { iconField, itemLabel, travelModes } from "./fields/shared";

// Page blocks: one per section component, with the same content its props take. Pages are a list
// of these, so editors pick, order and fill in sections while the design stays in code.

const tone: Field = {
  name: "tone",
  type: "select",
  defaultValue: "white",
  options: [
    { label: "White", value: "white" },
    { label: "Cream", value: "cream" },
  ],
  admin: { description: "Background colour. Alternate them down the page." },
};

const body: Field = {
  name: "body",
  type: "textarea",
  required: true,
  admin: { description: "Leave a blank line between paragraphs." },
};

const image = (name: string, label?: string): Field => ({ name, label, type: "upload", relationTo: "media", required: true });

const position: Field = {
  name: "position",
  type: "select",
  options: [
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ],
  admin: { isClearable: true, placeholder: "Centred", description: "Which edge of the photo stays in view when it's cropped. Clear it (×) to centre it again." },
};

const cta: Field = {
  name: "cta",
  label: "Button",
  type: "group",
  admin: { description: "Optional: leave both empty for no button." },
  fields: [
    { name: "label", type: "text" },
    { name: "href", label: "Link", type: "text", admin: { description: "A page, another site, mailto:… or #section", components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } },
  ],
};

// Enquiry forms a button can open instead of linking to a page
const enquiryKinds = [
  { label: "Co-living enquiry", value: "living" },
  { label: "Working enquiry", value: "working" },
  { label: "Serviced living enquiry", value: "serviced" },
  { label: "Events enquiry", value: "events" },
  { label: "Waitlist", value: "waitlist" },
];

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    { name: "eyebrow", type: "text", admin: { description: "Optional: a short line above the title." } },
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea" },
    image("image"),
    { ...position, name: "imagePosition", label: "Image position" },
    {
      name: "button",
      type: "group",
      fields: [
        {
          name: "type",
          label: "Button",
          type: "radio",
          defaultValue: "none",
          options: [
            { label: "None", value: "none" },
            { label: "Button", value: "button" },
            { label: "Video button", value: "video" },
          ],
          admin: { layout: "horizontal", description: "A video button has a play icon and opens the video over the page." },
        },
        {
          name: "opens",
          label: "Goes to",
          type: "radio",
          defaultValue: "link",
          options: [
            { label: "A link", value: "link" },
            { label: "An enquiry form", value: "enquiry" },
          ],
          admin: { layout: "horizontal", condition: (_, button) => button?.type === "button" },
        },
        {
          name: "href",
          label: "Link",
          type: "text",
          admin: {
            condition: (_, button) => button?.type === "button" && button?.opens !== "enquiry",
            description: "A page, another site, mailto:… or #section",
            components: { Field: "/payload/fields/LinkPicker#LinkPicker" },
          },
        },
        { name: "enquiry", label: "Enquiry form", type: "select", options: enquiryKinds, admin: { condition: (_, button) => button?.type === "button" && button?.opens === "enquiry" } },
        { name: "videoUrl", label: "Video link", type: "text", admin: { condition: (_, button) => button?.type === "video", description: "YouTube, Vimeo or an .mp4" } },
        {
          name: "label",
          type: "text",
          admin: {
            condition: (_, button) => button?.type === "button" || button?.type === "video",
            description: "For an enquiry form, leave empty to use the form's usual label (e.g. “Book a viewing”).",
          },
        },
        { name: "arrow", label: "Show arrow icon", type: "checkbox", defaultValue: true, admin: { condition: (_, button) => button?.type === "button" } },
      ],
    },
  ],
};

export const IntroBlock: Block = {
  slug: "intro",
  labels: { singular: "Intro", plural: "Intros" },
  fields: [
    { name: "heading", type: "text", required: true },
    body,
    {
      name: "layout",
      type: "select",
      defaultValue: "split",
      options: [
        { label: "Split: heading beside the text (short headings)", value: "split" },
        { label: "Stacked: heading above the text (long headings)", value: "stacked" },
      ],
    },
    {
      name: "buttons",
      type: "select",
      defaultValue: "light",
      options: [
        { label: "The button below, light", value: "light" },
        { label: "The button below, dark", value: "dark" },
        { label: "Call us, email us and apply", value: "contact" },
        { label: "An enquiry form's button", value: "enquiry" },
      ],
    },
    { ...cta, admin: { ...cta.admin, condition: (_, block) => block?.buttons !== "contact" && block?.buttons !== "enquiry" } },
    { name: "enquiry", label: "The button opens", type: "select", options: enquiryKinds, admin: { isClearable: true, condition: (_, block) => block?.buttons === "enquiry" } },
    tone,
  ],
};

export const CollageSplitBlock: Block = {
  slug: "collageSplit",
  labels: { singular: "Text with photo collage", plural: "Texts with photo collage" },
  fields: [
    { name: "heading", type: "text", required: true },
    body,
    {
      name: "images",
      label: "Collage",
      type: "group",
      fields: [
        { type: "row", fields: [image("main", "Large photo"), image("top", "Small photo (top)"), image("bottom", "Small photo (bottom)")] },
      ],
    },
    {
      name: "side",
      type: "select",
      defaultValue: "left",
      options: [
        { label: "Collage on the left", value: "left" },
        { label: "Collage on the right", value: "right" },
      ],
    },
    cta,
    tone,
  ],
};

export const PromoCardsBlock: Block = {
  slug: "promoCards",
  labels: { singular: "Promo cards", plural: "Promo cards" },
  fields: [
    {
      name: "cards",
      type: "array",
      admin: itemLabel("Card"),
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: "heading", type: "text", required: true },
        image("image"),
        position,
        { type: "row", fields: [{ name: "ctaLabel", label: "Button label", type: "text", required: true }, { name: "ctaHref", label: "Button link", type: "text", required: true, admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } }] },
        { name: "enquiry", label: "Button opens", type: "select", options: enquiryKinds, admin: { isClearable: true, description: "Optional: an enquiry form instead of the link (which then isn't used)." } },
      ],
    },
    {
      name: "mobileShape",
      label: "Photo shape on mobile",
      type: "select",
      defaultValue: "short",
      options: [
        { label: "Short (4:3)", value: "short" },
        { label: "Tall (4:5)", value: "tall" },
      ],
    },
    tone,
  ],
};

export const SocialLinksBlock: Block = {
  slug: "socialLinks",
  labels: { singular: "Social links", plural: "Social links" },
  fields: [
    { name: "heading", type: "text", defaultValue: "Connect with us", required: true },
    { name: "intro", type: "textarea", defaultValue: "Keep up with what we are up to on social media, and get the chance to get promotions!" },
  ],
};


const intro: Field = { name: "intro", type: "textarea" };

export const ChecklistBlock: Block = {
  slug: "checklist",
  labels: { singular: "Checklist", plural: "Checklists" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "items",
      type: "array",
      admin: itemLabel("Value"),
      minRows: 1,
      fields: [
        iconField("Optional: shown beside the item."),
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
      ],
    },
    tone,
  ],
};

export const LinkCardsBlock: Block = {
  slug: "linkCards",
  labels: { singular: "Link cards", plural: "Link cards" },
  fields: [
    { name: "heading", type: "text" },
    intro,
    {
      name: "cards",
      type: "array",
      admin: itemLabel("Card"),
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
        image("image"),
        position,
        { type: "row", fields: [{ name: "ctaLabel", label: "Button label", type: "text", required: true }, { name: "ctaHref", label: "Button link", type: "text", required: true, admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } }] },
      ],
    },
    {
      name: "moreLink",
      label: "Link under the cards",
      type: "group",
      admin: { description: "Optional, e.g. “Read more press articles”." },
      fields: [{ type: "row", fields: [{ name: "label", type: "text" }, { name: "href", label: "Link", type: "text", admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } }] }],
    },
    {
      type: "row",
      fields: [
        { name: "cardStyle", label: "Card colour", type: "select", defaultValue: "dark", options: [{ label: "Dark", value: "dark" }, { label: "Light", value: "light" }] },
        { name: "imageShape", label: "Photo shape", type: "select", defaultValue: "wide", options: [{ label: "Wide (16:9)", value: "wide" }, { label: "Tall (5:4)", value: "tall" }] },
      ],
    },
    tone,
  ],
};

export const PressQuotesBlock: Block = {
  slug: "pressQuotes",
  labels: { singular: "Press quotes", plural: "Press quotes" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "quotes",
      type: "array",
      admin: itemLabel("Quote"),
      minRows: 1,
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "publication", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media", admin: { description: "Optional: the publication's logo, ideally an SVG. Without one, its name is shown." } },
      ],
    },
    tone,
  ],
};

export const TeamGridBlock: Block = {
  slug: "teamGrid",
  labels: { singular: "Team grid", plural: "Team grids" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "people",
      type: "array",
      admin: itemLabel("Person"),
      minRows: 1,
      fields: [
        { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "role", type: "text", required: true }] },
        image("photo"),
        position,
      ],
    },
    tone,
  ],
};

const faqItems: Field = {
  name: "items",
  label: "Questions",
  type: "array",
  admin: itemLabel("Question"),
  minRows: 1,
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
    { name: "numbered", type: "checkbox", label: "Show the answer's paragraphs as a numbered list" },
  ],
};

export const TestimonialsBlock: Block = {
  slug: "testimonials",
  labels: { singular: "Testimonials", plural: "Testimonials" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "people",
      type: "array",
      admin: itemLabel("Person"),
      minRows: 1,
      fields: [
        { name: "name", type: "text", required: true },
        image("photo"),
        { name: "video", type: "text", admin: { description: "Optional: their video, as a YouTube or Vimeo link or an .mp4." } },
      ],
    },
    { ...tone, defaultValue: "cream" },
  ],
};

export const FaqBlock: Block = {
  slug: "faq",
  labels: { singular: "FAQ", plural: "FAQs" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    faqItems,
    { name: "outro", type: "textarea", admin: { description: "Optional: a closing line under the questions." } },
    { ...cta, admin: { description: "Optional: a button under the questions." } },
    { name: "anchor", type: "text", admin: { description: "Optional: link straight here with #anchor, e.g. “faq” for a “Read more” button linking to #faq." } },
    tone,
  ],
};

export const FaqDirectoryBlock: Block = {
  slug: "faqDirectory",
  labels: { singular: "FAQ directory", plural: "FAQ directories" },
  fields: [
    {
      name: "topics",
      type: "array",
      admin: itemLabel("Topic"),
      minRows: 1,
      fields: [{ name: "topic", type: "text", required: true }, faqItems],
    },
    tone,
  ],
};

export const OpenPositionsBlock: Block = {
  slug: "openPositions",
  labels: { singular: "Open positions", plural: "Open positions" },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "Open positions", admin: { description: "Lists the job pages (written in code, in content/careers.ts). Link here with #open-positions." } },
    tone,
  ],
};

export const MediaKitBlock: Block = {
  slug: "mediaKit",
  labels: { singular: "Media kit", plural: "Media kits" },
  fields: [
    { name: "heading", type: "text", required: true, admin: { description: "The logos and photos to download are in code (content/press.ts)." } },
    intro,
    { ...tone, defaultValue: "cream" },
  ],
};

export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Gallery", plural: "Galleries" },
  fields: [
    { name: "heading", type: "text" },
    intro,
    {
      name: "photos",
      type: "array",
      admin: itemLabel("Photo"),
      minRows: 1,
      fields: [
        image("image"),
        { name: "name", type: "text", admin: { description: "Shown with the photo, e.g. “Lounge area”. Leave empty to use the photo's alt text." } },
      ],
    },
    {
      name: "tour",
      label: "3D tour button",
      type: "group",
      admin: { description: "Optional: a “View 3D Tour” button under the photos." },
      fields: [{ type: "row", fields: [{ name: "label", type: "text", defaultValue: "View 3D Tour" }, { name: "href", label: "Link", type: "text", admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } }] }],
    },
    { ...tone, defaultValue: "cream" },
  ],
};

export const FeatureGroupsBlock: Block = {
  slug: "featureGroups",
  labels: { singular: "Feature groups", plural: "Feature groups" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "groups",
      type: "array",
      admin: itemLabel("Group"),
      minRows: 1,
      fields: [
        { name: "label", type: "text", admin: { description: "Optional: a small label above the group." } },
        {
          name: "items",
          type: "array",
          admin: itemLabel("Item"),
          fields: [{ type: "row", fields: [{ name: "label", type: "text", required: true }, iconField("", true)] }],
        },
      ],
    },
    tone,
  ],
};

export const LocationCardsBlock: Block = {
  slug: "locationCards",
  labels: { singular: "Location cards", plural: "Location cards" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "locations",
      type: "relationship",
      relationTo: "locations",
      hasMany: true,
      required: true,
      admin: { description: "Cards for these locations (/admin → Locations), in this order. Each links to its own page." },
    },
    { name: "ctaLabel", label: "Button label", type: "text", defaultValue: "More info" },
    { ...tone, defaultValue: "cream" },
  ],
};

export const ImageCarouselBlock: Block = {
  slug: "imageCarousel",
  labels: { singular: "Image carousel", plural: "Image carousels" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    { name: "photos", type: "array", admin: itemLabel("Photo"), minRows: 1, fields: [image("image")] },
    {
      name: "footer",
      label: "Line underneath",
      type: "group",
      admin: { description: "Optional: text ending in a link, e.g. “…following us on Instagram @thecollective_living”." },
      fields: [
        { name: "text", type: "text" },
        { type: "row", fields: [{ name: "linkLabel", label: "Link text", type: "text" }, { name: "linkHref", label: "Link", type: "text", admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } }] },
      ],
    },
    tone,
  ],
};

export const PerkCardsBlock: Block = {
  slug: "perkCards",
  labels: { singular: "Perk cards", plural: "Perk cards" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "perks",
      type: "array",
      admin: itemLabel("Perk"),
      minRows: 1,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
        image("image"),
        { name: "logo", type: "upload", relationTo: "media", admin: { description: "Optional: the partner's logo, shown on the photo." } },
      ],
    },
    { ...tone, defaultValue: "cream" },
  ],
};

export const RoomCardsBlock: Block = {
  slug: "roomCards",
  labels: { singular: "Room cards", plural: "Room cards" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "rooms",
      type: "relationship",
      relationTo: "rooms",
      hasMany: true,
      required: true,
      admin: { description: "Cards for these rooms (/admin → Rooms), in this order. Each links to its own page." },
    },
    { name: "ctaLabel", label: "Button label", type: "text", defaultValue: "View Room" },
    { ...tone, defaultValue: "cream" },
  ],
};

export const ReviewsBlock: Block = {
  slug: "reviews",
  labels: { singular: "Reviews", plural: "Reviews" },
  fields: [
    { name: "heading", type: "text", required: true },
    intro,
    {
      name: "reviews",
      type: "array",
      admin: itemLabel("Review"),
      minRows: 1,
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "rating", type: "number", required: true, min: 1, max: 5, defaultValue: 5, admin: { description: "Stars, out of 5" } },
          ],
        },
        { name: "photo", type: "upload", relationTo: "media", admin: { description: "Optional: their profile photo. Without one, their initials show." } },
        { name: "text", type: "textarea", required: true, admin: { description: "Word for word. Leave a blank line between paragraphs." } },
      ],
    },
    tone,
  ],
};

export const DirectionsBlock: Block = {
  slug: "directions",
  labels: { singular: "Directions", plural: "Directions" },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "Well connected" },
    intro,
    travelModes,
    {
      type: "row",
      fields: [
        { name: "place", type: "text", required: true, admin: { description: "Names the map for screen readers, e.g. “Old Oak”." } },
        { name: "mapEmbedUrl", label: "Map embed link", type: "text", required: true, admin: { description: "Google Maps → Share → Embed a map → the src link." } },
      ],
    },
    tone,
  ],
};

export const DownloadCardBlock: Block = {
  slug: "downloadCard",
  labels: { singular: "Download card", plural: "Download cards" },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "intro", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        { name: "fileLabel", label: "Button label", type: "text", required: true },
        { name: "fileHref", label: "File", type: "text", required: true, admin: { description: "Its address, e.g. /downloads/brochure.pdf" } },
      ],
    },
    image("image"),
    tone,
  ],
};

/** A section's header shows its type and heading (see fields/RowLabels.tsx), not "Untitled". */
const withHeading = (block: Block): Block => ({
  ...block,
  admin: { ...block.admin, components: { ...block.admin?.components, Label: { path: "/payload/fields/RowLabels#SectionLabel", clientProps: { label: block.labels?.singular } } } },
});

export const pageBlocks = [
  HeroBlock,
  IntroBlock,
  ChecklistBlock,
  GalleryBlock,
  FeatureGroupsBlock,
  LocationCardsBlock,
  RoomCardsBlock,
  LinkCardsBlock,
  CollageSplitBlock,
  TestimonialsBlock,
  PressQuotesBlock,
  TeamGridBlock,
  ReviewsBlock,
  DirectionsBlock,
  FaqBlock,
  FaqDirectoryBlock,
  OpenPositionsBlock,
  MediaKitBlock,
  ImageCarouselBlock,
  PerkCardsBlock,
  DownloadCardBlock,
  PromoCardsBlock,
  SocialLinksBlock,
].map(withHeading);
