"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Whether the visitor has moved between pages within the site in this tab. Module state, so it
// lasts across client-side navigations (the browser doesn't update document.referrer for those).
let navigatedWithinSite = false;

/** True once the visitor has gone from one of our pages to another, so "Back" stays on the site. */
export const hasSiteHistory = () => navigatedWithinSite;

/** Mounted once in the root layout: notes when the page changes after the first one. */
export default function NavigationTracker() {
  const pathname = usePathname();
  const first = useRef(pathname);
  useEffect(() => {
    if (pathname !== first.current) navigatedWithinSite = true;
  }, [pathname]);
  return null;
}
