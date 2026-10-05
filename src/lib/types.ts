import type { ComponentType } from "react";

/** A call-to-action link, used by buttons and section blocks. */
export type Cta = {
  label: string;
  href: string;
};

/** One photo in a Gallery. */
export type GalleryImage = {
  /** Full-size image. Until it's added, the blurred thumbnail stands in. */
  src?: string;
  /** Small square version: used in the thumbnail strip and, blurred, while `src` loads. */
  thumb: string;
  /** Alt text, also shown as the photo's name between the mobile carousel arrows. */
  alt: string;
};

/** A photo shown in a circle. `position` is a CSS object-position, to frame the subject. */
export type CircleImage = {
  src: string;
  alt: string;
  position?: string;
};


/** A room type or a location, shown as a card with feature tiles. */
export type Room = {
  name: string;
  /** Line under the name, e.g. a postcode. */
  subtitle?: string;
  /** Display price, e.g. "£245 per week". */
  price: string;
  image: CircleImage;
  /** Shown as a 2 × 2 grid of icon tiles. */
  features: { icon: ComponentType<{ className?: string }>; label: string }[];
  href: string;
};

export type Testimonial = {
  name: string;
  image: CircleImage;
  /** .mp4 URL or a YouTube/Vimeo link. */
  video?: string;
};

/** One way of getting there, shown as an accordion row with step-by-step directions. */
export type TravelMode = {
  label: string;
  /** Icon name (a string so content can pass it from server to client components). */
  icon: "underground" | "overground" | "bus" | "car";
  steps: string[];
  /** Google Maps link for this mode, e.g. a directions URL with the right travel mode. */
  mapsUrl: string;
};

/** Which enquiry form a button opens: co-living (a tour or a room) or a working space (a trial day). */
export type EnquiryKind = "living" | "working";

/** A photo card with a heading and a button, e.g. "Like what you see? / Apply now". */
export type PromoCard = {
  heading: string;
  image: CircleImage;
  /** A link, or `enquiry` to open that enquiry form instead (the href is then unused). */
  cta: Cta & { enquiry?: EnquiryKind };
};

/** A card with a photo, title, short text and a button. */
export type LinkCard = {
  title: string;
  text: string;
  image: CircleImage;
  cta: Cta;
};

/** A press quote with the publication's name. */
export type PressQuote = {
  quote: string;
  publication: string;
  /** Publication logo (SVG, drawn white on the dark card). Falls back to the name as text. */
  logo?: string;
  href?: string;
};

/** A partner perk: photo, partner logo, name and description. */
export type Perk = {
  name: string;
  text: string;
  image: string;
  logo?: string;
};

/** A headline price, e.g. "Hot Desk / £150 / Per month +VAT". */
export type Price = {
  label: string;
  amount: string;
  /** Small line under the amount. */
  period: string;
};

/** A co-living room's own page: photos, key facts, booking details and copy. */
export type RoomDetails = {
  slug: string;
  name: string;
  /** Where it is, under the name, e.g. "Old Oak, Willesden Junction". */
  location: string;
  /** Weekly price, e.g. "£245". */
  price: string;
  /** Gallery photos; the first is also the page's hero. */
  photos: GalleryImage[];
  features: { icon: ComponentType<{ className?: string }>; label: string }[];
  about: string[];
  /** Floor plan drawing. The section is left out until there is one. */
  floorPlan?: CircleImage;
  booking: {
    moveIn: string;
    floor: string;
    /** Options in the membership period picker. */
    periods: string[];
  };
};

/** A team member: headshot, name and role. */
export type Person = {
  name: string;
  role: string;
  image: CircleImage;
};
