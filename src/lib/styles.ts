// Shared text styles, so every block uses the same type scale (Tailwind steps, not raw Figma sizes).
export const text = {
  /** Section headings, e.g. "Explore the spaces". */
  sectionHeading: "text-4xl font-bold leading-tight text-ink",
  /** Body copy in content blocks. font-normal renders Circular Book (450, the lightest weight we ship). */
  body: "text-base leading-relaxed text-stone",
} as const;
