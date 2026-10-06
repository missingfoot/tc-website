import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import Section, { type SectionTone } from "@/components/ui/Section";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";

/** A photo. Leave out `src` to show a placeholder box until the photo is ready. */
export type ResearchFigure = {
  src?: string;
  alt: string;
  /** Frame shape: 4:3 (default), or 16:9 for a wide image whose edges shouldn't be cropped (e.g. a credit). */
  shape?: "standard" | "wide";
};

type ResearchSectionProps = {
  heading: string;
  /** Headed text-and-photo pairs: the photo on the right on desktop, below the text on mobile. */
  rows: { heading: string; paragraphs: string[]; figure: ResearchFigure }[];
  cta?: { label: string; href: string };
  /** Section background (default white). */
  tone?: SectionTone;
};

function Figure({ figure }: { figure: ResearchFigure }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-cream ${figure.shape === "wide" ? "aspect-video" : "aspect-4/3"}`}>
      {figure.src ? (
        <Photo src={figure.src} alt={figure.alt} sizes={sizes2x(["(min-width: 1024px)", "600px"], [null, "100vw"])} quality={90} className="object-cover" />
      ) : (
        <div role="img" aria-label={figure.alt} className={`absolute inset-0 grid place-items-center ${text.label}`}>
          Photo coming soon
        </div>
      )}
    </div>
  );
}

/**
 * Research write-up: a heading, then headed paragraphs each paired with a photo (e.g. Labs' people
 * mapping and room activity metrics), then a link.
 */
export default function ResearchSection({ heading, rows, cta, tone = "white" }: ResearchSectionProps) {
  return (
    <Section tone={tone}>
      <Container>
        <h2 className={text.sectionHeading}>{heading}</h2>
        <div className="mt-6 flex flex-col gap-10 lg:mt-10 lg:gap-16">
          {rows.map((row) => (
            <div key={row.heading} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-lg">
                <h3 className={text.subheading}>{row.heading}</h3>
                <div className={`mt-4 flex flex-col gap-6 ${text.body}`}>
                  {row.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <Figure figure={row.figure} />
            </div>
          ))}
        </div>
        {cta && (
          <Button href={cta.href} variant="dark" arrow className="mt-10 w-full justify-center lg:mt-16 lg:w-auto">
            {cta.label}
          </Button>
        )}
      </Container>
    </Section>
  );
}
