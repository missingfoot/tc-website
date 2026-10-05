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
  className?: string;
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick: () => void; type?: never }
  /** A form's submit button. */
  | { href?: never; onClick?: never; type: "submit" }
);

const variants = {
  light: "bg-cream text-ink hover:bg-cream-dark",
  dark: "bg-ink text-white hover:bg-ink/85",
  white: "bg-white text-ink hover:bg-cream-dark",
  glass: "bg-white/10 text-white hover:bg-white/20",
  outline: "border border-ink/15 bg-white text-ink hover:bg-cream",
};

/**
 * Pill button from the Figma. Always 48px tall. A link with `href`, a button with `onClick`, or
 * a form's submit button with `type="submit"`.
 */
export default function Button({ children, variant = "light", arrow = false, className = "", ...action }: ButtonProps) {
  const classes = `inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-base font-bold leading-6 ${pressable} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="size-4" />}
    </>
  );
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
