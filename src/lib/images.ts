/** A `sizes` slot: an optional media condition and the width the image is displayed at. */
type Slot = [media: string | null, width: string];

/**
 * Builds an `<img sizes>` value that always fetches at least 2× resolution. The browser
 * multiplies the slot by the screen's pixel density, so 2×+ screens (iPhones, retina Macs) use
 * it as is; in-between screens (1.5–1.99×, common on Android phones and Windows laptops) get it
 * scaled by 4/3 and 1× screens get it doubled, so each lands on about 2×. Scaling every sub-2×
 * screen by 2 would fetch 3–3.5× images on 1.5–1.75× screens. List slots like `sizes`,
 * widest-first, ending with a default (media `null`).
 *
 * sizes2x(["(min-width: 768px)", "50vw"], [null, "90vw"])
 */
export function sizes2x(...slots: Slot[]): string {
  return slots
    .flatMap(([media, width]) => {
      const and = media ? `${media} and ` : "";
      return [
        `${and}(min-resolution: 2dppx) ${width}`,
        `${and}(min-resolution: 1.5dppx) calc(4 / 3 * ${width})`,
        `${media ? `${media} ` : ""}calc(2 * ${width})`,
      ];
    })
    .join(", ");
}
