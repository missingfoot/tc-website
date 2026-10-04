/** A `sizes` slot: an optional media condition and the width the image is displayed at. */
type Slot = [media: string | null, width: string];

/**
 * Builds an `<img sizes>` value that always fetches at least 2× resolution. HiDPI screens
 * (phones, retina Macs) already multiply the slot by their pixel density; on 1× screens the
 * slot is doubled so they get a 2× image too. List slots like `sizes`, widest-first, ending
 * with a default (media `null`).
 *
 * sizes2x(["(min-width: 768px)", "50vw"], [null, "90vw"])
 */
export function sizes2x(...slots: Slot[]): string {
  return slots
    .flatMap(([media, width]) => [
      `${media ? `${media} and ` : ""}(min-resolution: 2dppx) ${width}`,
      `${media ? `${media} ` : ""}calc(2 * ${width})`,
    ])
    .join(", ");
}
