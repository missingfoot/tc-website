import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";

/**
 * The company's phone, email and address: the footer, the Call us and Email us buttons, the
 * careers pages' email links and the email in Social links. Every page refreshes on save.
 */
export const ContactDetails: GlobalConfig = {
  slug: "contactDetails",
  label: "Contact details",
  access: { read: () => true },
  admin: { description: "Shown in the footer, on the Call us and Email us buttons, on the careers pages and in Social links. Changes show everywhere as soon as you save." },
  fields: [
    { name: "phone", type: "text", required: true, admin: { description: "As it's shown, e.g. “+44 (0) 207 183 5478”. Tapping it dials the number (without the “(0)”)." } },
    { name: "email", type: "email", required: true },
    { name: "address", type: "textarea", required: true, admin: { description: "One line per line of the address. Shown on one line on desktop." } },
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
