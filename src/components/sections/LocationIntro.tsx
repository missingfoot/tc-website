import type { ComponentType, ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import { text } from "@/lib/styles";

type LocationIntroProps = {
  /** The page title (rendered as the h1: use under a photo-only Hero). */
  name: string;
  /** Line under the name, e.g. a postcode. */
  subtitle?: string;
  /** Icon rows under the name, e.g. transport links and facilities. */
  features: { icon: ComponentType<{ className?: string }>; label: string }[];
  /** Body copy. Pass a string, or JSX for several paragraphs. */
  children: ReactNode;
  cta?: Cta;
  /** Section background (default white). */
  tone?: SectionTone;
  /** Overlap the block above with rounded corners on mobile (use directly under the Hero). */
  raised?: boolean;
};

/** A location's name and postcode, then its feature rows beside the intro text on desktop. */
export default function LocationIntro({ name, subtitle, features, children, cta, tone = "white", raised = false }: LocationIntroProps) {
  return (
    <Section tone={tone} raised={raised}>
      <Container>
        <h1 className="text-4xl font-bold leading-heading text-ink lg:text-6xl">{name}</h1>
        {subtitle && <p className="mt-3 text-base text-stone">{subtitle}</p>}

        {/* Feature rows beside the intro text on desktop */}
        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-28">
          <ul className="flex flex-col gap-8">
            {features.map(({ icon: FeatureIcon, label }) => (
              <li key={label} className="flex items-center gap-5">
                <FeatureIcon className="text-ink" />
                <span className="text-base text-stone">{label}</span>
              </li>
            ))}
          </ul>

          <div className="flex max-w-lg flex-col items-start gap-8">
            <div className={`flex flex-col gap-5 ${text.body}`}>{typeof children === "string" ? <p>{children}</p> : children}</div>
            {cta && (
              <Button href={cta.href} arrow>
                {cta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
