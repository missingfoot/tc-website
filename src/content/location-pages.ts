import { coLivingAbout } from "@/content/co-living";
import { oldOakAbout, oldOakPromos, oldOakRoomIncluded } from "@/content/old-oak";
import { servicedPromos } from "@/content/serviced-living";
import { workingLocationIncluded } from "@/content/working";

/** A location page's pricing section: its words and button (the prices are each location's). */
export type PricingSettings = {
  heading: string;
  intro?: string;
  note?: string;
  button: { opens: "enquiry" | "link" | "none"; href?: string; label?: string };
};

/**
 * The words location and room pages share, as they were in code: what the seed builds their
 * templates (/admin → Templates) from. Edited in the templates since.
 */
export const locationPagesDefaults = {
  working: {
    includedIntro: "All of our locations come with these features as standard, as well as all of their own unique offerings.",
    included: workingLocationIncluded,
    pricing: { heading: "Pricing", intro: "Simple monthly memberships, with everything above included.", button: { opens: "enquiry" } } as PricingSettings,
    // TODO: link target for the 3D tour
    tour: { label: "View 3D Tour", href: "#" },
    promos: oldOakPromos,
  },
  serviced: {
    includedIntro: "Everything you need, all included in one weekly price.",
    pricing: { heading: "Pricing", intro: "Weekly prices with all bills, cleaning and linen changes included.", button: { opens: "enquiry" } } as PricingSettings,
    promos: servicedPromos,
  },
  venues: {
    includedHeading: "Capacity & facilities",
    includedIntro: "Hire it as a blank canvas or styled to suit, with catering and bar service available.",
    pricing: { heading: "Pricing", button: { opens: "enquiry" } } as PricingSettings,
    promos: servicedPromos,
  },
  rooms: {
    included: oldOakRoomIncluded,
    about: oldOakAbout,
    coLivingAbout,
    promos: oldOakPromos,
  },
};
