import type { CircleImage } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import Section, { type SectionTone } from "@/components/ui/Section";
import { Download } from "@/components/icons";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";

type DownloadCardProps = {
  heading: string;
  intro: string;
  file: { href: string; label: string };
  image: CircleImage;
  /** Section background (default white; the card is cream). */
  tone?: SectionTone;
};

/** A cream card with a photo beside a heading, text and a download button (stacked on mobile). */
export default function DownloadCard({ heading, intro, file, image, tone = "white" }: DownloadCardProps) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="grid overflow-hidden rounded-2xl bg-cream lg:grid-cols-2">
          <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-96">
            <Photo src={image.src} alt={image.alt} sizes={sizes2x(["(min-width: 1024px)", "50vw"], [null, "100vw"])} quality={90} className="object-cover" />
          </div>
          <div className="flex flex-col items-start justify-center gap-6 p-8 lg:p-14">
            <h2 className={text.sectionHeading}>{heading}</h2>
            <p className={text.body}>{intro}</p>
            <Button href={file.href} download variant="dark" className="w-full justify-center lg:w-auto">
              <Download />
              {file.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
