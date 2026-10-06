import type { Block, Field } from "payload";
import * as icons from "@/components/icons";

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
  options: ["top", "bottom", "left", "right"],
  admin: { description: "Which edge of the photo stays in view when it's cropped (centred if empty)." },
};

const cta: Field = {
  name: "cta",
  label: "Button",
  type: "group",
  admin: { description: "Optional: leave both empty for no button." },
  fields: [
    { name: "label", type: "text" },
    { name: "href", label: "Link", type: "text", admin: { description: "A page (/co-living), a full URL or mailto:…" } },
  ],
};

/**
 * A list's items start collapsed, each header showing its name (see fields/RowLabels.tsx), or e.g.
 * "Card 03" until it has one.
 */
const itemLabel = (fallback: string) => ({
  initCollapsed: true,
  components: { RowLabel: { path: "/payload/fields/RowLabels#ItemLabel", clientProps: { fallback } } },
});

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
    { ...cta, label: "Button (with an arrow)", admin: { description: "Optional: links to a page. Leave both empty for no button." } },
    {
      name: "video",
      label: "Video button (with a play icon)",
      type: "group",
      admin: { description: "Optional: opens this video over the page. Used instead of the button above." },
      fields: [
        { type: "row", fields: [{ name: "label", type: "text" }, { name: "url", label: "Video link", type: "text", admin: { description: "YouTube, Vimeo or an .mp4" } }] },
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
      ],
    },
    { ...cta, admin: { ...cta.admin, condition: (_, block) => block?.buttons !== "contact" } },
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
        { type: "row", fields: [{ name: "ctaLabel", label: "Button label", type: "text", required: true }, { name: "ctaHref", label: "Button link", type: "text", required: true }] },
        { name: "enquiry", label: "Button opens", type: "select", options: enquiryKinds, admin: { description: "Optional: an enquiry form instead of the link (which then isn't used)." } },
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

// Icons editors can put beside a checklist item: everything in the icon set except interface
// controls and brand logos, which mean something else on the page
const notForContent = ["ArrowLeft", "ArrowRight", "Menu", "Close", "ChevronDown", "Download", "Search", "YouTube", "Facebook", "Instagram", "Twitter", "VisaLogo", "MastercardLogo", "AmexLogo"];
export const checklistIcons = Object.keys(icons).filter((name) => !notForContent.includes(name));

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
        {
          name: "icon",
          type: "select",
          options: checklistIcons,
          admin: { description: "Optional: shown beside the item.", components: { Field: "/payload/fields/IconPicker#IconPicker" } },
        },
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
        { type: "row", fields: [{ name: "ctaLabel", label: "Button label", type: "text", required: true }, { name: "ctaHref", label: "Button link", type: "text", required: true }] },
      ],
    },
    {
      name: "moreLink",
      label: "Link under the cards",
      type: "group",
      admin: { description: "Optional, e.g. “Read more press articles”." },
      fields: [{ type: "row", fields: [{ name: "label", type: "text" }, { name: "href", label: "Link", type: "text" }] }],
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
  fields: [{ name: "heading", type: "text", required: true }, intro, faqItems, tone],
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

/** A section's header shows its type and heading (see fields/RowLabels.tsx), not "Untitled". */
const withHeading = (block: Block): Block => ({
  ...block,
  admin: { ...block.admin, components: { ...block.admin?.components, Label: { path: "/payload/fields/RowLabels#SectionLabel", clientProps: { label: block.labels?.singular } } } },
});

export const pageBlocks = [
  HeroBlock,
  IntroBlock,
  ChecklistBlock,
  LinkCardsBlock,
  CollageSplitBlock,
  TestimonialsBlock,
  PressQuotesBlock,
  TeamGridBlock,
  FaqBlock,
  FaqDirectoryBlock,
  OpenPositionsBlock,
  MediaKitBlock,
  PromoCardsBlock,
  SocialLinksBlock,
].map(withHeading);
