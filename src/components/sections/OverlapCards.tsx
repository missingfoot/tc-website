import Image from "next/image";
import type { CaptionedImage, CircleImage, Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import TiltCard from "@/components/ui/TiltCard";
import { sizes2x } from "@/lib/images";

type OverlapCardsProps = {
  /** Photo card with a dark panel and a button. */
  cta: { image: CircleImage; link: Cta };
  /** Photo card overlapping the top right. */
  top: CaptionedImage;
  /** Wide photo card underneath the other two. */
  bottom: CaptionedImage;
};

// Desktop layout from the Figma "Group 60" (893 × 653): each card's left/top/width as a %.
const GROUP_RATIO = "893 / 653";
const CARDS = {
  cta: { left: 0, top: 0, width: 39.64 },
  top: { left: 47.7, top: 9.34, width: 52.3, ratio: "467 / 286" },
  bottom: { left: 15.57, top: 47.93, width: 67.3, ratio: "601 / 340" },
};
const SHADOW = "lg:drop-shadow-card";

/**
 * Three overlapping cards on desktop: a CTA card and a captioned photo floating over a wide
 * captioned photo. Stacks on mobile, with captions moving below the photos. Cards tilt
 * subtly toward the mouse on hover.
 */
export default function OverlapCards({ cta, top, bottom }: OverlapCardsProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="flex flex-col gap-10 lg:relative lg:mx-auto lg:block lg:max-w-[893px]">
          {/* Sizes the desktop group; cards are absolutely positioned inside it */}
          <div aria-hidden="true" className="hidden lg:block" style={{ aspectRatio: GROUP_RATIO }} />

          <div className={`${POSITIONED} lg:z-10 ${SHADOW}`} style={place(CARDS.cta)}>
            <TiltCard className="overflow-hidden rounded-2xl bg-ink">
              <div className="relative aspect-[354/220]">
                <Image
                  src={cta.image.src}
                  alt={cta.image.alt}
                  fill
                  sizes={sizes2x(["(min-width: 1024px)", "354px"], [null, "92vw"])}
                  quality={90}
                  className="object-cover"
                  style={{ objectPosition: cta.image.position ?? "center" }}
                />
              </div>
              <div className="p-8">
                <Button href={cta.link.href} variant="glass" arrow className="w-full justify-center">
                  {cta.link.label}
                </Button>
              </div>
            </TiltCard>
          </div>

          {/* Underneath in the desktop stack, but last on mobile (as in the Figma) */}
          <PhotoCard image={bottom} card={CARDS.bottom} className="order-last" sizes={sizes2x(["(min-width: 1024px)", "601px"], [null, "92vw"])} />
          <PhotoCard image={top} card={CARDS.top} className={`lg:z-10 ${SHADOW}`} sizes={sizes2x(["(min-width: 1024px)", "467px"], [null, "92vw"])} />
        </div>
      </Container>
    </Section>
  );
}

// Desktop placement from the --left/--top/--width variables set by place()
const POSITIONED = "lg:absolute lg:left-(--left) lg:top-(--top) lg:w-(--width)";

/** Desktop position as CSS variables, applied by the POSITIONED classes from lg up. */
function place(card: { left: number; top: number; width: number }) {
  return { "--left": `${card.left}%`, "--top": `${card.top}%`, "--width": `${card.width}%` } as React.CSSProperties;
}

/**
 * Photo with a caption: overlaid on a bottom gradient on desktop, below the photo on mobile.
 */
function PhotoCard({ image, card, sizes, className = "" }: { image: CaptionedImage; card: { left: number; top: number; width: number; ratio: string }; sizes: string; className?: string }) {
  return (
    <figure className={`${POSITIONED} ${className}`} style={place(card)}>
      <TiltCard className="lg:relative">
        <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: card.ratio }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            quality={90}
            className="object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)] lg:block" />
        </div>
        <figcaption className="mt-3 text-center text-sm leading-5 text-stone lg:absolute lg:bottom-5 lg:left-5 lg:mt-0 lg:text-left lg:text-base lg:font-medium lg:text-white">
          {image.caption}
        </figcaption>
      </TiltCard>
    </figure>
  );
}
