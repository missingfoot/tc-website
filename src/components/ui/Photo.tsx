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
 * mounts (e.g. cached) shows at once, without the fade.
 *
 * Above-the-fold photos (`loading="eager"`, `fetchPriority="high"` or `preload`) start visible
 * in the server HTML, so they draw as soon as they arrive even if the page's JavaScript is slow
 * (hiding them until it ran kept already-downloaded hero photos invisible for seconds on slow
 * phones). Once it runs, one that's still loading is hidden and fades in like the rest.
 * Previews come from
 * `src/lib/blur-placeholders.json`, generated from `public/images` by `npm run blur` (runs
 * before `dev` and `build`); a photo without one simply loads as normal.
 */
type PhotoProps = Omit<ImageProps, "fill"> & {
  /** A blur preview of your own (e.g. a blog image's, kept out of the shared file), in place of the generated one. */
  preview?: string;
};

export default function Photo({ alt, className = "", style, onLoad, preview, ...props }: PhotoProps) {
  const blur = preview ?? (typeof props.src === "string" ? blurFor(props.src) : undefined);
  const aboveFold = props.loading === "eager" || props.fetchPriority === "high" || !!props.preload;
  const [state, setState] = useState<State>(blur ? "loading" : "shown");
  // Above-the-fold photos stay visible until the page's JavaScript runs (see above)
  const [canHide, setCanHide] = useState(!aboveFold);
  // Already loaded when it mounts (cached, or arrived before the page's JavaScript ran): no fade.
  // Still loading: hide it so it fades in. Stable, so it only runs on mount (a new function each
  // render would re-run it mid-fade).
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) setState("shown");
    else if (img) setCanHide(true);
  }, []);

  return (
    <>
      {blur && state !== "shown" && (
        // Same classes as the photo (object-cover, z-index…) so it sits exactly where the photo
        // will; scale-110 hides the soft, see-through edges the blur creates
        // A span, not a div, so a photo can sit inside a paragraph (e.g. a Markdown image in a blog post)
        <span
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
        // Only the fade: a transition of the caller's (e.g. a hover zoom) mid-load would remove the preview early
        onTransitionEnd={(e) => e.propertyName === "opacity" && setState("shown")}
        className={`${className} ${state === "loading" && canHide ? "opacity-0" : ""} ${state === "fading" ? "transition-opacity duration-800 ease-out motion-reduce:transition-none" : ""}`}
        style={style}
        {...props}
      />
    </>
  );
}
