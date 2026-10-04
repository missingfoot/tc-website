"use client";

import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import VideoModal from "@/components/ui/VideoModal";
import { Play } from "@/components/icons";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";
import { sizes2x } from "@/lib/images";

type TestimonialsProps = {
  heading: string;
  intro?: string;
  testimonials: Testimonial[];
};

/**
 * Swipe/drag carousel of resident portraits, each with a "Meet <name>" button that plays their
 * video, and dots underneath to jump between them.
 */
export default function Testimonials({ heading, intro, testimonials }: TestimonialsProps) {
  const { ref, index, goTo } = useSnapCarousel(testimonials.length);
  const [playing, setPlaying] = useState<Testimonial | null>(null);

  return (
    <Section className="overflow-hidden bg-cream">
      <Container>
        <SectionIntro heading={heading} intro={intro} />

        {/* Full-bleed: the scroller spans the whole window (negative margins = the page gutter,
            --g at xl), so portraits stay visible as they pass either edge, while slides still
            snap to the content's left edge. The trailing spacer lets the last portraits scroll
            to the start too, so every dot is reachable. */}
        <ul
          ref={ref}
          aria-label="Resident videos"
          className="-mx-6 mt-10 flex cursor-grab snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto overscroll-x-contain px-6 select-none active:cursor-grabbing [scrollbar-width:none] md:-mx-12 md:scroll-px-12 md:px-12 lg:mt-16 xl:[--g:max(12rem,calc((100vw-90rem)/2+12rem))] xl:-mx-(--g) xl:scroll-px-(--g) xl:px-(--g) [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <li key={t.name + i} className="relative aspect-square w-75 shrink-0 snap-start overflow-hidden rounded-2xl bg-ink/10">
              <Image
                src={t.image.src}
                alt={t.image.alt}
                fill
                draggable={false}
                sizes={sizes2x([null, "300px"])}
                quality={90}
                className="object-cover"
                style={{ objectPosition: t.image.position ?? "center" }}
              />
              <Button variant="white" onClick={() => setPlaying(t)} className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Play className="size-4 shrink-0" />
                Meet {t.name}
              </Button>
            </li>
          ))}
          <li aria-hidden="true" className="w-[calc(100%-18.75rem-2rem)] shrink-0" />
        </ul>

        {/* Dots: centred under the first portrait on mobile, under the page on desktop */}
        <div className="mt-6 flex w-75 justify-center lg:mt-12 lg:w-full">
          {testimonials.map((t, i) => (
            <button
              key={t.name + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show resident ${i + 1} of ${testimonials.length}`}
              aria-current={i === index}
              className="p-1.5"
            >
              <span className={`block size-2 rounded-full transition-colors ${i === index ? "bg-ink" : "bg-ink/15 hover:bg-ink/40"}`} />
            </button>
          ))}
        </div>
      </Container>

      <VideoModal video={playing ? (playing.video ?? "") : null} title={playing ? `Meet ${playing.name}` : ""} onClose={() => setPlaying(null)} />
    </Section>
  );
}
