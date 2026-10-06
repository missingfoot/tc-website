import { coLivingAbout } from "@/content/co-living";
import { oldOakAbout, oldOakPromos, oldOakRoomIncluded } from "@/content/old-oak";
import { servicedPromos } from "@/content/serviced-living";
import { workingLocationIncluded } from "@/content/working";

/**
 * What every page of a type shares (location and room pages). Editable in the CMS (/admin →
 * Location pages): this is what the seed fills it from, and the fallback while it's not set up.
 */
export const locationPagesDefaults = {
  working: {
    includedIntro: "All of our locations come with these features as standard, as well as all of their own unique offerings.",
    included: workingLocationIncluded,
    pricingIntro: "Simple monthly memberships, with everything above included.",
    // TODO: link target for the 3D tour
    tour: { label: "View 3D Tour", href: "#" },
    promos: oldOakPromos,
  },
  serviced: {
    includedIntro: "Everything you need, all included in one weekly price.",
    pricingIntro: "Weekly prices with all bills, cleaning and linen changes included.",
    promos: servicedPromos,
  },
  venues: {
    includedHeading: "Capacity & facilities",
    includedIntro: "Hire it as a blank canvas or styled to suit, with catering and bar service available.",
    promos: servicedPromos,
  },
  rooms: {
    included: oldOakRoomIncluded,
    about: oldOakAbout,
    coLivingAbout,
    promos: oldOakPromos,
  },
};
