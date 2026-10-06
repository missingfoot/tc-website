import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { featureGroupsField, promoCardsField } from "../blocks";
import { iconField, itemLabel } from "../fields/shared";
import { locationPaths } from "../collections/Locations";
import { roomsPath } from "../collections/Rooms";

const promos: Field = { ...promoCardsField, name: "promos", label: "Promo cards", admin: { ...itemLabel("Card"), description: "The cards at the bottom of every page of this type." } } as Field;

/**
 * What every page of a type shares (the working spaces', serviced living houses', venues' and
 * Old Oak rooms' pages): the parts each location or room doesn't have its own of. Every such page
 * refreshes on save.
 */
export const LocationPages: GlobalConfig = {
  slug: "locationPages",
  label: "Location pages",
  access: { read: () => true },
  admin: {
    description:
      "What every page of a type shares: each working space's, house's, venue's or room's own content is in Locations and Rooms; the parts they all have in common are here.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "working",
          label: "Working spaces",
          description: "Shared by every working space's page (/working/…).",
          fields: [
            { name: "includedIntro", label: "“What's included” intro", type: "textarea", required: true },
            {
              ...featureGroupsField,
              name: "included",
              label: "What's included as standard",
              admin: { ...itemLabel("Group"), description: "Shown on a working space's page unless it has its own list (Locations → its Page tab)." },
            } as Field,
            { name: "pricingIntro", label: "Pricing intro", type: "textarea", required: true },
            {
              name: "tour",
              label: "3D tour button",
              type: "group",
              admin: { description: "Under the gallery. Leave the link empty for no button." },
              fields: [
                { name: "label", type: "text", defaultValue: "View 3D Tour" },
                { name: "href", label: "Link", type: "text", admin: { components: { Field: "/payload/fields/LinkPicker#LinkPicker" } } },
              ],
            },
            promos,
          ],
        },
        {
          name: "serviced",
          label: "Serviced living",
          description: "Shared by every serviced living house's page (/serviced-living/…). Each house has its own “What's included” list.",
          fields: [
            { name: "includedIntro", label: "“What's included” intro", type: "textarea", required: true },
            { name: "pricingIntro", label: "Pricing intro", type: "textarea", required: true },
            promos,
          ],
        },
        {
          name: "venues",
          label: "Venues",
          description: "Shared by every venue's page (/event-spaces/…). Each venue has its own capacity and facilities list.",
          fields: [
            { name: "includedHeading", label: "Facilities heading", type: "text", required: true },
            { name: "includedIntro", label: "Facilities intro", type: "textarea", required: true },
            promos,
          ],
        },
        {
          name: "rooms",
          label: "Old Oak rooms",
          description: "Shared by every room's page (/locations/old-oak/rooms/…).",
          fields: [
            {
              name: "included",
              label: "What's included",
              type: "array",
              admin: itemLabel("Item"),
              fields: [{ name: "label", type: "text", required: true }, iconField("", true)],
            },
            {
              name: "about",
              label: "About the building",
              type: "group",
              fields: [
                { name: "heading", type: "text", required: true },
                { name: "text", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
                { name: "poster", label: "Video poster", type: "upload", relationTo: "media", required: true },
                { name: "video", label: "Video link", type: "text", required: true, admin: { description: "YouTube, Vimeo or an .mp4, played over the poster." } },
              ],
            },
            { name: "coLivingAbout", label: "“About Co-living”", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
            promos,
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          // Every page of each type (their routes' [slug] pages)
          for (const path of [...Object.values(locationPaths), `${roomsPath}/rooms`]) revalidatePath(`${path}/[slug]`, "page");
        } catch {
          // Outside Next (e.g. the seed script) there's no page cache to refresh
        }
      },
    ],
  },
};
