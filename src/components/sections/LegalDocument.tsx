import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "@/components/icons";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { text } from "@/lib/styles";

type LegalDocumentProps = {
  title: string;
  /** When it was last changed, e.g. "25 May 2018". */
  updated?: string;
  /** A link back to the page it belongs to, e.g. the referral scheme. */
  back?: { label: string; href: string };
  /**
   * The document as plain elements (h2, h3, p, ul, ol, li, a, strong, tables): they're styled
   * here, so content files don't carry classes. `<ol type="a">` gives lettered sub-points.
   */
  children: ReactNode;
};

// Styles for the plain elements inside the document
const prose = [
  `flex flex-col gap-4 ${text.body}`,
  "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-heading [&_h2]:text-ink [&_h2:first-child]:mt-0",
  "[&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink",
  "[&_strong]:font-medium [&_strong]:text-ink",
  "[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-70",
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
  "[&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-3 [&_ol]:pl-5 [&_ol[type=a]]:list-[lower-alpha]",
  "[&_li]:marker:text-ink/40 [&_li_p+p]:mt-3 [&_li>strong]:block [&_li>strong+p]:mt-1",
  "[&_li_ol]:mt-3 [&_li_ul]:mt-3",
  "[&_table]:w-full [&_table]:min-w-xl [&_table]:text-left [&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-ink/15 [&_th]:py-2 [&_th]:pr-4 [&_th]:font-medium [&_th]:text-ink",
  "[&_td]:border-b [&_td]:border-ink/10 [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top",
].join(" ");

/** A legal page: title, last-updated date and the document, in a narrow readable column. */
export default function LegalDocument({ title, updated, back, children }: LegalDocumentProps) {
  return (
    <>
      {/* Dark band behind the site nav, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />
      <Section>
        <Container>
          {/* A narrow column for comfortable reading (inside Container, so its max width can't win) */}
          <div className="mx-auto max-w-3xl">
            {back && (
              <Link href={back.href} className="mb-6 inline-flex items-center gap-2 text-base font-medium text-ink hover:opacity-70">
                <ArrowLeft />
                {back.label}
              </Link>
            )}
            <h1 className="text-4xl font-bold leading-heading text-ink">{title}</h1>
            {updated && <p className={`mt-3 ${text.label}`}>Last updated {updated}</p>}
            <div className={`mt-10 ${prose}`}>{children}</div>
          </div>
        </Container>
      </Section>
    </>
  );
}
