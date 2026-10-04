"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Distance scrolled (px) before the header docks into its floating pill. */
const SCROLL_THRESHOLD = 20;

const HeaderContext = createContext<{ open: boolean; setOpen: (open: boolean) => void; docked: boolean } | null>(null);

function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) throw new Error("Header components must be used inside StickyHeader");
  return context;
}

/** Open/close state of the mobile menu, shared by the header and the menu. */
export function useMobileMenu() {
  const { open, setOpen } = useHeader();
  return { open, setOpen };
}

/**
 * Fixed site header with white text. Over the top of the page it's transparent; once
 * scrolled (or while the mobile menu is open) a dark rounded pill fades in behind the logo
 * and links — see HeaderDock. The content never moves sideways, so the change is smooth.
 * One height (h-24) in every state, so nothing shifts when it docks.
 */
export default function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const docked = scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderContext.Provider value={{ open, setOpen, docked }}>
      <header
        data-docked={docked}
        className="fixed inset-x-0 top-0 z-50 h-24 text-white"
      >
        {children}
      </header>
    </HeaderContext.Provider>
  );
}

/**
 * The floating dark pill behind the header content. Place it inside the header's
 * (relative, isolated) Container. Insets are the Container's gutter minus a little, so the
 * pill extends 12px (mobile) / 24px (md+) past the content on each side.
 */
export function HeaderDock() {
  const { docked } = useHeader();
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-3 top-1/2 -z-10 h-16 -translate-y-1/2 rounded-full bg-ink/90 shadow-lg shadow-black/20 backdrop-blur-md transition-opacity duration-300 ease-smooth md:inset-x-6 xl:inset-x-42 ${
        docked ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/**
 * Mobile only: the page title, centred in the top bar. Fades in with the dock pill, since
 * over the hero the page already shows its big title.
 */
export function HeaderTitle({ title }: { title?: string }) {
  const { docked } = useHeader();
  if (!title) return null;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 max-w-1/2 -translate-x-1/2 truncate text-base font-bold transition-opacity duration-300 ease-smooth lg:hidden ${
        docked ? "opacity-100" : "opacity-0"
      }`}
    >
      {title}
    </span>
  );
}
