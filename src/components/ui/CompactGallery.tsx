"use client";

import Image from "next/image";
import type { CircleImage, GalleryImage } from "@/lib/types";
import ArrowButton from "@/components/ui/ArrowButton";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

type CompactGalleryProps = {
  images: GalleryImage[];
  /** A floor plan drawing, shown on white as the last slide. */
  floorPlan?: CircleImage;
  /** `sizes` for the photos: the box's displayed width. */
  sizes: string;
  /** Box shape, e.g. "aspect-[7/4]". */
  aspect?: string;
  /** Box classes, e.g. its rounding (default rounded-2xl; none when it sits flush in a card). */
  className?: string;
};

/**
 * A gallery that fits in a column: one photo at a time in a rounded box, swipeable (or
 * draggable with a mouse), with previous/next arrows inside the photo.
 */
export default function CompactGallery({ images, floorPlan, sizes, aspect = "aspect-[7/4]", className = "rounded-2xl" }: CompactGalleryProps) {
  const count = images.length + (floorPlan ? 1 : 0);
  const { ref, index, go } = useSnapCarousel(count);

  return (
    <div className={`relative ${aspect} overflow-hidden bg-ink/10 ${className}`}>
      <ul
        ref={ref}
        aria-label="Photos"
        className="flex h-full snap-x snap-mandatory cursor-grab overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <li key={image.thumb} aria-hidden={i !== index} className="relative h-full w-full shrink-0 snap-start">
            <ProgressiveImage src={image.src} placeholder={image.thumb} alt={image.alt} position={image.position} sizes={sizes} />
          </li>
        ))}
        {floorPlan && (
          <li aria-hidden={index !== count - 1} className="relative h-full w-full shrink-0 snap-start bg-white">
            {/* Line drawing: served as the original file (small, lossless), since re-encoding blurs thin lines */}
            <Image src={floorPlan.src} alt={floorPlan.alt} fill unoptimized draggable={false} className="object-contain p-4" />
          </li>
        )}
      </ul>

      {count > 1 && (
        <>
          <ArrowButton direction="left" label="Previous image" onClick={() => go(-1)} className="absolute top-1/2 left-4 -translate-y-1/2" />
          <ArrowButton direction="right" label="Next image" onClick={() => go(1)} className="absolute top-1/2 right-4 -translate-y-1/2" />
        </>
      )}
    </div>
  );
}
