import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Background, overflow etc. Vertical padding comes from Section so every block matches. */
  className?: string;
};

/** A full-width page block with the site's standard vertical spacing (48px mobile, 80px desktop). */
export default function Section({ children, className = "" }: SectionProps) {
  return <section className={`w-full py-12 lg:py-20 ${className}`}>{children}</section>;
}
