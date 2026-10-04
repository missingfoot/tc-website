"use client";

import { useEffect, useRef, useState } from "react";

/** Smooth-scrolls the carousel so slide `i` lines up with its left scroll padding. */
function scrollToSlide(carousel: HTMLElement, i: number) {
  const slide = carousel.children[i] as HTMLElement | undefined;
  if (!slide) return;
  // Measured against the carousel itself, so it works whatever the offset parent is
  const offset = slide.getBoundingClientRect().left - carousel.getBoundingClientRect().left + carousel.scrollLeft;
  const padding = parseFloat(getComputedStyle(carousel).scrollPaddingLeft) || 0;
  carousel.scrollTo({ left: offset - padding, behavior: "smooth" });
}

/**
 * State for a horizontal scroll-snap carousel: tracks the current slide as it's swiped,
 * lets a mouse drag it (touch scrolls natively), and scrolls to a slide on goTo/go (wrapping
 * at the ends). Attach `ref` to the scrolling list; its children are the slides.
 */
export function useSnapCarousel(count: number) {
  const ref = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  // While a programmatic smooth scroll runs, ignore the scroll events it fires so the index
  // jumps straight to the target instead of ticking through every slide in between.
  const programmaticScroll = useRef(false);
  const scrollIdle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = (i: number) => {
    const next = (i + count) % count;
    setIndex(next);
    const carousel = ref.current;
    if (!carousel || carousel.offsetParent === null) return; // hidden (e.g. desktop-only layout)
    programmaticScroll.current = true;
    scrollToSlide(carousel, next);
  };
  const go = (step: number) => goTo(index + step);

  useEffect(() => {
    const carousel = ref.current;
    if (!carousel) return;
    const last = count - 1;
    const stride = () => {
      const [first, second] = carousel.children as HTMLCollectionOf<HTMLElement>;
      return first && second ? second.offsetLeft - first.offsetLeft : carousel.clientWidth;
    };
    const clamp = (i: number) => Math.min(last, Math.max(0, i));

    let frame = 0;
    const onScroll = () => {
      clearTimeout(scrollIdle.current);
      scrollIdle.current = setTimeout(() => {
        programmaticScroll.current = false;
        if (!drag) carousel.style.scrollSnapType = ""; // restore snapping after a drag settles
      }, 120);
      if (programmaticScroll.current || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIndex(clamp(Math.round(carousel.scrollLeft / stride())));
      });
    };

    // Mouse drag: a press only becomes a drag once the mouse moves a few pixels, so plain
    // clicks still reach buttons inside the slides. While dragging, snapping is paused; on
    // release the carousel glides to the nearest slide, or the next one in the drag direction.
    let drag: { x: number; left: number; start: number; active: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: carousel.scrollLeft, start: clamp(Math.round(carousel.scrollLeft / stride())), active: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      if (!drag.active) {
        if (Math.abs(e.clientX - drag.x) < 5) return;
        drag.active = true;
        carousel.setPointerCapture(e.pointerId);
        carousel.style.scrollSnapType = "none";
      }
      carousel.scrollLeft = drag.left - (e.clientX - drag.x);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      const wasDrag = drag.active;
      const dx = e.clientX - drag.x;
      const start = drag.start;
      drag = null;
      if (!wasDrag) return; // a click: let it through
      let target = clamp(Math.round(carousel.scrollLeft / stride()));
      // A short flick (15% of a slide) is enough to move one slide
      if (target === start && Math.abs(dx) > stride() * 0.15) target = clamp(start - Math.sign(dx));
      // The drag shouldn't also count as a click on whatever is under the pointer
      carousel.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true });
      carousel.releasePointerCapture(e.pointerId);
      programmaticScroll.current = true;
      setIndex(target);
      scrollToSlide(carousel, target);
    };

    carousel.addEventListener("scroll", onScroll, { passive: true });
    carousel.addEventListener("pointerdown", onDown);
    carousel.addEventListener("pointermove", onMove);
    carousel.addEventListener("pointerup", onUp);
    carousel.addEventListener("pointercancel", onUp);
    return () => {
      carousel.removeEventListener("scroll", onScroll);
      carousel.removeEventListener("pointerdown", onDown);
      carousel.removeEventListener("pointermove", onMove);
      carousel.removeEventListener("pointerup", onUp);
      carousel.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(frame);
      clearTimeout(scrollIdle.current);
    };
  }, [count]);

  return { ref, index, goTo, go };
}
