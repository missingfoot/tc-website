import type { ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import { text } from "@/lib/styles";

export type { FaqItem };

type FaqProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  items: FaqItem[];
  /** Closing line under the questions. */
  outro?: ReactNode;
  cta?: Cta;
};

/** Heading, then an accordion of questions (several can be open), with an optional closing line and button. */
export default function Faq({ heading, intro, items, outro, cta, tone = "white" }: FaqProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <div className="mx-auto mt-10 max-w-3xl lg:mt-16">
          <FaqAccordion items={items} tone={tone} />
        </div>

        {(outro || cta) && (
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-start gap-8 lg:items-center lg:text-center">
            {outro && <p className={text.body}>{outro}</p>}
            {cta && (
              <Button href={cta.href} variant="dark" arrow className="w-full justify-center lg:w-auto">
                {cta.label}
              </Button>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
