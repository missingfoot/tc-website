import type { CollectionConfig } from "payload";

/** People who can sign in to the admin (/admin). The first one is created on the admin's first visit. */
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  fields: [],
};
