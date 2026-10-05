"use client";

import Image from "next/image";
import Photo from "@/components/ui/Photo";
import type { Perk } from "@/lib/types";
import Carousel from "@/components/ui/Carousel";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { sizes2x } from "@/lib/images";

type PerkCardsProps = {
  /** Section background (default cream). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  perks: Perk[];
};

/** Carousel of partner perk cards: photo with the partner's logo badge, name and description. */
export default function PerkCards({ heading, intro, perks, tone = "cream" }: PerkCardsProps) {
  return (
    <Section tone={tone} className="overflow-hidden">
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
                <Photo src={p.image} alt="" fill draggable={false} sizes={sizes2x([null, "300px"])} quality={90} className="object-cover" />
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
