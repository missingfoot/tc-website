import type { ComponentType } from "react";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { text } from "@/lib/styles";

/** A point: title and text, with an optional large icon. */
export type ChecklistItem = { icon?: ComponentType<{ className?: string }>; title: string; text: string };

type ChecklistProps = {
  heading: string;
  intro?: string;
  items: ChecklistItem[];
  /** Section background (default white). */
  tone?: SectionTone;
};

/** Heading, then points (optional large icon, title and text). Two columns on desktop. */
export default function Checklist({ heading, intro, items, tone = "white" }: ChecklistProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-x-16 gap-y-10 lg:mt-16 lg:grid-cols-2">
          {items.map(({ icon: ItemIcon, ...item }) => (
            <li key={item.title} className="flex gap-6">
              {ItemIcon && <ItemIcon className="text-ink" />}
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
