"use client";

import Photo from "@/components/ui/Photo";
import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import VideoModal from "@/components/ui/VideoModal";
import { Play } from "@/components/icons";
import { sizes2x } from "@/lib/images";

type TestimonialsProps = {
  /** Section background (default cream). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  testimonials: Testimonial[];
};

/** Carousel of resident portraits, each with a "Meet <name>" button that plays their video. */
export default function Testimonials({ heading, intro, testimonials, tone = "cream" }: TestimonialsProps) {
  const [playing, setPlaying] = useState<Testimonial | null>(null);

  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={testimonials}
          getKey={(t, i) => t.name + i}
          label="Resident videos"
          dotLabel={(i, n) => `Show resident ${i} of ${n}`}
          slideClassName="relative aspect-square overflow-hidden rounded-2xl bg-ink/10"
          renderItem={(t) => (
            <>
              <Photo
                src={t.image.src}
                alt={t.image.alt}
                draggable={false}
                sizes={sizes2x([null, "300px"])}
                quality={90}
                className="object-cover"
                style={{ objectPosition: t.image.position ?? "center" }}
              />
              <Button variant="white" onClick={() => setPlaying(t)} className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Play className="shrink-0" />
                Meet {t.name}
              </Button>
            </>
          )}
        />
      </Container>

      <VideoModal video={playing ? (playing.video ?? "") : null} title={playing ? `Meet ${playing.name}` : ""} onClose={() => setPlaying(null)} />
    </Section>
  );
}
