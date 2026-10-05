"use client";

import { useEffect, useState } from "react";

/**
 * Whether the first element matching `selector` is on screen. Starts as `initial` (before the
 * page has hydrated, or if nothing matches or no selector is given).
 */
export function useInView(selector: string | undefined, initial = false) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const el = selector ? document.querySelector(selector) : null;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [selector]);

  return inView;
}
