"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { CircleImage } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { text } from "@/lib/styles";
import { sizes2x } from "@/lib/images";

type ImageCarouselProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  images: CircleImage[];
  /** Line under the carousel, e.g. a link to the Instagram account. */
  footer?: ReactNode;
};

/** Carousel of square photos, e.g. an Instagram feed. */
export default function ImageCarousel({ heading, intro, images, footer, tone = "white" }: ImageCarouselProps) {
  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={images}
          getKey={(img) => img.src}
          label={heading}
          slideClassName="relative aspect-square overflow-hidden rounded-2xl bg-cream"
          renderItem={(img) => (
            <Image src={img.src} alt={img.alt} fill draggable={false} sizes={sizes2x([null, "300px"])} quality={90} className="object-cover" />
          )}
        />
        {footer && <p className={`mt-8 text-left lg:text-center ${text.body}`}>{footer}</p>}
      </Container>
    </Section>
  );
}
