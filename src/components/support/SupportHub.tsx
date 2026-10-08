"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { Close, Search } from "@/components/icons";
import { faqMatches } from "@/components/sections/FaqDirectory";
import { helpTopics, type HelpTopic } from "@/content/support";
import { field, text } from "@/lib/styles";

export const topicHref = (topic: HelpTopic) => `/support/${topic.slug}`;
const articleHref = (topic: HelpTopic, index: number) => `${topicHref(topic)}?article=${index}`;

/** The Member Support Hub's search and topic cards (each with its first few guides). Searching swaps the cards for the matching guides. */
export default function SupportHub() {
  const [query, setQuery] = useState("");
  const words = useDeferredValue(query).toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const results = searching ? helpTopics.map((t) => ({ ...t, articles: t.articles.filter((a) => faqMatches(a, words)) })).filter((t) => t.articles.length > 0) : [];
  const count = results.reduce((n, t) => n + t.articles.length, 0);

  return (
    <>
      <div className="relative mt-8 max-w-2xl">
        <label htmlFor="hub-search" className="sr-only">
          Search the guides
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-stone" />
        <input
          id="hub-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search, e.g. parcels or guests"
          className={`${field} pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden`}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center text-stone hover:text-ink">
            <Close />
          </button>
        )}
      </div>
      <p aria-live="polite" className={`mt-3 ${text.label} ${searching ? "" : "sr-only"}`}>
        {count === 0 ? "No guides match that. Try other words, or get in touch below." : `${count} ${count === 1 ? "guide matches" : "guides match"}`}
      </p>

      <div className="mt-10 lg:mt-12">
        {searching ? (
          <div className="flex max-w-3xl flex-col gap-12">
            {results.map((t) => (
              <section key={t.slug} aria-labelledby={`hub-${t.slug}`}>
                <h2 id={`hub-${t.slug}`} className={`mb-6 ${text.subheading}`}>
                  {t.title}
                </h2>
                {/* Keyed on the search, so every match opens to show its highlights */}
                <FaqAccordion key={words.join(" ")} items={t.articles} initiallyOpen={t.articles.map((_, i) => i)} idPrefix={`hub-${t.slug}`} highlight={words} tone="cream" />
              </section>
            ))}
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <li key={topic.slug}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function TopicCard({ topic }: { topic: HelpTopic }) {
  const { icon: TopicIcon, articles } = topic;
  return (
    <section className="flex h-full gap-4 rounded-2xl bg-white p-6 lg:gap-6 lg:p-8">
      <TopicIcon className="text-stone" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-xl font-bold leading-heading text-ink lg:text-2xl">
          <Link href={topicHref(topic)} className="hover:opacity-70">
            {topic.title}
          </Link>
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {articles.slice(0, 3).map((a, i) => (
            <li key={a.question}>
              <Link href={articleHref(topic, i)} className="text-base text-ink underline-offset-4 hover:underline">
                {a.question}
              </Link>
            </li>
          ))}
        </ul>
        {articles.length > 3 && (
          <Link href={topicHref(topic)} className="mt-auto pt-6 text-base font-medium text-stone hover:text-ink">
            See all {articles.length} guides
          </Link>
        )}
      </div>
    </section>
  );
}
