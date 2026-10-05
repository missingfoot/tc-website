import type { ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import { text } from "@/lib/styles";

type IntroProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  /** Body copy. Pass a string, or JSX for several paragraphs. */
  children: ReactNode;
  cta?: Cta;
  /** A button of your own in place of `cta`, e.g. one that opens a form. */
  action?: ReactNode;
  /**
   * "split": big right-aligned heading beside the text on desktop (suits short headings).
   * "stacked": heading above the text, centred on desktop (suits long headings).
   * Both stack left-aligned on mobile.
   */
  layout?: "split" | "stacked";
  /** Overlap the block above with rounded corners on mobile (use directly under the Hero). */
  raised?: boolean;
};

/** Introductory heading, body text and an optional button. */
export default function Intro({ heading, children, cta, action, layout = "split", raised = false, tone = "white" }: IntroProps) {
  const body = (
    <div className={`flex flex-col gap-5 ${text.body}`}>{typeof children === "string" ? <p>{children}</p> : children}</div>
  );
  const button =
    action ??
    (cta && (
      <Button href={cta.href} arrow>
        {cta.label}
      </Button>
    ));

  if (layout === "stacked") {
    return (
      <Section tone={tone} raised={raised}>
        <Container className="flex flex-col items-start gap-8 text-left lg:items-center lg:text-center">
          <h2 className="max-w-4xl text-3xl font-bold leading-heading text-ink lg:text-5xl">{heading}</h2>
          <div className="max-w-2xl">{body}</div>
          {button}
        </Container>
      </Section>
    );
  }

  return (
    <Section tone={tone} raised={raised}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_509px] lg:gap-28">
        <h2 className="text-3xl font-bold leading-heading text-ink lg:text-right lg:text-5xl xl:text-6xl">{heading}</h2>
        <div className="flex max-w-lg flex-col items-start gap-8 lg:pt-4">
          {body}
          {button}
        </div>
      </Container>
    </Section>
  );
}
