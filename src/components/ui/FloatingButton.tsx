"use client";

import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";

/**
 * A button that stays on screen while the page scrolls: bottom centre on mobile, bottom right
 * on desktop. Sits under the header and mobile menu (z-40), clear of the phone's home bar.
 * Comes in once the page's first block (the hero) has scrolled away, and fades out again once
 * the site footer is in view, so it never covers the footer's links.
 */
export default function FloatingButton({ cta }: { cta: Cta }) {
  const heroInView = useInView("main > :first-child", true);
  const footerInView = useInView("footer");
  const hidden = heroInView || footerInView;

  return (
    <div
      inert={hidden}
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 transition duration-300 ease-smooth motion-reduce:transition-none lg:right-10 lg:bottom-10 lg:left-auto lg:translate-x-0 ${
        hidden ? "translate-y-4 opacity-0" : ""
      }`}
    >
      <Button href={cta.href} variant="dark" arrow className="shadow-lg shadow-black/20">
        {cta.label}
      </Button>
    </div>
  );
}
