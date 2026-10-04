"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/navigation";

/** Shared styling for desktop nav items; underlined when the item is the current section. */
export const navItemClass = (active: boolean) =>
  `flex items-center gap-0.5 underline-offset-8 transition-opacity hover:opacity-80 ${active ? "underline decoration-1 decoration-current/60" : ""}`;

/** A plain desktop nav link, underlined on its page (and any pages beneath it). */
export default function NavItem({ link }: { link: NavLink }) {
  const pathname = usePathname();
  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
  return (
    <li>
      <Link href={link.href} aria-current={active ? "page" : undefined} className={navItemClass(active)}>
        {link.label}
      </Link>
    </li>
  );
}
