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
  /** Steps in order: a number in place of each icon, side by side on desktop (one column per item, up to three). */
  numbered?: boolean;
};

/** Heading, then points (optional large icon, title and text). Two columns on desktop, or numbered steps in a row. */
export default function Checklist({ heading, intro, items, tone = "white", numbered = false }: ChecklistProps) {
  const List = numbered ? "ol" : "ul";
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} centered={numbered} />
        {/* Numbered steps are an ordered list, so screen readers announce their order (the visible number is hidden from them) */}
        <List
          className={`mx-auto mt-10 grid gap-y-10 lg:mt-16 ${
            numbered ? "max-w-6xl gap-x-12 lg:grid-cols-3" : "max-w-4xl gap-x-16 lg:grid-cols-2"
          }`}
        >
          {items.map(({ icon: ItemIcon, ...item }, i) => (
            <li key={item.title} className={numbered ? "flex flex-col items-center gap-4 text-center" : "flex gap-6"}>
              {numbered ? (
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
                  {i + 1}
                </span>
              ) : (
                ItemIcon && <ItemIcon className="text-ink" />
              )}
              <div>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className={`mt-1 ${text.body}`}>{item.text}</p>
              </div>
            </li>
          ))}
        </List>
      </Container>
    </Section>
  );
}
