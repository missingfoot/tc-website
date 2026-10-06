import Photo from "@/components/ui/Photo";
import { blogImage } from "@/lib/blog";
import { sizes2x } from "@/lib/images";

type BlogImageProps = {
  src: string;
  alt?: string;
  /** Shown under the image (posts write `<Figure src="…" alt="…" caption="…" />`). */
  caption?: string;
  /** In view when the page opens (a post's cover): loads straight away and shows without waiting for the page's JavaScript. */
  aboveFold?: boolean;
  /** Shown wider than the text column (a post's cover, up to 64rem). */
  wide?: boolean;
};

/**
 * An image in a blog post: Markdown's `![alt](src)`, or `<Figure>` for one with a caption. Shown
 * at its own shape with its blurred preview (sizes from images.json), never wider than it really
 * is (some old uploads are small), up to the width of the text column.
 */
export default function BlogImage({ src, alt = "", caption, aboveFold = false, wide = false }: BlogImageProps) {
  const info = blogImage(src);
  // Spans, not divs: Markdown puts a lone image inside a paragraph
  const image = (
    <span
      className="relative mx-auto block w-full overflow-hidden rounded-2xl bg-ink/5"
      style={{ aspectRatio: info ? `${info.width} / ${info.height}` : "3 / 2", maxWidth: info?.width }}
    >
      <Photo
        src={src}
        alt={alt}
        preview={info?.blur}
        sizes={sizes2x(["(min-width: 768px)", wide ? "64rem" : "48rem"], [null, "100vw"])}
        quality={90}
        className="object-cover"
        {...(aboveFold && { loading: "eager", fetchPriority: "high" })}
      />
    </span>
  );
  if (!caption) return image;
  return (
    <figure>
      {image}
      <figcaption className="mt-3 text-center text-sm text-stone">{caption}</figcaption>
    </figure>
  );
}
