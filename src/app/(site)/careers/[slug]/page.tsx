import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobList from "@/components/sections/JobList";
import JobSpec from "@/components/sections/JobSpec";
import { aboutTheCollective, jobs } from "@/content/careers";

export function generateStaticParams() {
  return jobs.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findJob(slug: string) {
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();
  return job;
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findJob(slug).title} · Careers` };
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = findJob(slug);
  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <JobSpec job={job} aboutCompany={aboutTheCollective} />
      <JobList tone="cream" heading="Other positions" jobs={jobs.filter((j) => j.slug !== job.slug)} />
    </>
  );
}
