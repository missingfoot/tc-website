"use client";

import Link from "next/link";
import AccountButton from "./AccountButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MobileNavGroup, MobileNavItem } from "@/config/navigation";
import { ChevronDown, Close, Menu } from "@/components/icons";
import { useMobileMenu } from "./StickyHeader";

const itemBase = "flex w-full items-center gap-0.5 rounded-full px-6 py-4 text-left font-medium transition";
const activeBg = "bg-white/6";

/**
 * Menu/close button plus the floating dark menu card it toggles. Shown below lg. While
 * open the header shows its dock pill, the card floats just under it, and the page stays
 * visible (dimmed) around it; tapping outside closes it.
 */
export default function MobileMenu({ groups }: { groups: MobileNavGroup[] }) {
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
        className="-mr-3 flex size-12 items-center justify-center rounded-full lg:hidden"
      >
        {open ? <Close /> : <Menu />}
      </button>

      {/* Dimmed page behind the card; tapping it closes the menu */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 -z-20 bg-black/40 duration-300 lg:hidden ${
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      />

      {/* Floating card under the dock pill, lined up with its edges */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-3 top-22 bottom-3 -z-10 flex origin-top flex-col overflow-y-auto overscroll-contain rounded-4xl bg-ink/95 text-white shadow-2xl shadow-black/30 backdrop-blur-md duration-300 ease-smooth md:inset-x-6 lg:hidden ${
          // Visible immediately on open; hidden only after the fade-out
          open
            ? "visible translate-y-0 scale-100 opacity-100 transition-[opacity,translate,scale]"
            : "invisible -translate-y-2 scale-98 opacity-0 transition-[opacity,translate,scale,visibility]"
        }`}
      >
        <nav aria-label="Mobile" className="p-4">
          {groups.map((group, i) => (
            <div key={group.label ?? i}>
              {group.label && <p className="px-6 pt-6 pb-1 text-sm font-bold leading-5 text-ash">{group.label}</p>}
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

        {/* Pinned to the bottom of the card while the links scroll behind it */}
        <div className="sticky bottom-0 mt-auto bg-linear-to-t from-ink via-ink/95 to-transparent p-4 pt-8">
          <AccountButton onClick={close} className="w-full justify-center" />
        </div>
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
