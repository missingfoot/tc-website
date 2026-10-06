"use client";

import type { Review } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Star } from "@/components/icons";
import Photo from "@/components/ui/Photo";
import { sizes2x } from "@/lib/images";

type ReviewsProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  reviews: Review[];
};

/** "Jennine Fox" → "JF" */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Carousel of cream review cards: the star rating, the review, and the reviewer's name beside their
 * photo (or their initials, for a review without one).
 */
export default function Reviews({ heading, intro, reviews, tone = "white" }: ReviewsProps) {
  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={reviews}
          wide
          getKey={(r) => r.name}
          label="Reviews"
          dotLabel={(i, n) => `Show review ${i} of ${n}`}
          renderItem={(r) => (
            <figure className="flex h-full flex-col gap-6 rounded-2xl bg-cream p-8 text-ink">
              <p role="img" aria-label={`Rated ${r.rating} out of 5`} className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`size-5 ${i < r.rating ? "text-ink" : "text-ink/15"}`} />
                ))}
              </p>
              <blockquote className="flex flex-col gap-3 text-base leading-relaxed">
                {r.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                {r.photo ? (
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-ink/10">
                    <Photo src={r.photo} alt="" sizes={sizes2x([null, "2.5rem"])} className="object-cover" />
                  </span>
                ) : (
                  <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                    {initials(r.name)}
                  </span>
                )}
                <span className="font-bold">{r.name}</span>
              </figcaption>
            </figure>
          )}
        />
      </Container>
    </Section>
  );
}
