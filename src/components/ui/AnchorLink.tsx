"use client";

import type { ComponentProps } from "react";

/**
 * In-page link (`href="#section"`) that scrolls to the section without adding a history entry.
 * A plain hash link adds one Next's router doesn't know about: going Back onto it changes the URL
 * but not the page, so "Back" from the next page takes an extra click per anchor followed. This
 * replaces the current entry instead, keeping Next's state on it. Before the page's JavaScript
 * runs it's an ordinary link.
 */
export default function AnchorLink({ href, onClick, ...props }: ComponentProps<"a"> & { href: `#${string}` }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        const target = document.getElementById(decodeURIComponent(href.slice(1)));
        if (e.defaultPrevented || !target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        target.scrollIntoView();
        window.history.replaceState(window.history.state, "", href);
      }}
      {...props}
    />
  );
}
