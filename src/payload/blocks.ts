import type { Block, Field } from "payload";

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

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea" },
    image("image"),
    { ...position, name: "imagePosition", label: "Image position" },
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
    cta,
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
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: "heading", type: "text", required: true },
        image("image"),
        position,
        { type: "row", fields: [{ name: "ctaLabel", label: "Button label", type: "text", required: true }, { name: "ctaHref", label: "Button link", type: "text", required: true }] },
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

export const pageBlocks = [HeroBlock, IntroBlock, CollageSplitBlock, PromoCardsBlock, SocialLinksBlock];
