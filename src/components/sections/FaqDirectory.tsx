"use client";

import { useDeferredValue, useState } from "react";
import Container from "@/components/ui/Container";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import Section, { type SectionTone } from "@/components/ui/Section";
import { Close, Search } from "@/components/icons";
import { field, text } from "@/lib/styles";

export type FaqTopic = { topic: string; items: FaqItem[] };

type FaqDirectoryProps = {
  topics: FaqTopic[];
  /** Section background (default white). */
  tone?: SectionTone;
  /** Overlap the block above with rounded corners on mobile (use directly under the Hero). */
  raised?: boolean;
};

const matches = (item: FaqItem, words: string[]) => {
  const haystack = [item.question, ...(Array.isArray(item.answer) ? item.answer : [item.answer])].join(" ").toLowerCase();
  return words.every((word) => haystack.includes(word));
};

/**
 * Every question, grouped under topic headings, with a search box that narrows them down as you
 * type (matching questions and answers; all words must appear).
 */
export default function FaqDirectory({ topics, tone = "white", raised = false }: FaqDirectoryProps) {
  const [query, setQuery] = useState("");
  const words = useDeferredValue(query).toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const shown = topics.map((t) => ({ ...t, items: searching ? t.items.filter((item) => matches(item, words)) : t.items })).filter((t) => t.items.length > 0);
  const count = shown.reduce((n, t) => n + t.items.length, 0);

  return (
    <Section tone={tone} raised={raised}>
      <Container className="mx-auto max-w-3xl">
        <div className="relative">
          <label htmlFor="faq-search" className="sr-only">
            Search the questions
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-stone" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for exactly what you want…"
            className={`${field} pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden`}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center text-stone hover:text-ink">
              <Close />
            </button>
          )}
        </div>
        <p aria-live="polite" className={`mt-3 ${text.label} ${searching ? "" : "sr-only"}`}>
          {count === 0 ? "No questions match that. Try other words, or get in touch below." : `${count} ${count === 1 ? "question matches" : "questions match"}`}
        </p>

        <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:gap-16">
          {shown.map((t) => (
            <section key={t.topic} aria-labelledby={`topic-${t.topic}`}>
              <h2 id={`topic-${t.topic}`} className={`mb-6 ${text.subheading}`}>
                {t.topic}
              </h2>
              {/* Keyed on the search: while searching every match opens so its highlights show; otherwise all start closed */}
              <FaqAccordion
                key={words.join(" ")}
                items={t.items}
                initiallyOpen={searching ? t.items.map((_, i) => i) : []}
                idPrefix={`faq-${t.topic}`}
                highlight={words}
              />
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
