"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import placeholders from "@/lib/blur-placeholders.json";

const blurs: Record<string, string | undefined> = placeholders;

// Photos that have loaded during this visit. Going back to a page creates its photos afresh, and a
// lazy one isn't "complete" yet when it mounts even though it's cached, so without this it would
// blur and fade in again. Module state, so it lasts across client-side navigations.
const loaded = new Set<string>();

/** Notes that a photo has loaded, so it shows at once next time. */
export const markLoaded = (src: string | undefined) => src && loaded.add(src);

/** Whether a photo has already loaded during this visit (it's in the browser's cache). */
export const hasLoaded = (src: string | undefined) => !!src && loaded.has(src);

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
  const src = typeof props.src === "string" ? props.src : undefined;
  const [state, setState] = useState<State>(blur ? "loading" : "shown");
  // Above-the-fold photos stay visible until the page's JavaScript runs (see above). Photos seen
  // before this visit are never hidden: they draw straight away over the preview, which covers the
  // moment the browser takes to decode them (otherwise the background, e.g. a hero's black, flashes).
  const [canHide, setCanHide] = useState(!aboveFold && !hasLoaded(src));
  // Already loaded when it mounts (cached, or arrived before the page's JavaScript ran): no fade.
  // Still loading: hide it so it fades in. Stable, so it only runs on mount (a new function each
  // render would re-run it mid-fade).
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) {
      setState("shown");
      markLoaded(img.getAttribute("data-src") ?? undefined);
    } else if (img && !hasLoaded(img.getAttribute("data-src") ?? undefined)) setCanHide(true);
  }, []);

  return (
    <>
      {blur && state !== "shown" && (
        // Same classes as the photo (object-cover, z-index, rounding…) so it sits exactly where the
        // photo will. The preview inside is scaled up to hide the soft, see-through edges the blur
        // creates, and clipped here so it never spills past the photo's box (e.g. onto a card's text).
        // Spans, not divs, so a photo can sit inside a paragraph (e.g. a Markdown image in a blog post)
        <span aria-hidden="true" className={`${className} absolute inset-0 overflow-hidden`}>
          <span
            className="absolute inset-0 scale-110 bg-cover bg-no-repeat blur-xl"
            style={{ backgroundImage: `url("${blur}")`, backgroundPosition: style?.objectPosition ?? "center" }}
          />
        </span>
      )}
      <Image
        alt={alt}
        fill
        data-photo
        data-src={src}
        ref={checkLoaded}
        onLoad={(e) => {
          markLoaded(src);
          if (canHide) setState((s) => (s === "loading" ? "fading" : s));
          // Already visible (seen before, or a hero before the page's JavaScript ran): remove the
          // preview once the photo is decoded, so nothing behind it shows for a frame
          else e.currentTarget.decode().catch(() => {}).then(() => setState("shown"));
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
