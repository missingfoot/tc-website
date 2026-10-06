import Link from "next/link";
import type { ReactNode } from "react";
import type { Job } from "@/content/careers";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { ArrowLeft } from "@/components/icons";
import { getContact } from "@/lib/payload";
import { text } from "@/lib/styles";

/** A labelled part of the spec: label on the left on desktop, content on the right. */
function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <h2 className="text-2xl font-bold leading-heading text-ink lg:text-right">{label}</h2>
      <div className={`flex max-w-2xl flex-col gap-5 ${text.body}`}>{children}</div>
    </section>
  );
}

function Bullets({ points }: { points: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-ink/40">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

/** A job's page body: back link, title, location and sector, then the spec in labelled parts and an apply button. */
export default async function JobSpec({ job, aboutCompany }: { job: Job; aboutCompany: string[] }) {
  const { email } = await getContact();
  // TODO: link to the real application process (e.g. the job on Workable)
  const apply = `mailto:${email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  return (
    <Section>
      <Container>
        <Link href="/careers#open-positions" className="inline-flex items-center gap-2 text-base font-medium text-ink hover:opacity-70">
          <ArrowLeft />
          Back to all jobs
        </Link>
        <h1 className="mt-6 text-4xl font-bold leading-heading text-ink lg:text-5xl">{job.title}</h1>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-base">
          <div className="lg:border-r lg:border-ink/10 lg:pr-10">
            <dt className="font-bold text-ink">Location</dt>
            <dd className="mt-1 text-stone">{job.location}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">Sector</dt>
            <dd className="mt-1 text-stone">{job.sector}</dd>
          </div>
        </dl>

        <div className="mt-16 flex flex-col gap-14 lg:mt-24 lg:gap-20">
          <Part label="About The Collective">
            {aboutCompany.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Part>

          <Part label="About the role">
            {job.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Part>

          {job.requirements.length > 0 && (
            <Part label="Requirements">
              {job.requirements.map((group) => (
                <div key={group.heading}>
                  <h3 className="mb-3 font-bold text-ink">{group.heading}</h3>
                  <Bullets points={group.points} />
                </div>
              ))}
            </Part>
          )}

          <Part label="Benefits">
            {job.benefits.length > 0 && <Bullets points={job.benefits} />}
            <p className="font-medium text-ink">{job.salary}</p>
            <Button href={apply} variant="dark" arrow className="mt-2 w-full justify-center lg:w-auto lg:self-start">
              Apply now
            </Button>
          </Part>
        </div>
      </Container>
    </Section>
  );
}
