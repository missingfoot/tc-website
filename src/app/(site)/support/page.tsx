import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SupportHub from "@/components/support/SupportHub";
import SupportContact from "@/components/support/SupportContact";
import { text } from "@/lib/styles";

export const metadata = { title: "Member Support Hub", description: "Guides to living at The Collective Old Oak, from house rules to parcels." };

/** The Member Support Hub: guides for members, open to anyone (like the old Zendesk help centre). */
export default function SupportHubPage() {
  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section tone="cream">
        <Container>
          <h1 className="text-4xl font-bold leading-heading text-ink lg:text-5xl">Member Support Hub</h1>
          <p className={`mt-3 max-w-2xl ${text.body}`}>Guides to living at The Collective Old Oak, from house rules to parcels.</p>
          <SupportHub />
        </Container>
      </Section>
      <SupportContact />
    </>
  );
}
