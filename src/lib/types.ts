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
