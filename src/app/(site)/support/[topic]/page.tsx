import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Section from "@/components/ui/Section";
import SupportContact from "@/components/support/SupportContact";
import { helpTopics } from "@/content/support";

export const dynamicParams = false;

export function generateStaticParams() {
  return helpTopics.map(({ slug }) => ({ topic: slug }));
}

export async function generateMetadata({ params }: PageProps<"/support/[topic]">) {
  const { topic } = await params;
  return { title: `${helpTopics.find((t) => t.slug === topic)?.title} · Member Support Hub` };
}

/** One topic's guides. ?article=<index> (from a guide's link on the hub) opens that guide. */
export default async function HelpTopicPage({ params, searchParams }: PageProps<"/support/[topic]">) {
  const [{ topic: slug }, { article }] = await Promise.all([params, searchParams]);
  const topic = helpTopics.find((t) => t.slug === slug);
  if (!topic) notFound();
  const open = Number(article);
  const TopicIcon = topic.icon;

  return (
    <>
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section tone="cream">
        <Container className="max-w-3xl">
          <BackLink href="/support">Member Support Hub</BackLink>
          <h1 className="mt-8 flex items-center gap-4 text-4xl font-bold leading-heading text-ink lg:text-5xl">
            <TopicIcon className="size-8 text-stone lg:size-10" />
            {topic.title}
          </h1>
          <div className="mt-10">
            <FaqAccordion
              items={topic.articles}
              initiallyOpen={Number.isInteger(open) && open >= 0 && open < topic.articles.length ? [open] : []}
              idPrefix={`hub-${topic.slug}`}
              tone="cream"
            />
          </div>
        </Container>
      </Section>
      <SupportContact />
    </>
  );
}
