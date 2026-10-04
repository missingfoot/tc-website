import Image from "next/image";
import type { LinkCard } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { sizes2x } from "@/lib/images";

type LinkCardsProps = {
  heading?: string;
  intro?: string;
  cards: LinkCard[];
  /** "dark": ink cards with a cream button. "light": cream cards with a dark button. */
  tone?: "dark" | "light";
};

const tones = {
  dark: { card: "bg-ink text-white", text: "text-white/90", button: "light" as const },
  light: { card: "bg-cream text-ink", text: "text-ink/80", button: "dark" as const },
};

/** Optional heading, then cards with a photo, title, text and a button. Two columns on desktop. */
export default function LinkCards({ heading, intro, cards, tone = "dark" }: LinkCardsProps) {
  const t = tones[tone];
  return (
    <Section className="bg-white">
      <Container>
        {heading && <SectionIntro heading={heading} intro={intro} />}
        <ul className={`grid gap-8 lg:grid-cols-2 ${heading ? "mt-10 lg:mt-16" : ""}`}>
          {cards.map((card) => (
            <li key={card.title}>
              <article className={`flex h-full flex-col overflow-hidden rounded-2xl ${t.card}`}>
                <div className="relative aspect-[16/9]">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes={sizes2x(["(min-width: 1024px)", "50vw"], [null, "100vw"])}
                    quality={90}
                    className="object-cover"
                    style={{ objectPosition: card.image.position ?? "center" }}
                  />
                </div>
                <div className="flex flex-1 flex-col items-start p-6 lg:p-8">
                  <h3 className="text-3xl font-bold leading-tight">{card.title}</h3>
                  <p className={`mt-3 flex-1 text-base leading-relaxed ${t.text}`}>{card.text}</p>
                  <Button href={card.cta.href} variant={t.button} arrow className="mt-8 w-full justify-center lg:w-auto">
                    {card.cta.label}
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
