import Photo from "@/components/ui/Photo";
import type { ReactNode } from "react";
import type { LinkCard } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { sizes2x } from "@/lib/images";

type LinkCardsProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading?: string;
  intro?: string;
  cards: LinkCard[];
  /** "dark": ink cards with a cream button. "light": cream cards with a dark button. */
  cardStyle?: "dark" | "light";
  /** Under the cards, e.g. a "more" link. */
  footer?: ReactNode;
  /** Overlap the block above with rounded corners on mobile (use directly under the Hero). */
  raised?: boolean;
};

const cardStyles = {
  dark: { card: "bg-ink text-white", text: "text-white/90", button: "light" as const },
  light: { card: "bg-cream text-ink", text: "text-ink/80", button: "dark" as const },
};

/** Optional heading, then cards with a photo, title, text and a button. Two columns on desktop (three for three cards). */
export default function LinkCards({ heading, intro, cards, cardStyle = "dark", footer, raised = false, tone = "white" }: LinkCardsProps) {
  const t = cardStyles[cardStyle];
  // Three cards sit in a row on desktop, with smaller titles to fit the narrower columns
  const three = cards.length === 3;
  return (
    <Section tone={tone} raised={raised}>
      <Container>
        {heading && <SectionIntro heading={heading} intro={intro} />}
        <ul className={`grid gap-8 ${three ? "lg:grid-cols-3" : "lg:grid-cols-2"} ${heading ? "mt-10 lg:mt-16" : ""}`}>
          {cards.map((card) => (
            <li key={card.title}>
              <article className={`flex h-full flex-col overflow-hidden rounded-2xl ${t.card}`}>
                <div className="relative aspect-[16/9]">
                  <Photo
                    src={card.image.src}
                    alt={card.image.alt}
                    sizes={sizes2x(["(min-width: 1024px)", "50vw"], [null, "100vw"])}
                    quality={90}
                    className="object-cover"
                    style={{ objectPosition: card.image.position ?? "center" }}
                  />
                </div>
                <div className="flex flex-1 flex-col items-start p-6 lg:p-8">
                  <h3 className={`font-bold leading-heading ${three ? "text-2xl" : "text-3xl"}`}>{card.title}</h3>
                  <p className={`mt-3 flex-1 text-base leading-relaxed ${t.text}`}>{card.text}</p>
                  <Button href={card.cta.href} variant={t.button} arrow className="mt-8 w-full justify-center lg:w-auto">
                    {card.cta.label}
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {footer && <div className="mt-10 lg:mt-12 lg:text-center">{footer}</div>}
      </Container>
    </Section>
  );
}
