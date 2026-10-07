"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { GalleryImage } from "@/lib/types";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { sizes2x } from "@/lib/images";
import ArrowButton from "@/components/ui/ArrowButton";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

type GalleryProps = {
  /** Optional: a location page's gallery goes straight into the photos. */
  heading?: string;
  intro?: string;
  images: GalleryImage[];
  /** Shown under the thumbnails, e.g. a button. */
  footer?: ReactNode;
  /** Section background (default cream). */
  tone?: SectionTone;
};

/**
 * Heading and intro, then the photos:
 * - below lg: a swipeable carousel of square slides, with arrows either side of the photo's name
 * - lg and up: a main image with side arrows, the photo's name and a thumbnail strip
 */
export default function Gallery({ heading, intro, images, footer, tone = "cream" }: GalleryProps) {
  const { ref: carouselRef, index, goTo, go } = useSnapCarousel(images.length);
  const current = images[index];

  return (
    <Section tone={tone}>
      {/* Left-aligned below lg (site-wide rule for content blocks), centred on desktop */}
      <Container className="flex flex-col items-start text-left lg:items-center lg:text-center">
        {heading && <SectionIntro heading={heading} intro={intro} />}

        {/* Mobile carousel: full-bleed scroller, slides snap to the text's left edge and the next one peeks in */}
        <ul
          ref={carouselRef}
          aria-label="Photos"
          className={`relative -mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory scroll-px-6 gap-5 cursor-grab overflow-x-auto overscroll-x-contain px-6 select-none active:cursor-grabbing [scrollbar-width:none] md:-mx-12 md:w-[calc(100%+6rem)] md:scroll-px-12 md:px-12 lg:hidden [&::-webkit-scrollbar]:hidden ${heading ? "mt-10" : ""}`}
        >
          {images.map((image, i) => (
            <li key={image.thumb} aria-hidden={i !== index} className="w-[calc(100%-24px)] shrink-0 snap-start md:w-[calc(50%-10px)]">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink/10">
                <ProgressiveImage src={image.src} placeholder={image.thumb} alt={image.alt} position={image.position} sizes={sizes2x(["(min-width: 768px)", "50vw"], [null, "90vw"])} />
              </div>
            </li>
          ))}
        </ul>

        <div className={`hidden w-full max-w-240 items-center justify-center gap-10 lg:flex ${heading ? "mt-14" : ""}`}>
          <ArrowButton direction="left" label="Previous image" onClick={() => go(-1)} />

          <div className="relative aspect-[800/520] w-full max-w-200 overflow-hidden rounded-2xl bg-ink/10">
            {/* All photos side by side; the strip slides to the current one */}
            <ul
              className="flex h-full transition-transform duration-700 ease-smooth motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {images.map((image, i) => (
                <li key={image.thumb} aria-hidden={i !== index} className="relative h-full w-full shrink-0">
                  <ProgressiveImage src={image.src} placeholder={image.thumb} alt={image.alt} position={image.position} sizes={sizes2x([null, "800px"])} />
                </li>
              ))}
            </ul>
          </div>

          <ArrowButton direction="right" label="Next image" onClick={() => go(1)} />
        </div>

        {/* Below lg: arrows at either edge with the current photo's name between them */}
        <div className="mt-6 flex w-full items-center justify-between gap-4 lg:hidden">
          <ArrowButton direction="left" label="Previous image" onClick={() => go(-1)} />
          <p aria-live="polite" className="min-w-0 truncate text-center text-base leading-6 text-stone">
            {current.alt}
          </p>
          <ArrowButton direction="right" label="Next image" onClick={() => go(1)} />
        </div>

        {/* Desktop: current photo's name above the thumbnails */}
        <p aria-live="polite" className="mt-5 hidden text-base leading-6 text-stone lg:block">
          {current.alt}
        </p>

        {/* p-1 leaves room for the active ring */}
        <ul className="mt-3 hidden max-w-200 gap-4 p-1 lg:flex">
          {images.map((image, i) => (
            <li key={image.thumb} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${image.alt}`}
                aria-current={i === index}
                className={`relative block size-14 overflow-hidden rounded-xl bg-cream-dark transition ${
                  i === index ? "ring-2 ring-ink ring-offset-2 ring-offset-transparent" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={image.thumb} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: image.position }} />
              </button>
            </li>
          ))}
        </ul>

        {/* Footer buttons go full width below lg */}
        {footer && <div className="mt-12 w-full max-lg:*:w-full max-lg:*:justify-center lg:mt-16 lg:w-auto">{footer}</div>}
      </Container>
    </Section>
  );
}
