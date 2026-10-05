"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Holds a button (children) that stays on screen while the page scrolls: bottom centre on mobile, bottom right
 * on desktop. Sits under the header and mobile menu (z-40), clear of the phone's home bar.
 * Sized to its label (w-max): pinned at left: 50% it would otherwise only get half the screen's
 * width and wrap. Comes in once the page's first block (the hero) has scrolled away, and fades out again once
 * the site footer is in view, so it never covers the footer's links.
 */
export default function FloatingButton({ children }: { children: ReactNode }) {
  const heroInView = useInView("main > :first-child", true);
  const footerInView = useInView("footer");
  const hidden = heroInView || footerInView;

  return (
    <div
      inert={hidden}
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-max whitespace-nowrap -translate-x-1/2 transition duration-300 ease-smooth motion-reduce:transition-none lg:right-10 lg:bottom-10 lg:left-auto lg:translate-x-0 ${
        hidden ? "translate-y-4 opacity-0" : ""
      }`}
    >
      {/* The drop shadow lifts the button off whatever's behind it */}
      <div className="rounded-full shadow-lg shadow-black/20">{children}</div>
    </div>
  );
}
