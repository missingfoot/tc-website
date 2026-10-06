import type { ComponentType } from "react";

/** A call-to-action link, used by buttons and section blocks. */
export type Cta = {
  label: string;
  href: string;
};

/**
 * Where a cover-cropped photo is pinned: it scales to fill its box, and this edge (or corner)
 * stays in view while the rest is cropped. Left out, it's centred. Any CSS object-position also
 * works for fine-tuning, e.g. "50% 30%".
 */
export type ImagePosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right"
  | (string & {});

/** One photo in a Gallery. */
export type GalleryImage = {
  /** Full-size image. Until it's added, the blurred thumbnail stands in. */
  src?: string;
  /** Small square version: used in the thumbnail strip and, blurred, while `src` loads. */
  thumb: string;
  /** Alt text, also shown as the photo's name between the mobile carousel arrows. */
  alt: string;
  /** Edge the crop is pinned to (default centre). */
  position?: ImagePosition;
  /** Blurred preview while it loads, for a photo not in blur-placeholders.json (e.g. a CMS upload). */
  blur?: string;
};

/** A photo shown in a circle, or a cover-cropped card photo. `position` frames the subject. */
export type CircleImage = {
  src: string;
  alt: string;
  position?: ImagePosition;
  /** Blurred preview to show while it loads, for images not in blur-placeholders.json (e.g. CMS uploads). */
  blur?: string;
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

/** A review from a site like Facebook or Google: who wrote it, its star rating and its text. */
export type Review = {
  name: string;
  /** Their profile photo (shown small and round); without one, their initials show instead. */
  photo?: string;
  /** Out of 5. */
  rating: number;
  /** One string per paragraph, word for word. */
  text: string[];
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

/** Which enquiry form a button opens: co-living (a tour or a room), a working space (a trial day), serviced living (a viewing) or an event space. */
export type EnquiryKind = "living" | "working" | "serviced" | "events" | "waitlist";

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
  /** Blurred preview of `image` while it loads, for one not in blur-placeholders.json (e.g. a CMS upload). */
  imageBlur?: string;
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

/**
 * A location with its own page (a working space or a serviced living house): its card on the
 * listing page and its page at /[section]/[slug].
 */
export type LocationDetails = {
  slug: string;
  name: string;
  /** Neighbourhood, shown before the postcode: "Bloomsbury, WC1B". */
  area: string;
  postcode: string;
  /** The card's pill, e.g. "From £150 per month" (or a venue's capacity). */
  fromPrice: string;
  image: CircleImage;
  /** Transport and key facilities: the card's tiles and the page header's rows. */
  features: Room["features"];
  /** Intro paragraphs on the location page. */
  intro: string[];
  gallery: GalleryImage[];
  /** Pricing cards. Leave empty to leave the Pricing section out (e.g. venues, priced on request). */
  prices: Price[];
  /** Street address: drives the map and the "open in Maps" links. Without one, the map is left out. */
  address?: string;
  /** Intro under "Well connected". */
  directionsIntro: string;
  travelModes: TravelMode[];
};
