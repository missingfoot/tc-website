"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mobileNav, type MobileNavGroup, type MobileNavItem } from "@/config/navigation";
import { ChevronDown, Close, Menu } from "@/components/icons";
import { useMobileMenu } from "./StickyHeader";

const itemBase = "flex w-full items-center gap-0.5 rounded-xl p-4 text-left font-medium transition";
const activeBg = "bg-white/6";

/**
 * Menu/close button plus the full-screen dark menu it toggles. Shown below lg.
 * The panel sits behind the header (which turns dark while open), so the logo and
 * button stay exactly where they are.
 */
export default function MobileMenu({ groups = mobileNav }: { groups?: MobileNavGroup[] }) {
  const { open, setOpen } = useMobileMenu();
  const pathname = usePathname();

  // Close whenever the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // The menu is mobile-only, so close it if the window grows to desktop size
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="-mr-3 flex size-12 items-center justify-center lg:hidden"
      >
        {open ? <Close /> : <Menu />}
      </button>

      {/* -z-10 puts the panel behind the header's logo and button */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 overflow-y-auto bg-ink pt-24 text-white duration-300 lg:hidden ${
          // Visible immediately on open; hidden only after the fade-out
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <nav aria-label="Mobile" className="p-4 pb-20">
          {groups.map((group, i) => (
            <div key={group.label ?? i}>
              {group.label && <p className="px-4 pt-6 pb-1 text-sm font-bold leading-5 text-ash">{group.label}</p>}
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <MenuItem item={item} pathname={pathname} onNavigate={close} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

function MenuItem({ item, pathname, onNavigate }: { item: MobileNavItem; pathname: string; onNavigate: () => void }) {
  const childActive = item.children?.some((child) => child.href === pathname) ?? false;
  const [expanded, setExpanded] = useState(childActive);
  const topLevel = `${itemBase} text-2xl leading-8`;

  if (!item.children) {
    return (
      <Link href={item.href} onClick={onNavigate} aria-current={item.href === pathname ? "page" : undefined} className={`${topLevel} ${item.href === pathname ? activeBg : "hover:bg-white/6"}`}>
        {item.label}
      </Link>
    );
  }

  return (
    <>
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className={`${topLevel} hover:bg-white/6`}>
        {item.label}
        <ChevronDown className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <ul className="pb-2.5">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                aria-current={child.href === pathname ? "page" : undefined}
                className={`${itemBase} text-xl leading-6 text-ash ${child.href === pathname ? activeBg : "hover:bg-white/6"}`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
