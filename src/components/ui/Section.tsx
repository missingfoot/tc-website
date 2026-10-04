import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Background, overflow etc. Vertical padding comes from Section so every block matches. */
  className?: string;
  /**
   * Mobile only: pulls the block up over the one above with rounded top corners (the
   * mobile design's white card over the hero). The block above needs extra bottom space (2rem).
   */
  raised?: boolean;
};

/** A full-width page block with the site's standard vertical spacing (48px mobile, 80px desktop). */
export default function Section({ children, className = "", raised = false }: SectionProps) {
  const raisedClasses = raised ? "relative z-10 -mt-8 rounded-t-4xl lg:mt-0 lg:rounded-none" : "";
  return <section className={`w-full py-12 lg:py-20 ${raisedClasses} ${className}`}>{children}</section>;
}
