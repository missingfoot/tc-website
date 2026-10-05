"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type StickyBarProps = {
  title: string;
  /** Short grey line under the title, e.g. "From £245 pw". */
  subtitle: string;
  /** The action on the right, e.g. a Button. */
  children: ReactNode;
  /** Slides away while this element is on screen, e.g. the full booking block it duplicates. */
  hideWhenVisible?: string;
};

/**
 * Mobile only: a bar pinned to the bottom of the screen with a title, a short line and an
 * action. Slides away while `hideWhenVisible` or the footer is on screen.
 */
export default function StickyBar({ title, subtitle, children, hideWhenVisible }: StickyBarProps) {
  const targetInView = useInView(hideWhenVisible);
  const footerInView = useInView("footer");
  const hidden = targetInView || footerInView;

  return (
    <div
      inert={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition duration-300 ease-smooth motion-reduce:transition-none lg:hidden ${
        hidden ? "translate-y-full" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-12">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-ink">{title}</p>
          <p className="text-base text-stone">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
