import Photo from "@/components/ui/Photo";
import type { Person } from "@/lib/types";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";

type TeamGridProps = {
  heading: string;
  intro?: string;
  people: Person[];
  /** Section background (default white). */
  tone?: SectionTone;
};

/** Heading, then round headshots with each person's name and role: two columns on mobile, three on desktop. */
export default function TeamGrid({ heading, intro, people, tone = "white" }: TeamGridProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {people.map((person) => (
            <li key={person.name} className="flex flex-col items-start lg:items-center lg:text-center">
              <div className="relative aspect-square w-full max-w-40 overflow-hidden rounded-full bg-cream">
                <Photo src={person.image.src} alt={person.image.alt} fill sizes="(min-resolution: 2dppx) 10rem, 20rem" className="object-cover" style={{ objectPosition: person.image.position ?? "center" }} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{person.name}</h3>
              <p className="mt-1 text-base text-stone">{person.role}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
