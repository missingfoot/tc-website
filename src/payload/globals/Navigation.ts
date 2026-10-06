import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { itemLabel } from "../fields/shared";

const linkPicker = { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } };

/** Hide a link without deleting it. */
const show: Field = { name: "show", type: "checkbox", defaultValue: true, admin: { description: "Untick to hide it without deleting it." } };

/** A label and where it goes, with a Show switch. */
const linkFields: Field[] = [
  { name: "label", type: "text", required: true },
  { name: "href", label: "Link", type: "text", required: true, admin: linkPicker },
  show,
];

const links = (name: string, label: string, fallback: string, extra: Partial<Field> = {}): Field =>
  ({ name, label, labels: { singular: fallback, plural: label }, type: "array", admin: itemLabel(fallback), fields: linkFields, ...extra }) as Field;

/**
 * The site's navigation: the menu (mobile, and the desktop bar's More dropdown), the desktop bar
 * and the footer, each in its own order. Drag to reorder; untick Show to hide. Every page's header
 * and footer refresh on save.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: { read: () => true },
  admin: {
    description:
      "The site's three menus. Drag rows to reorder them, and untick Show to hide a link without deleting it. Changes show on every page as soon as you save.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Menu",
          description:
            "The menu that opens from the ☰ button on phones and tablets, top to bottom. Its sections with a heading (More Products, The Collective…) are also what the desktop bar's More dropdown shows.",
          fields: [
            {
              name: "menu",
              label: "Sections",
              labels: { singular: "Section", plural: "Sections" },
              type: "array",
              admin: itemLabel("Section", "No heading"),
              fields: [
                { name: "heading", type: "text", admin: { description: "A small grey heading above its links. Leave empty for the first section (Home, Locations…), which has none." } },
                {
                  name: "items",
                  label: "Links",
                  labels: { singular: "Link", plural: "Links" },
                  type: "array",
                  admin: itemLabel("Link"),
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", label: "Link", type: "text", admin: { ...linkPicker, description: "Leave empty if it has sub-links: tapping it then opens them instead." } },
                    show,
                    links("subLinks", "Sub-links", "Sub-link", {
                      admin: { ...itemLabel("Sub-link"), description: "Optional: links that fold out under this one, e.g. Locations → Old Oak, Canary Wharf." },
                    }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Desktop bar",
          description:
            "The links across the top of every page on desktop, left to right (the Account button always comes last). Each one goes to a page, or opens a dropdown: either of its own links (like Locations), or of the menu's sections (More).",
          fields: [
            {
              name: "desktop",
              label: "Links",
              labels: { singular: "Link", plural: "Links" },
              type: "array",
              admin: itemLabel("Link"),
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "opens",
                  type: "radio",
                  defaultValue: "link",
                  options: [
                    { label: "Goes to a page", value: "link" },
                    { label: "Opens a dropdown of its own links", value: "dropdown" },
                    { label: "Opens the menu's sections (More)", value: "menu" },
                  ],
                  admin: { layout: "horizontal", description: "“The menu's sections” shows the Menu tab's sections that have a heading, so they're kept in one place." },
                },
                { name: "href", label: "Link", type: "text", admin: { ...linkPicker, condition: (_, item) => item?.opens === "link" } },
                links("subLinks", "Dropdown links", "Link", { admin: { ...itemLabel("Link"), condition: (_, item) => item?.opens === "dropdown" } }),
                show,
              ],
            },
          ],
        },
        {
          label: "Footer",
          description: "The columns of links at the bottom of every page, left to right after the logo (three fit side by side on desktop).",
          fields: [
            {
              name: "footer",
              label: "Columns",
              labels: { singular: "Column", plural: "Columns" },
              type: "array",
              admin: itemLabel("Column"),
              fields: [{ name: "heading", type: "text", required: true }, links("links", "Links", "Link"), show],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          // The header and footer are on every page
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
