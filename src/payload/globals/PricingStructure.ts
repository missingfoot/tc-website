import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { priceTerms } from "../fields/shared";

/** A kind of location's plans: each a column of the Pricing page's grid, with an optional standard price. */
const plans = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "amount", label: "Standard price", type: "number", min: 0, admin: { description: "In pence. Places without their own price use it; leave empty for none." } },
    ...priceTerms,
    { name: "note", label: "Small print", type: "text" },
  ],
});

/**
 * The top level of pricing: what working spaces' and serviced living houses' prices are made of,
 * plans with standard prices places use unless they set their own. Each place's prices fill these
 * in (Pricing page grids). Rooms' membership lengths are their building's (Locations' hidden
 * roomLengths). Edited on the Pricing page only.
 */
export const PricingStructure: GlobalConfig = {
  slug: "pricingStructure",
  label: "Pricing structure",
  access: { read: () => true },
  admin: { hidden: true },
  fields: [
    plans("working", "Working space plans"),
    plans("serviced", "Serviced living room types"),
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          // Standard prices and plans can show on any page
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
