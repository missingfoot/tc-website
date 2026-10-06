import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { itemLabel } from "../fields/shared";

const linkPicker = { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } };

/** Hide a link without deleting it. */
const show: Field = { name: "show", type: "checkbox", defaultValue: true, admin: { description: "Untick to hide it without deleting it." } };

/** A label and where it goes, with a Show switch. */
const linkFields: Field[] = [
  {
    type: "row",
    fields: [
      { name: "label", type: "text", required: true },
      { name: "href", label: "Link", type: "text", required: true, admin: linkPicker },
    ],
  },
  show,
];

const links = (name: string, label: string, fallback: string, extra: Partial<Field> = {}): Field =>
  ({ name, label, type: "array", admin: itemLabel(fallback), fields: linkFields, ...extra }) as Field;

/**
 * The site's navigation: the menu (mobile, and the desktop bar's More dropdown), the desktop bar
 * and the footer, each in its own order. Drag to reorder; untick Show to hide. Every page's header
 * and footer refresh on save.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: { read: () => true },
  admin: { description: "The menu, the desktop bar and the footer. Drag to reorder; untick Show to hide a link." },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Menu",
          description: "The mobile menu. Its sections with a heading also make up the desktop bar's More dropdown.",
          fields: [
            {
              name: "menu",
              label: "Sections",
              type: "array",
              admin: itemLabel("Section"),
              fields: [
                { name: "heading", type: "text", admin: { description: "Optional: a small grey heading. The first section usually has none." } },
                {
                  name: "items",
                  label: "Links",
                  type: "array",
                  admin: itemLabel("Link"),
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "label", type: "text", required: true },
                        { name: "href", label: "Link", type: "text", admin: { ...linkPicker, description: "Not needed with sub-links: tapping it opens them." } },
                      ],
                    },
                    show,
                    links("subLinks", "Sub-links", "Sub-link", { admin: { ...itemLabel("Sub-link"), description: "Optional: shown by tapping the link's arrow." } }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Desktop bar",
          description: "The links along the top on desktop.",
          fields: [
            {
              name: "desktop",
              label: "Links",
              type: "array",
              admin: itemLabel("Link"),
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "opens",
                  type: "radio",
                  defaultValue: "link",
                  options: [
                    { label: "A link", value: "link" },
                    { label: "A dropdown of its own links", value: "dropdown" },
                    { label: "The menu's sections (a More dropdown)", value: "menu" },
                  ],
                  admin: { layout: "horizontal" },
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
          fields: [
            {
              name: "footer",
              label: "Columns",
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
