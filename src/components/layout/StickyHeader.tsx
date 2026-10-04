"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Distance scrolled (px) before the header switches to its white style. */
const SCROLL_THRESHOLD = 20;

const MobileMenuContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

/** Open/close state of the mobile menu, shared by the header and the menu. */
export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) throw new Error("useMobileMenu must be used inside StickyHeader");
  return context;
}

/**
 * Fixed site header with three looks:
 * - top of page: transparent with white text (over the hero)
 * - scrolled: white with dark text (and shorter on desktop: 120px → 72px)
 * - mobile menu open: dark with white text, so it becomes the menu's top bar
 * Mobile stays 100px tall so the logo and menu button never move.
 * Children inherit the text colour (logo and icons use currentColor).
 */
export default function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const look = open
    ? "bg-ink text-white lg:h-[120px]"
    : scrolled
      ? "bg-white text-ink lg:h-[72px]"
      : "bg-transparent text-white lg:h-[120px]";

  return (
    <MobileMenuContext.Provider value={{ open, setOpen }}>
      <header
        data-scrolled={scrolled}
        className={`fixed inset-x-0 top-0 z-50 h-[100px] transition-[height,background-color,color] duration-300 ease-out ${look}`}
      >
        {children}
      </header>
    </MobileMenuContext.Provider>
  );
}
