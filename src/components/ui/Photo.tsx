import Image, { type ImageProps } from "next/image";
import placeholders from "@/lib/blur-placeholders.json";

const blurs: Record<string, string | undefined> = placeholders;

/** The inline blur preview generated for a photo in `public/images`, if there is one. */
export function blurFor(src: string | undefined) {
  return src ? blurs[src] : undefined;
}

/**
 * `next/image` for photos: shows a blurred preview straight away (inlined, no extra request)
 * while the full image loads, so slow connections never see an empty box. Previews come from
 * `src/lib/blur-placeholders.json`, generated from `public/images` by `npm run blur` (runs
 * before `dev` and `build`). Images without one (logos, SVGs) load as normal.
 */
export default function Photo({ alt, ...props }: ImageProps) {
  const blur = typeof props.src === "string" ? blurFor(props.src) : undefined;
  return <Image alt={alt} placeholder={blur ? "blur" : "empty"} blurDataURL={blur} {...props} />;
}
