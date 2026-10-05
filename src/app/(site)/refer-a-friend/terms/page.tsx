import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { ArrowLeft } from "@/components/icons";
import { referralTerms } from "@/content/referrals";
import { text } from "@/lib/styles";

export const metadata = { title: "Referral terms and conditions" };

export default function ReferralTerms() {
  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section>
        <Container className="mx-auto max-w-3xl">
          <Link href="/refer-a-friend" className="inline-flex items-center gap-2 text-base font-medium text-ink hover:opacity-70">
            <ArrowLeft />
            Back to refer a friend
          </Link>
          <h1 className="mt-6 text-4xl font-bold leading-heading text-ink">Referral scheme terms and conditions</h1>
          <div className="mt-10 flex flex-col gap-10">
            {referralTerms.map((section) => (
              <section key={section.heading}>
                <h2 className={text.subheading}>{section.heading}</h2>
                <div className={`mt-4 flex flex-col gap-4 ${text.body}`}>
                  {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {section.points && (
                    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-ink/40">
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
