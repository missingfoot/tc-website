"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons";
import { text } from "@/lib/styles";

export type FaqItem = {
  question: string;
  answer: string | string[];
  /** Show the answer's paragraphs as a numbered list (e.g. terms). */
  numbered?: boolean;
};

type FaqAccordionProps = {
  items: FaqItem[];
  /** Questions open to start with, by index (default: the first). */
  initiallyOpen?: number[];
  /** Prefix for the answer ids, unique per accordion on the page. */
  idPrefix?: string;
  /** Words to highlight in questions and answers (lower case), e.g. a search. */
  highlight?: string[];
  /** The background it sits on: rows are cream on white, white on cream. */
  tone?: "white" | "cream";
};

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The text with every occurrence of the words wrapped in a highlight. */
function Highlighted({ children, words }: { children: string; words: string[] }) {
  if (words.length === 0) return children;
  const pattern = new RegExp(`(${words.map(escape).join("|")})`, "gi");
  return children.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-highlight text-ink">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/** Cream question rows that open to show their answer (several can be open at once). */
export default function FaqAccordion({ items, initiallyOpen = [0], idPrefix = "faq", highlight = [], tone = "white" }: FaqAccordionProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(initiallyOpen.map((i) => items[i]?.question).filter(Boolean)));
  const toggle = (question: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => {
        const expanded = open.has(item.question);
        const id = `${idPrefix}-${i}`;
        return (
          <li key={item.question} className={`overflow-hidden rounded-2xl ${tone === "cream" ? "bg-white" : "bg-cream"}`}>
            <button
              type="button"
              onClick={() => toggle(item.question)}
              aria-expanded={expanded}
              aria-controls={id}
              className="flex w-full items-center gap-4 p-6 text-left"
            >
              <span className="flex-1 text-lg font-medium text-ink">
                <Highlighted words={highlight}>{item.question}</Highlighted>
              </span>
              <ChevronDown className={`text-ink transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </button>
            {/* grid-rows 0fr → 1fr animates the answer's height */}
            <div
              id={id}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0" inert={!expanded}>
                {item.numbered ? (
                  // Numbers drawn as text (list markers fall back to another font)
                  <ol className={`flex flex-col gap-3 px-6 pb-6 ${text.body}`}>
                    {(Array.isArray(item.answer) ? item.answer : [item.answer]).map((para, n) => (
                      <li key={para} className="flex gap-3">
                        <span aria-hidden="true" className="w-4 shrink-0 font-medium text-ink">
                          {n + 1}.
                        </span>
                        <span>
                          <Highlighted words={highlight}>{para}</Highlighted>
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className={`flex flex-col gap-4 px-6 pb-6 ${text.body}`}>
                    {(Array.isArray(item.answer) ? item.answer : [item.answer]).map((para) => (
                      <p key={para}>
                        <Highlighted words={highlight}>{para}</Highlighted>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
