"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/config/navigation";
import { ChevronDown } from "@/components/icons";
import { navItemClass } from "./NavItem";

const HOVER_CLOSE_DELAY = 150; // ms grace period so the pointer can travel into the panel

/**
 * Desktop nav item with a dropdown: a dark floating card styled like the mobile menu, with
 * one column per group. Opens on hover (mouse) or click/Enter; closes on Escape, an outside
 * click, leaving it, or navigating.
 */
export default function NavDropdown({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const groups = link.menu ?? [];
  const id = `nav-menu-${link.label.toLowerCase()}`;

  // Close on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  const active = groups.some((g) => g.items.some((item) => item.href === pathname));

  return (
    <li
      ref={ref}
      className="relative"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      // Close when keyboard focus moves out of the item and its panel
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        // A mouse has already opened it on hover, so a click shouldn't close it again;
        // keyboard (Enter/Space) and touch toggle.
        onClick={(e) => ((e.nativeEvent as PointerEvent).pointerType === "mouse" ? setOpen(true) : setOpen((o) => !o))}
        className={navItemClass(active)}
      >
        {link.label}
        <ChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* pt-6 is an invisible bridge between the button and the card, so hover isn't lost */}
      <div
        id={id}
        className={`absolute top-full right-0 pt-6 duration-200 ease-smooth ${
          open
            ? "visible translate-y-0 opacity-100 transition-[opacity,translate]"
            : "invisible -translate-y-1 opacity-0 transition-[opacity,translate,visibility]"
        }`}
      >
        <div className="flex gap-2 rounded-4xl bg-ink/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-md">
          {groups.map((group, i) => (
            <div key={group.label ?? i} className="w-56">
              {group.label && <p className="px-5 pt-2 pb-1 text-sm font-bold leading-5 text-ash">{group.label}</p>}
              <ul>
                {group.items.map((item) => {
                  const current = item.href === pathname;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex rounded-full px-5 py-3 text-lg font-medium transition-colors ${current ? "bg-white/6" : "hover:bg-white/6"}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
