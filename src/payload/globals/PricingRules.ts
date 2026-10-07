import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { moneyField } from "../fields/shared";

/**
 * The rules applying for a room uses for its costs (lib/application.ts): the joining fee, the
 * holding deposit and each payment plan's security bond, in weeks of the room's rate.
 */
export const PricingRules: GlobalConfig = {
  slug: "pricingRules",
  label: "Pricing rules",
  access: { read: () => true },
  // Edited on the Pricing page (/admin/pricing), with every other price
  admin: { hidden: true, description: "What applying for a room costs, besides its rate. Bonds and deposits are in weeks of the room's weekly rate." },
  fields: [
    moneyField("joiningFee", "Joining fee", "Paid once, when applying."),
    { name: "holdingDepositWeeks", label: "Holding deposit (weeks)", type: "number", required: true, min: 0, admin: { description: "Paid when applying; it later becomes part of the security bond." } },
    {
      name: "bondWeeks",
      label: "Security bond (weeks), by payment plan",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "guarantor", label: "Monthly, with a guarantor", type: "number", required: true, min: 0 },
            { name: "noGuarantor", label: "Monthly, no guarantor", type: "number", required: true, min: 0 },
            { name: "upfront", label: "All up front", type: "number", required: true, min: 0 },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          // {joining-fee} can be in any page's text, besides the applications
          revalidatePath("/", "layout");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
