import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";
import { pressable } from "@/lib/styles";

type ButtonProps = {
  children: ReactNode;
  /**
   * "light" cream, "dark" ink, "white" plain white, "glass" translucent white for dark backgrounds,
   * "outline" white with a thin border (secondary actions on white, e.g. "Edit").
   */
  variant?: "light" | "dark" | "white" | "glass" | "outline";
  /** Appends an arrow icon after the label. */
  arrow?: boolean;
  /** 40px instead of 48px: only for the header bar, where a full-size button crowds the pill. */
  compact?: boolean;
  className?: string;
} & (
  | { href: string; onClick?: never; type?: never; download?: never }
  /** A file to download (a plain <a download>, so it isn't routed or prefetched). */
  | { href: string; download: true; onClick?: never; type?: never }
  | { href?: never; onClick: () => void; type?: never; download?: never }
  /** A form's submit button. */
  | { href?: never; onClick?: never; type: "submit"; download?: never }
);

const variants = {
  light: "bg-cream text-ink hover:bg-cream-dark",
  dark: "bg-ink text-white hover:bg-ink/85",
  white: "bg-white text-ink hover:bg-cream-dark",
  glass: "bg-white/10 text-white hover:bg-white/20",
  outline: "border border-ink/15 bg-white text-ink hover:bg-cream",
};

/**
 * Pill button from the Figma. Always 48px tall. A link with `href` (add `download` for a file), a
 * button with `onClick`, or a form's submit button with `type="submit"`.
 */
export default function Button({ children, variant = "light", arrow = false, compact = false, className = "", ...action }: ButtonProps) {
  const classes = `inline-flex ${compact ? "h-10 px-5" : "h-12 px-6"} items-center gap-2.5 rounded-full text-base font-bold leading-6 ${pressable} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight />}
    </>
  );
  // Files and in-page anchors are plain links: Next's <Link> ignores a second click on the hash
  // the URL already has, so "See our open positions" would only scroll once.
  if (action.download || action.href?.startsWith("#")) {
    return (
      <a href={action.href} download={action.download || undefined} className={classes}>
        {content}
      </a>
    );
  }
  if (action.href !== undefined) {
    return (
      <Link href={action.href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type={action.type ?? "button"} onClick={action.onClick} className={classes}>
      {content}
    </button>
  );
}
