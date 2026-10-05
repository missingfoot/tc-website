import type { ReactNode } from "react";
import type { Price } from "@/lib/types";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";

type PricingProps = {
  heading: string;
  intro?: string;
  prices: Price[];
  /** Under the cards, e.g. an "Enquire now" button (made full width below lg). */
  action?: ReactNode;
  /** Section background (default cream; the cards are white). */
  tone?: SectionTone;
};

/** Heading and intro, then side-by-side price cards and an optional button (full width below lg). */
export default function Pricing({ heading, intro, prices, action, tone = "cream" }: PricingProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-8 lg:mt-16">
          {/* Two prices side by side; a single price as one narrower card */}
          <ul className={`grid w-full gap-5 lg:gap-8 ${prices.length === 1 ? "max-w-xs" : "grid-cols-2"}`}>
            {prices.map((price) => (
              <li key={price.label} className="flex flex-col items-center rounded-2xl bg-white px-2 py-6 text-center">
                <span className="text-base text-stone">{price.label}</span>
                <span className="mt-2 text-2xl font-bold text-ink">{price.amount}</span>
                <span className="mt-1 text-sm text-stone">{price.period}</span>
              </li>
            ))}
          </ul>
          {action && <div className="w-full *:w-full *:justify-center lg:w-auto lg:*:w-auto">{action}</div>}
        </div>
      </Container>
    </Section>
  );
}
