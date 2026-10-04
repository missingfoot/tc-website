import type { StaticImageData } from "next/image";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ParallaxImage from "@/components/ui/ParallaxImage";
import VideoButton from "@/components/ui/VideoButton";
import { sizes2x } from "@/lib/images";

type HeroProps = {
  image: string | StaticImageData;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: Cta;
  /** Shows a "play" button that opens this video in the lightbox (instead of `cta`). */
  video?: { label: string; url: string };
  /** Curved bottom edge from the Figma "Mask" (desktop only). On by default. */
  curved?: boolean;
  /** Parallax strength for the background image (0 turns it off). */
  parallax?: number;
};

// Desktop only (the mobile design has a straight edge): a circle sitting on the hero's
// bottom edge. Its radius grows with the page width (cqw, from the @container wrapper):
// exactly 5000px at 1440px as in the Figma, and smaller on narrower screens so the curve
// stays visible.
const curvedMask = "[--mask-r:max(429cqw-1178px,120cqw)] lg:[clip-path:circle(var(--mask-r)_at_50%_calc(100%-var(--mask-r)))]";

export default function Hero({ image, imageAlt = "", eyebrow, title, subtitle, cta, video, curved = true, parallax = 0.4 }: HeroProps) {
  return (
    <div className="@container">
      <section className={`relative h-130 w-full overflow-hidden bg-black lg:h-160 ${curved ? curvedMask : ""}`}>
        <ParallaxImage
          src={image}
          alt={imageAlt}
          sizes={sizes2x([null, "100vw"])}
          fetchPriority="high"
          quality={90}
          speed={parallax}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          // Mobile fades harder to black behind the bottom-aligned text (both from the Figma)
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_52%,#000_107%)] lg:bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_37.03%,rgba(0,0,0,0.6)_116.41%)]"
        />

        {/* Mobile: text sits at the bottom, 40px above the raised white intro (which overlaps
            the hero by 2rem). Desktop: top-aligned. */}
        <Container className="relative flex h-full flex-col items-start justify-end pb-18 text-white lg:justify-start lg:pt-48 lg:pb-0">
          <div className="flex max-w-sm flex-col gap-2.5 tracking-tight lg:max-w-2xl">
            {eyebrow && <p className="text-2xl font-bold leading-tight">{eyebrow}</p>}
            <h1 className="text-5xl font-black leading-tight lg:text-6xl">{title}</h1>
            {subtitle && <p className="max-w-xl text-lg font-medium leading-tight text-balance">{subtitle}</p>}
          </div>

          {video && <VideoButton label={video.label} video={video.url} className="mt-8" />}
          {cta && !video && (
            <Button href={cta.href} arrow className="mt-8">
              {cta.label}
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
}
