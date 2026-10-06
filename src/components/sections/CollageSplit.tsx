import { Children, type ReactNode } from "react";
import type { CircleImage, Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import { text } from "@/lib/styles";
import CircleCollage from "@/components/ui/CircleCollage";

type CollageSplitProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  /** A string, or JSX to control line breaks (e.g. keep a hyphenated word together). */
  heading: ReactNode;
  /** Body copy: a string, or several <p> elements. On mobile the collage sits after the first one. */
  children: ReactNode;
  images: { main: CircleImage; top: CircleImage; bottom: CircleImage };
  /** Button under the text (full width below lg). */
  cta?: Cta;
  /** Which side the collage sits on, on desktop (default left). Mobile always stacks the same way. */
  side?: "left" | "right";
};

const bodyText = `flex flex-col gap-6 ${text.body}`;

// Desktop grid for each side. The collage column starts a little in and the text column runs
// slightly into the outer gutter (as in the Figma), mirrored when the collage is on the right.
const layouts = {
  left: {
    grid: "lg:grid-cols-[minmax(0,409px)_minmax(0,489px)] xl:-mr-6 xl:pl-12",
    text: "lg:col-start-2",
    collage: "lg:col-start-1",
  },
  right: {
    grid: "lg:grid-cols-[minmax(0,489px)_minmax(0,409px)] xl:-ml-6 xl:pr-12",
    text: "lg:col-start-1",
    collage: "lg:col-start-2",
  },
};

/**
 * Floating circle collage beside a heading and body text (collage on the left unless `side="right"`). On mobile it
 * stacks as heading, first paragraph, collage, remaining paragraphs.
 */
export default function CollageSplit({ heading, children, images, cta, side = "left", tone = "white" }: CollageSplitProps) {
  const layout = layouts[side];
  const [first, ...rest] = typeof children === "string" ? [<p key="body">{children}</p>] : Children.toArray(children);

  return (
    // overflow-hidden: the collage's outer ring deliberately bleeds past the page edge
    <Section tone={tone} className="overflow-hidden">
      <Container>
        {/* Desktop: the collage spans all rows beside the text. Text sits above the collage (z-10)
            so a hovered photo's rings can pass underneath it. */}
        <div className={`grid grid-cols-1 lg:grid-rows-[auto_auto_1fr] lg:justify-between lg:gap-x-16 ${layout.grid}`}>
          <h2 className={`relative z-10 ${text.sectionHeading} ${layout.text} lg:row-start-1 lg:pt-20`}>
            {heading}
          </h2>
          <div className={`relative z-10 mt-8 ${layout.text} lg:row-start-2 ${bodyText}`}>{first}</div>

          {/* Below lg, shift left 6.8%: at rest the circles' group sits right of the box centre (as
              in the desktop design), which crowds the right edge on phones */}
          <div className={`mx-auto mt-10 mb-8 w-5/6 max-w-104 max-lg:-translate-x-[6.8%] ${layout.collage} lg:row-span-3 lg:row-start-1 lg:my-0 lg:w-full`}>
            <CircleCollage images={images} tone={tone} />
          </div>

          {(rest.length > 0 || cta) && (
            <div className={`relative z-10 ${layout.text} lg:row-start-3 lg:mt-6 ${bodyText}`}>
              {rest}
              {cta && (
                <Button href={cta.href} className="mt-2 w-full justify-center lg:w-auto lg:self-start">
                  {cta.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
