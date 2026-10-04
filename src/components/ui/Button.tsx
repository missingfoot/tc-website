import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** "light" is the cream pill, "dark" is the ink pill with white text. */
  variant?: "light" | "dark";
  /** Appends an arrow icon after the label. */
  arrow?: boolean;
  className?: string;
};

const variants = {
  light: "bg-cream text-ink hover:bg-cream-dark",
  dark: "bg-ink text-white hover:bg-ink/85",
};

/** Pill button from the Figma. Always 48px tall. Renders as a link. */
export default function Button({ href, children, variant = "light", arrow = false, className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-base font-bold leading-6 transition ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowRight className="size-4" />}
    </Link>
  );
}
