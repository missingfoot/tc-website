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


/** Which icon a room feature tile shows. */
export type RoomFeatureIcon = "bathroom" | "kitchen" | "size" | "room";

export type Room = {
  name: string;
  /** Display price, e.g. "£245 per week". */
  price: string;
  image: CircleImage;
  /** Shown as a 2 × 2 grid of icon tiles. */
  features: { icon: RoomFeatureIcon; label: string }[];
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

/** A photo card with a heading and a button, e.g. "Like what you see? / Apply now". */
export type PromoCard = {
  heading: string;
  image: CircleImage;
  cta: Cta;
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
