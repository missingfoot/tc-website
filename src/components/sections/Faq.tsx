"use client";

import { useState, type ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { ChevronDown } from "@/components/icons";
import { text } from "@/lib/styles";

export type FaqItem = { question: string; answer: string | string[] };

type FaqProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  items: FaqItem[];
  /** Closing line under the questions. */
  outro?: ReactNode;
  cta?: Cta;
};

/** Heading, then an accordion of questions (several can be open), with an optional closing line and button. */
export default function Faq({ heading, intro, items, outro, cta, tone = "white" }: FaqProps) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <ul className="mx-auto mt-10 flex max-w-3xl flex-col gap-2.5 lg:mt-16">
          {items.map((item, i) => {
            const expanded = open.has(i);
            const id = `faq-${i}`;
            return (
              <li key={item.question} className="overflow-hidden rounded-2xl bg-cream">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={expanded}
                  aria-controls={id}
                  className="flex w-full items-center gap-4 p-6 text-left"
                >
                  <span className="flex-1 text-lg font-medium text-ink">{item.question}</span>
                  <ChevronDown className={`text-ink transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </button>
                {/* grid-rows 0fr → 1fr animates the answer's height */}
                <div
                  id={id}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0" inert={!expanded}>
                    <div className={`flex flex-col gap-4 px-6 pb-6 ${text.body}`}>
                      {(Array.isArray(item.answer) ? item.answer : [item.answer]).map((para) => (
                        <p key={para}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {(outro || cta) && (
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-start gap-8 lg:items-center lg:text-center">
            {outro && <p className={text.body}>{outro}</p>}
            {cta && (
              <Button href={cta.href} variant="dark" arrow className="w-full justify-center lg:w-auto">
                {cta.label}
              </Button>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
