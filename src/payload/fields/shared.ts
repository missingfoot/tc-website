import type { Field } from "payload";
import * as icons from "@/components/icons";

// Fields used in more than one place (page sections, locations).

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

/** A URL slug: lowercase letters, numbers and hyphens. */
export const slugField = (description: string): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description },
  validate: (value: unknown) => (typeof value === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) || "Use lowercase letters, numbers and hyphens, e.g. our-story",
});
