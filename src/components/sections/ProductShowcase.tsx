import type { ComponentType } from "react";
import { Check } from "@/components/icons";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import Section, { type SectionTone } from "@/components/ui/Section";
import Tilt from "@/components/ui/Tilt";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";

/** A product: a screenshot beside its name, a one-line summary and its features. */
export type Product = {
  name: string;
  summary: string;
  /** Each feature with an icon that illustrates it (a tick if left out). */
  features: { text: string; icon?: ComponentType<{ className?: string }> }[];
  /** Shown whole (never cropped), so give its pixel size. Portrait shots (e.g. a phone) display narrower. */
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** "small" for screenshots with UI right up to the edges, which large corners would cut off. Default "large". */
    corners?: "small" | "large";
  };
};

type ProductShowcaseProps = {
  product: Product;
  /** Which side the screenshot sits on, on desktop (default left). On mobile it sits above the text. */
  side?: "left" | "right";
  /** Section background (default white). */
  tone?: SectionTone;
};

/**
 * One product: its screenshot beside its name, summary and a list of features, each with an icon. The screenshot
 * floats on a soft shadow and leans towards the mouse.
 */
export default function ProductShowcase({ product, side = "left", tone = "white" }: ProductShowcaseProps) {
  const { screenshot } = product;
  const portrait = screenshot.height > screenshot.width;

  return (
    <Section tone={tone}>
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <Tilt className={`w-full ${portrait ? "max-w-64 justify-self-center" : ""} ${side === "right" ? "lg:order-last" : ""}`}>
            <div
              className={`relative overflow-hidden shadow-2xl shadow-ink/20 ring-1 ring-ink/10 ${screenshot.corners === "small" ? "rounded-md" : portrait ? "rounded-3xl" : "rounded-2xl"}`}
              style={{ aspectRatio: `${screenshot.width} / ${screenshot.height}` }}
            >
              <Photo
                src={screenshot.src}
                alt={screenshot.alt}
                sizes={portrait ? sizes2x([null, "256px"]) : sizes2x(["(min-width: 1024px)", "600px"], [null, "100vw"])}
                quality={90}
                className="object-cover"
              />
            </div>
          </Tilt>

          <div className="max-w-lg">
            <h2 className={text.sectionHeading}>{product.name}</h2>
            <p className={`mt-4 ${text.body}`}>{product.summary}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {product.features.map(({ text: feature, icon: FeatureIcon = Check }) => (
                <li key={feature} className={`flex gap-4 ${text.body}`}>
                  <FeatureIcon className="mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
