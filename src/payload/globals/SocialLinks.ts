import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { itemLabel } from "../fields/shared";

/**
 * The social accounts and newsletter button in every "Connect with us" section (CMS pages,
 * location and room pages, Labs). Every page refreshes on save.
 */
export const SocialLinksGlobal: GlobalConfig = {
  slug: "socialLinks",
  label: "Social links",
  access: { read: () => true },
  admin: { description: "The icons and button in every “Connect with us” section. Drag to reorder; untick Show to hide one. Changes show everywhere as soon as you save." },
  fields: [
    {
      name: "accounts",
      labels: { singular: "Account", plural: "Accounts" },
      type: "array",
      admin: itemLabel("Account"),
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "YouTube", value: "youtube" },
            { label: "Twitter / X", value: "twitter" },
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "Email", value: "email" },
          ],
          admin: { description: "Its icon. Email goes to the address in Contact details." },
        },
        { name: "href", label: "Link", type: "text", admin: { condition: (_, account) => account?.platform !== "email", description: "The account's address, e.g. https://www.instagram.com/…" } },
        { name: "label", type: "text", required: true, admin: { description: "Read out by screen readers (the icon has no text), e.g. “The Collective on Instagram”." } },
        { name: "show", type: "checkbox", defaultValue: true, admin: { description: "Untick to hide it without deleting it." } },
      ],
    },
    {
      name: "newsletter",
      label: "Button",
      type: "group",
      admin: { description: "Optional: the button under the icons, e.g. a newsletter sign-up. Leave the link empty for no button." },
      fields: [
        { name: "label", type: "text" },
        { name: "href", label: "Link", type: "text", admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
