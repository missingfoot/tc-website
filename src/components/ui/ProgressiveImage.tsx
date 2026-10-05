"use client";

import Image from "next/image";
import { blurFor } from "@/components/ui/Photo";
import { useState } from "react";

type ProgressiveImageProps = {
  /** Full-size image. If missing, only the blurred placeholder is shown. */
  src?: string;
  /** Small image (e.g. a thumbnail) shown heavily blurred while `src` loads. */
  placeholder: string;
  alt: string;
  sizes: string;
  className?: string;
};

/**
 * Fill image that "blurs up": shows a blurred low-res placeholder straight away, then fades
 * the full-size image in once it has loaded. Until the thumbnail itself arrives, the photo's
 * inline blur preview (see `Photo`) stands in. Place inside a positioned, overflow-hidden parent.
 */
export default function ProgressiveImage({ src, placeholder, alt, sizes, className = "" }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const blur = blurFor(src);

  return (
    <>
      {/* scale-110 hides the soft, see-through edges the blur creates */}
      <Image
        src={placeholder}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        alt={src ? "" : alt}
        aria-hidden={src ? true : undefined}
        fill
        sizes="128px"
        draggable={false}
        className={`scale-110 object-cover blur-2xl ${className}`}
      />
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
      )}
    </>
  );
}
