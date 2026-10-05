"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import placeholders from "@/lib/blur-placeholders.json";

const blurs: Record<string, string | undefined> = placeholders;

/** The inline blur preview generated for a photo in `public/images`, if there is one. */
export function blurFor(src: string | undefined) {
  return src ? blurs[src] : undefined;
}

/**
 * - loading: the blurred preview shows, the photo is hidden
 * - fading: the photo fades in over the preview
 * - shown: the photo is fully visible and the preview is gone
 */
type State = "loading" | "fading" | "shown";

/**
 * Fill image for photos (place inside a positioned, overflow-hidden parent). Shows a blurred
 * preview straight away (inlined, no extra request), then fades the photo in once it has
 * loaded, so slow connections never see an empty box. A photo that's already loaded when it
 * mounts (e.g. cached) shows at once, without the fade. Previews come from
 * `src/lib/blur-placeholders.json`, generated from `public/images` by `npm run blur` (runs
 * before `dev` and `build`); a photo without one simply loads as normal.
 */
export default function Photo({ alt, className = "", style, onLoad, ...props }: Omit<ImageProps, "fill">) {
  const blur = typeof props.src === "string" ? blurFor(props.src) : undefined;
  const [state, setState] = useState<State>(blur ? "loading" : "shown");
  // Already loaded when it mounts (cached, or arrived before the page's JavaScript ran): no fade.
  // Stable, so it only runs on mount (a new function each render would re-run it mid-fade).
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) setState("shown");
  }, []);

  return (
    <>
      {blur && state !== "shown" && (
        // Same classes as the photo (object-cover, z-index…) so it sits exactly where the photo
        // will; scale-110 hides the soft, see-through edges the blur creates
        <div
          aria-hidden="true"
          className={`${className} absolute inset-0 scale-110 bg-cover bg-no-repeat blur-xl`}
          style={{ backgroundImage: `url("${blur}")`, backgroundPosition: style?.objectPosition ?? "center" }}
        />
      )}
      <Image
        alt={alt}
        fill
        data-photo
        ref={checkLoaded}
        onLoad={(e) => {
          setState((s) => (s === "loading" ? "fading" : s));
          onLoad?.(e);
        }}
        onError={() => setState("shown")}
        onTransitionEnd={() => setState("shown")}
        className={`${className} ${state === "loading" ? "opacity-0" : ""} ${state === "fading" ? "transition-opacity duration-500 motion-reduce:transition-none" : ""}`}
        style={style}
        {...props}
      />
    </>
  );
}
