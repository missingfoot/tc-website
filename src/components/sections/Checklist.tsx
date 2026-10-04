import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Check } from "@/components/icons";
import { text } from "@/lib/styles";

export type ChecklistItem = { title: string; text: string };

type ChecklistProps = {
  heading: string;
  intro?: string;
  items: ChecklistItem[];
  /** Section background (default white). */
  tone?: SectionTone;
};

/** Heading, then ticked points (sage tick, title and text) split by dividers. Two columns on desktop. */
export default function Checklist({ heading, intro, items, tone = "white" }: ChecklistProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-x-16 lg:mt-16 lg:grid-cols-2">
          {items.map((item) => (
            <li key={item.title} className="flex gap-6 border-b border-ink/10 py-6 last:border-0 lg:[&:nth-last-child(2)]:border-0">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Check />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className={`mt-1 ${text.body}`}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
