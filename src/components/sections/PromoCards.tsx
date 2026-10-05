import Photo from "@/components/ui/Photo";
import type { PromoCard } from "@/lib/types";
import Button from "@/components/ui/Button";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import { sizes2x } from "@/lib/images";

/** Photo cards with a heading and a button: side by side on desktop, stacked on mobile. */
type PromoCardsProps = {
  cards: PromoCard[];
  /** Section background (default white). */
  tone?: SectionTone;
  /** Mobile card shape: "short" (4:3, default) or "tall" (4:5, shows more of the photo). Desktop is unchanged. */
  mobileShape?: "short" | "tall";
};

const mobileShapes = { short: "aspect-[4/3]", tall: "aspect-[4/5]" };

export default function PromoCards({ cards, tone = "white", mobileShape = "short" }: PromoCardsProps) {
  return (
    <Section tone={tone}>
      <Container>
        <ul className="grid gap-8 lg:grid-cols-2">
          {cards.map((card) => (
            <li key={card.heading}>
              <PromoCardItem card={card} shape={mobileShapes[mobileShape]} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function PromoCardItem({ card, shape }: { card: PromoCard; shape: string }) {
  return (
    <article className={`relative isolate flex ${shape} flex-col justify-between overflow-hidden rounded-2xl bg-ink p-8 lg:aspect-[576/415] lg:p-10`}>
      <Photo
        src={card.image.src}
        alt={card.image.alt}
        fill
        sizes={sizes2x(["(min-width: 1024px)", "50vw"], [null, "100vw"])}
        quality={90}
        className="-z-10 object-cover"
        style={{ objectPosition: card.image.position ?? "center" }}
      />
      {/* Black gradient behind the heading, clear through the middle so the photo keeps its
          brightness, with a light lift at the bottom for the button */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-black/65 via-black/10 via-50% to-black/30" />

      <h2 className="text-3xl font-bold leading-heading tracking-tight text-white">{card.heading}</h2>
      {card.cta.enquiry ? (
        <EnquiryButton kind={card.cta.enquiry} variant="light" className="w-full justify-center lg:w-auto lg:self-start" />
      ) : (
        <Button href={card.cta.href} arrow className="w-full justify-center lg:w-auto lg:self-start">
          {card.cta.label}
        </Button>
      )}
    </article>
  );
}
