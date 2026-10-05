// Shared text styles, so every block uses the same type scale (Tailwind steps, not raw Figma sizes).
export const text = {
  /** Section headings, e.g. "Explore the spaces". */
  sectionHeading: "text-4xl font-bold leading-heading text-ink",
  /** Headings inside a block, e.g. "About the room" on a room page. */
  subheading: "text-2xl font-bold leading-heading text-ink",
  /** Body copy in content blocks. font-normal renders Circular Book (450, the lightest weight we ship). */
  body: "text-base leading-relaxed text-stone",
  /** Form labels and small grey captions. */
  label: "text-base text-stone",
} as const;

/** Text inputs and selects: 48px tall like buttons, thin border, darker when focused. */
export const field =
  "h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-base text-ink placeholder:text-stone focus:border-ink focus:outline-none";

/** Shared interaction feedback for buttons and button-like links: a slight press on click. */
export const pressable = "transition active:scale-97 motion-reduce:active:scale-100";
