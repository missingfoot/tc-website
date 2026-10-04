"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GalleryImage } from "@/lib/types";
import Container from "@/components/ui/Container";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { sizes2x } from "@/lib/images";
import { ArrowLeft, ArrowRight } from "@/components/icons";

type GalleryProps = {
  heading: string;
  intro?: string;
  images: GalleryImage[];
  /** Shown under the thumbnails, e.g. a button. */
  footer?: ReactNode;
};

/**
 * Heading and intro, then the photos:
 * - below lg: a swipeable carousel of square slides, with arrows either side of the photo's name
 * - lg and up: a main image with side arrows, the photo's name and a thumbnail strip
 */
/** Smooth-scrolls the carousel so slide `i` lines up with its left padding. */
function scrollToSlide(carousel: HTMLElement, i: number) {
  const slide = carousel.children[i] as HTMLElement | undefined;
  if (!slide) return;
  carousel.scrollTo({ left: slide.offsetLeft - parseFloat(getComputedStyle(carousel).scrollPaddingLeft), behavior: "smooth" });
}

export default function Gallery({ heading, intro, images, footer }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const carouselRef = useRef<HTMLUListElement>(null);
  // While an arrow-triggered smooth scroll runs, ignore the scroll events it fires so the
  // count jumps straight to the target instead of ticking through every slide in between.
  const programmaticScroll = useRef(false);
  const scrollIdle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = (i: number) => {
    const next = (i + images.length) % images.length;
    setIndex(next);

    const carousel = carouselRef.current;
    if (!carousel || carousel.offsetParent === null) return; // hidden on desktop
    programmaticScroll.current = true;
    scrollToSlide(carousel, next);
  };
  const go = (step: number) => goTo(index + step);

  // Keep the index in sync when the carousel is swiped, and let a mouse drag it
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const last = images.length - 1;
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

    // Mouse drag (touch already scrolls natively). Snapping is paused while dragging, then
    // the carousel glides to the nearest slide, or the next one in the drag direction.
    let drag: { x: number; left: number; start: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      e.preventDefault();
      drag = { x: e.clientX, left: carousel.scrollLeft, start: clamp(Math.round(carousel.scrollLeft / stride())) };
      carousel.setPointerCapture(e.pointerId);
      carousel.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (drag) carousel.scrollLeft = drag.left - (e.clientX - drag.x);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      let target = clamp(Math.round(carousel.scrollLeft / stride()));
      // A short flick (15% of a slide) is enough to move one slide
      if (target === drag.start && Math.abs(dx) > stride() * 0.15) target = clamp(drag.start - Math.sign(dx));
      drag = null;
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
  }, [images.length]);

  return (
    <section className="w-full bg-cream pt-[52px] pb-[83px]">
      {/* Left-aligned below lg (site-wide rule for content blocks), centred on desktop */}
      <Container className="flex flex-col items-start text-left lg:items-center lg:text-center">
        <h2 className="text-[34px] font-bold leading-[1.45] text-ink md:text-[42px]">{heading}</h2>
        {intro && <p className="mt-[31px] max-w-[758px] text-base font-[450] leading-[1.6] text-stone">{intro}</p>}

        {/* Mobile carousel: full-bleed scroller, slides snap to the text's left edge and the next one peeks in */}
        <ul
          ref={carouselRef}
          aria-label="Photos"
          className="relative -mx-6 mt-10 flex w-[calc(100%+3rem)] snap-x snap-mandatory scroll-px-6 gap-5 cursor-grab overflow-x-auto overscroll-x-contain px-6 select-none active:cursor-grabbing [scrollbar-width:none] md:-mx-12 md:w-[calc(100%+6rem)] md:scroll-px-12 md:px-12 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <li key={image.thumb} aria-hidden={i !== index} className="w-[calc(100%-24px)] shrink-0 snap-start md:w-[calc(50%-10px)]">
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-ink/10">
                <ProgressiveImage src={image.src} placeholder={image.thumb} alt={image.alt} sizes={sizes2x(["(min-width: 768px)", "50vw"], [null, "90vw"])} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 hidden w-full max-w-[960px] items-center justify-center gap-10 lg:flex">
          <ArrowButton direction="left" onClick={() => go(-1)} className="flex" />

          <div className="relative aspect-[800/520] w-full max-w-[800px] overflow-hidden rounded-[20px] bg-ink/10">
            {/* All photos side by side; the strip slides to the current one */}
            <ul
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {images.map((image, i) => (
                <li key={image.thumb} aria-hidden={i !== index} className="relative h-full w-full shrink-0">
                  <ProgressiveImage src={image.src} placeholder={image.thumb} alt={image.alt} sizes={sizes2x([null, "800px"])} />
                </li>
              ))}
            </ul>
          </div>

          <ArrowButton direction="right" onClick={() => go(1)} className="flex" />
        </div>

        {/* Below lg: arrows at either edge with the current photo's name between them */}
        <div className="mt-6 flex w-full items-center justify-between gap-4 lg:hidden">
          <ArrowButton direction="left" onClick={() => go(-1)} className="flex" />
          <p aria-live="polite" className="min-w-0 truncate text-center text-base font-[450] leading-6 text-stone">
            {current.alt}
          </p>
          <ArrowButton direction="right" onClick={() => go(1)} className="flex" />
        </div>

        {/* Desktop: current photo's name above the thumbnails */}
        <p aria-live="polite" className="mt-5 hidden text-base font-[450] leading-6 text-stone lg:block">
          {current.alt}
        </p>

        {/* p-1 leaves room for the active ring */}
        <ul className="mt-3 hidden max-w-[808px] gap-[18px] p-1 lg:flex">
          {images.map((image, i) => (
            <li key={image.thumb} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${image.alt}`}
                aria-current={i === index}
                className={`relative block size-14 overflow-hidden rounded-xl transition ${
                  i === index ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={image.thumb} alt="" fill sizes="56px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>

        {/* Footer buttons go full width below lg */}
        {footer && <div className="mt-12 w-full max-lg:*:w-full max-lg:*:justify-center lg:mt-[68px] lg:w-auto">{footer}</div>}
      </Container>
    </section>
  );
}

function ArrowButton({ direction, onClick, className = "" }: { direction: "left" | "right"; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous image" : "Next image"}
      className={`size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink/85 ${className}`}
    >
      {direction === "left" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
    </button>
  );
}
