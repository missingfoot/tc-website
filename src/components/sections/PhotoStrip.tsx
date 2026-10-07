"use client";

import Image from "next/image";
import type { CircleImage, GalleryImage } from "@/lib/types";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";
import { sizes2x } from "@/lib/images";

type PhotoStripProps = {
  images: GalleryImage[];
  /** Accessible name for the list, e.g. "Photos of the Cosy studio". */
  label: string;
  /** A floor plan drawing, shown on white as the last slide. */
  floorPlan?: CircleImage;
};

/**
 * The top of a page without a photo hero: a dark band behind the site nav (white, and
 * transparent at the top of the page), then a strip of photos running from the screen's edge,
 * a small gap apart, that swipes (or drags with a mouse) and snaps to each photo.
 */
export default function PhotoStrip({ images, label, floorPlan }: PhotoStripProps) {
  const count = images.length + (floorPlan ? 1 : 0);
  const { ref, index, goTo } = useSnapCarousel(count);

  return (
    <>
      <div aria-hidden="true" className="h-24 bg-ink" />
      <ul
        ref={ref}
        aria-label={label}
        className="flex cursor-grab snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto p-4 overscroll-x-contain select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image) => (
          <li key={image.thumb} className="relative aspect-[6/5] w-[85vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-ink/10 md:w-[55vw] lg:w-[42rem]">
            <ProgressiveImage
              src={image.src}
              placeholder={image.thumb}
              alt={image.alt}
              position={image.position}
              sizes={sizes2x(["(min-width: 1024px)", "42rem"], ["(min-width: 768px)", "55vw"], [null, "85vw"])}
            />
          </li>
        ))}
        {floorPlan && (
          <li className="relative aspect-[6/5] w-[85vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-white md:w-[55vw] lg:w-[42rem]">
            {/* Line drawing: served as the original file (small, lossless), since re-encoding blurs thin lines */}
            <Image src={floorPlan.src} alt={floorPlan.alt} fill unoptimized draggable={false} className="object-contain p-6" />
          </li>
        )}
      </ul>

      {/* Mobile only: dots to show where you are (desktop shows several photos at once) */}
      {count > 1 && (
        <div className="flex justify-center lg:hidden">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${floorPlan && i === count - 1 ? "the floor plan" : `photo ${i + 1} of ${images.length}`}`}
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
