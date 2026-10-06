import Link from "next/link";
import type { Job } from "@/content/careers";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { ArrowRight } from "@/components/icons";
import { getContact } from "@/lib/payload";
import { pressable, text } from "@/lib/styles";

type JobListProps = {
  heading: string;
  jobs: Pick<Job, "slug" | "title" | "location" | "sector">[];
  /** Anchor id, so "See our open positions" can jump here. */
  id?: string;
  tone?: SectionTone;
};

// Cards stand out from the section: cream on white, white on cream
const cardColours: Record<SectionTone, string> = { white: "bg-cream hover:bg-cream-dark", cream: "bg-white hover:bg-white/70" };

/** Open roles as full-width cards, one per row (room for long titles), each linking to its spec, then a line for speculative applications. */
export default async function JobList({ heading, jobs, id, tone = "white" }: JobListProps) {
  const { email } = await getContact();
  return (
    <Section tone={tone}>
      <Container>
        <div id={id} className="scroll-mt-28">
          <SectionIntro heading={heading} />
        </div>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 lg:mt-16">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link href={`/careers/${job.slug}`} className={`group flex h-full items-center gap-4 rounded-2xl p-6 ${cardColours[tone]} ${pressable}`}>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-ink">{job.title}</h3>
                  <p className="mt-1 text-sm text-stone">
                    {job.location} · {job.sector}
                  </p>
                </div>
                <ArrowRight className="text-ink transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <p className={`mt-10 lg:mt-12 lg:text-center ${text.body}`}>
          Don’t see the role you’re looking for?{" "}
          <a href={`mailto:${email}?subject=Careers`} className="font-medium text-ink underline underline-offset-4">
            We’d still love to hear from you
          </a>
        </p>
      </Container>
    </Section>
  );
}
