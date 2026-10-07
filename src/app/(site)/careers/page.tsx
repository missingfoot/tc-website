import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Checklist from "@/components/sections/Checklist";
import JobList from "@/components/sections/JobList";
import { careersBenefits, jobs } from "@/content/careers";

export const metadata = { title: "Careers" };

export default function Careers() {
  return (
    <>
      <Hero
        image="/images/careers/team-laptop.jpg"
        imageAlt="Team members working through ideas around a table"
        title="Help us build a better world, together"
        cta={{ label: "See our open positions", href: "#open-positions" }}
      />

      <Intro raised heading="Big ambitions need great people">
        <p>
          Transforming the way people live, to change the world for the better, doesn’t happen overnight. To make it
          happen, we need some pretty great people.
        </p>
        <p>
          Working at The Collective means never settling for what you know. We’re constantly hustling, learning,
          challenging and pushing the boundaries of what it means to live in a connected world, with a culture of support
          and ambition that gives our team the confidence to make their big thinking happen.
        </p>
        <p>We’re innovating through uncharted territory, and we’d love to have you along for the ride.</p>
      </Intro>

      <Checklist tone="cream" heading="Benefits" items={careersBenefits} />

      <JobList id="open-positions" heading="Open positions" jobs={jobs} />
    </>
  );
}
