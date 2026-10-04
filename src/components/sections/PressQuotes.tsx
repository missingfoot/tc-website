"use client";

import type { PressQuote } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { QuoteMark } from "@/components/icons";

type PressQuotesProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  quotes: PressQuote[];
};

/** Carousel of cream quote cards, each opening with a large quote mark and ending with the publication's logo. */
export default function PressQuotes({ heading, intro, quotes, tone = "white" }: PressQuotesProps) {
  return (
    <Section tone={tone} className="overflow-hidden">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={quotes}
          getKey={(q, i) => q.publication + i}
          label="Press quotes"
          dotLabel={(i, n) => `Show quote ${i} of ${n}`}
          renderItem={(q) => (
            <figure className="flex h-full min-h-80 flex-col justify-between gap-8 rounded-2xl bg-cream p-8 text-ink">
              <div>
                <QuoteMark className="h-8 w-11" />
                <blockquote className="mt-6 text-lg leading-relaxed">{q.quote}</blockquote>
              </div>
              <figcaption className="flex justify-end">
                {q.logo ? (
                  // brightness-0 renders any logo solid black, toned down to sit with the text
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={q.logo} alt={q.publication} className="h-8 w-auto max-w-44 object-contain opacity-80 brightness-0" />
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
