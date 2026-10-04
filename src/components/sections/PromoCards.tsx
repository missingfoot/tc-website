import Image from "next/image";
import type { PromoCard } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { sizes2x } from "@/lib/images";

/** Photo cards with a heading and a button: side by side on desktop, stacked on mobile. */
export default function PromoCards({ cards }: { cards: PromoCard[] }) {
  return (
    <Section className="bg-white">
      <Container>
        <ul className="grid gap-8 lg:grid-cols-2">
          {cards.map((card) => (
            <li key={card.heading}>
              <PromoCardItem card={card} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function PromoCardItem({ card }: { card: PromoCard }) {
  return (
    <article className="relative isolate flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-8 lg:aspect-[576/415] lg:p-10">
      <Image
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

      <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">{card.heading}</h2>
      <Button href={card.cta.href} arrow className="w-full justify-center lg:w-auto lg:self-start">
        {card.cta.label}
      </Button>
    </article>
  );
}
