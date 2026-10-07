import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { itemLabel } from "../fields/shared";

/**
 * Values to use in any text as {name}, e.g. {gym-joining-fee}: change one here and every page
 * that uses it changes too. Also lists the variables worked out from the real prices
 * (fields/VariablesList.tsx). Every page refreshes on save.
 */
export const Variables: GlobalConfig = {
  slug: "variables",
  label: "Variables",
  access: { read: () => true },
  admin: {
    description:
      "Write {name} in any text (pages, locations, rooms, templates) and the value goes in, so prices in sentences never go out of date. Your own are below; the ones worked out from the real prices are listed underneath.",
  },
  fields: [
    {
      name: "entries",
      label: "Your variables",
      labels: { singular: "Variable", plural: "Variables" },
      type: "array",
      admin: itemLabel("Variable"),
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          admin: { description: "Lowercase words joined by hyphens, e.g. gym-joining-fee. Used in text as {gym-joining-fee}." },
          validate: (value: unknown) =>
            typeof value !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)
              ? "Use lowercase letters, numbers and hyphens, e.g. gym-joining-fee"
              : ["lowest-price", "name", "joining-fee"].includes(value)
                ? "That name is taken by one worked out from the site"
                : true,
        },
        {
          name: "kind",
          type: "radio",
          defaultValue: "money",
          options: [
            { label: "An amount of money", value: "money" },
            { label: "Text", value: "text" },
          ],
          admin: { layout: "horizontal" },
        },
        {
          name: "amount",
          type: "number",
          min: 0,
          admin: { components: { Field: "/payload/fields/MoneyField#MoneyField" }, condition: (_, v) => v?.kind !== "text", description: "Shown as e.g. “£50”." },
        },
        { name: "text", type: "text", admin: { condition: (_, v) => v?.kind === "text" } },
        { name: "about", label: "What it's for", type: "text", admin: { description: "Optional, for other editors, e.g. “Gym joining fee mentioned in the FAQ”." } },
      ],
    },
    { name: "available", type: "ui", admin: { components: { Field: "/payload/fields/VariablesList#VariablesList" } } },
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
