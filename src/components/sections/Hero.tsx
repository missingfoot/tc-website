import type { StaticImageData } from "next/image";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { sizes2x } from "@/lib/images";

type HeroProps = {
  image: string | StaticImageData;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: Cta;
  /** Curved bottom edge from the Figma "Mask". On by default. */
  curved?: boolean;
  /** Parallax strength for the background image (0 turns it off). */
  parallax?: number;
};

// A circle sitting on the hero's bottom edge. Its radius grows with the page width
// (cqw, from the @container wrapper): exactly 5000px at 1440px as in the Figma, and
// smaller on phones so the curve stays visible there.
const curvedMask = {
  "--mask-r": "max(429cqw - 1178px, 120cqw)",
  clipPath: "circle(var(--mask-r) at 50% calc(100% - var(--mask-r)))",
} as React.CSSProperties;

export default function Hero({ image, imageAlt = "", eyebrow, title, subtitle, cta, curved = true, parallax = 0.4 }: HeroProps) {
  return (
    <div className="@container">
      <section className="relative h-[640px] w-full overflow-hidden bg-black" style={curved ? curvedMask : undefined}>
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
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_37.03%,rgba(0,0,0,0.6)_116.41%)]"
        />

        <Container className="relative pt-[190px] text-white">
          <div className="flex max-w-[384px] flex-col gap-2.5 tracking-[-0.02em]">
            {eyebrow && <p className="text-[22px] font-bold leading-[1.1]">{eyebrow}</p>}
            <h1 className="text-[64px] font-black leading-[1.1]">{title}</h1>
            {subtitle && <p className="text-lg font-medium leading-[1.2] sm:whitespace-nowrap">{subtitle}</p>}
          </div>

          {cta && (
            <Button href={cta.href} arrow className="mt-[30px]">
              {cta.label}
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
}
