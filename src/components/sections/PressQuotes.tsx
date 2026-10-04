"use client";

import type { PressQuote } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";

type PressQuotesProps = {
  heading: string;
  intro?: string;
  quotes: PressQuote[];
};

/** Carousel of dark quote cards with the publication's logo. */
export default function PressQuotes({ heading, intro, quotes }: PressQuotesProps) {
  return (
    <Section className="overflow-hidden bg-white">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={quotes}
          getKey={(q, i) => q.publication + i}
          label="Press quotes"
          dotLabel={(i, n) => `Show quote ${i} of ${n}`}
          renderItem={(q) => (
            <figure className="flex h-full min-h-80 flex-col justify-between gap-8 rounded-2xl bg-ink p-8 text-white">
              <blockquote className="text-lg leading-relaxed">{q.quote}</blockquote>
              <figcaption className="flex justify-end">
                {q.logo ? (
                  // brightness-0 invert turns any logo white for the dark card
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={q.logo} alt={q.publication} className="h-8 w-auto max-w-44 object-contain brightness-0 invert" />
                ) : (
                  <span className="font-serif text-3xl font-bold tracking-tight">{q.publication}</span>
                )}
              </figcaption>
            </figure>
          )}
        />
      </Container>
    </Section>
  );
}
