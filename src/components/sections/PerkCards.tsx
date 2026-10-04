"use client";

import Image from "next/image";
import type { Perk } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { sizes2x } from "@/lib/images";

type PerkCardsProps = {
  heading: string;
  intro?: string;
  perks: Perk[];
};

/** Carousel of partner perk cards: photo with the partner's logo badge, name and description. */
export default function PerkCards({ heading, intro, perks }: PerkCardsProps) {
  return (
    <Section className="overflow-hidden bg-cream">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <Carousel
          items={perks}
          getKey={(p) => p.name}
          label="Member perks"
          dotLabel={(i, n) => `Show perk ${i} of ${n}`}
          renderItem={(p) => (
            <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-[5/3]">
                <Image src={p.image} alt="" fill draggable={false} sizes={sizes2x([null, "300px"])} quality={90} className="object-cover" />
                {p.logo && (
                  <Image src={p.logo} alt="" width={64} height={64} draggable={false} className="absolute right-4 bottom-4 size-16 rounded-xl" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-ink">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{p.text}</p>
              </div>
            </article>
          )}
        />
      </Container>
    </Section>
  );
}
