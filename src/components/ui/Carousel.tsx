"use client";

import type { ReactNode } from "react";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

type CarouselProps<T> = {
  items: T[];
  /** Renders one slide's content. Slides are w-75 (300px) wide. */
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  /** Accessible name for the list, e.g. "Resident videos". */
  label: string;
  /** Dot label, e.g. (i, n) => `Show resident ${i} of ${n}`. */
  dotLabel?: (position: number, total: number) => string;
  /** Classes for each slide (e.g. aspect ratio, rounding). */
  slideClassName?: string;
};

/**
 * Full-bleed swipe/drag carousel with dots. Place inside a Container (and an overflow-hidden
 * Section): the scroller spans the whole window — negative margins equal to the page gutter,
 * --g at xl — so slides stay visible as they pass either edge, while still snapping to the
 * content's left edge. A trailing spacer lets the last slides reach the start, so every dot
 * works. Dots are hidden when there's only one slide.
 */
export default function Carousel<T>({ items, renderItem, getKey, label, dotLabel, slideClassName = "" }: CarouselProps<T>) {
  const { ref, index, goTo } = useSnapCarousel(items.length);

  return (
    <>
      <ul
        ref={ref}
        aria-label={label}
        className="-mx-6 mt-10 flex cursor-grab snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto overscroll-x-contain px-6 select-none active:cursor-grabbing [scrollbar-width:none] md:-mx-12 md:scroll-px-12 md:px-12 lg:mt-16 xl:[--g:max(12rem,calc((100vw-90rem)/2+12rem))] xl:-mx-(--g) xl:scroll-px-(--g) xl:px-(--g) [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li key={getKey(item, i)} className={`w-75 shrink-0 snap-start ${slideClassName}`}>
            {renderItem(item, i)}
          </li>
        ))}
        <li aria-hidden="true" className="w-[calc(100%-18.75rem-2rem)] shrink-0" />
      </ul>

      {items.length > 1 && (
        <div className="mt-6 flex justify-center lg:mt-12">
          {items.map((item, i) => (
            <button
              key={getKey(item, i)}
              type="button"
              onClick={() => goTo(i)}
              aria-label={dotLabel ? dotLabel(i + 1, items.length) : `Show slide ${i + 1} of ${items.length}`}
              aria-current={i === index}
              className="p-1.5"
            >
              <span className={`block size-2 rounded-full transition-colors ${i === index ? "bg-ink" : "bg-ink/15 hover:bg-ink/40"}`} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
