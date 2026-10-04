import type { ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { text } from "@/lib/styles";

type SplitIntroProps = {
  heading: string;
  /** Body copy. Pass a string, or JSX for several paragraphs. */
  children: ReactNode;
  cta?: Cta;
};

/** Big right-aligned heading on the left, body text and a button on the right. */
export default function SplitIntro({ heading, children, cta }: SplitIntroProps) {
  return (
    <Section className="bg-white">
      <Container className="grid gap-10 lg:grid-cols-[1fr_509px] lg:gap-28">
        <h2 className="text-5xl font-bold leading-tight text-ink lg:text-right xl:text-6xl">
          {heading}
        </h2>

        <div className="flex max-w-lg flex-col items-start gap-8 lg:pt-4">
          <div className={`flex flex-col gap-5 ${text.body}`}>
            {typeof children === "string" ? <p>{children}</p> : children}
          </div>

          {cta && (
            <Button href={cta.href} arrow>
              {cta.label}
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
