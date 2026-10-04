import { Children, type ReactNode } from "react";
import type { CircleImage } from "@/lib/types";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { text } from "@/lib/styles";
import CircleCollage from "@/components/ui/CircleCollage";

type CollageSplitProps = {
  /** A string, or JSX to control line breaks (e.g. keep a hyphenated word together). */
  heading: ReactNode;
  /** Body copy: a string, or several <p> elements. On mobile the collage sits after the first one. */
  children: ReactNode;
  images: { main: CircleImage; top: CircleImage; bottom: CircleImage };
};

const bodyText = `flex flex-col gap-6 ${text.body}`;

/**
 * Floating circle collage on the left, heading and body text on the right. On mobile it
 * stacks as heading, first paragraph, collage, remaining paragraphs.
 */
export default function CollageSplit({ heading, children, images }: CollageSplitProps) {
  const [first, ...rest] = typeof children === "string" ? [<p key="body">{children}</p>] : Children.toArray(children);

  return (
    // overflow-hidden: the collage's outer ring deliberately bleeds past the page edge
    <Section className="overflow-hidden bg-white">
      <Container>
        {/* Desktop: collage column starts a little in and spans all rows; text column runs
            slightly into the right gutter (as in the Figma). Text sits above the collage (z-10) so a
            hovered photo's rings can pass underneath it. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,409px)_minmax(0,489px)] lg:grid-rows-[auto_auto_1fr] lg:justify-between lg:gap-x-16 xl:-mr-6 xl:pl-12">
          <h2 className={`relative z-10 ${text.sectionHeading} lg:col-start-2 lg:row-start-1 lg:pt-20`}>
            {heading}
          </h2>
          <div className={`relative z-10 mt-8 lg:col-start-2 lg:row-start-2 ${bodyText}`}>{first}</div>

          {/* Below lg, shift left 6.8%: at rest the circles' group sits right of the box centre (as
              in the desktop design), which crowds the right edge on phones */}
          <div className="mx-auto mt-10 mb-8 w-[min(409px,85vw)] max-lg:-translate-x-[6.8%] lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:my-0 lg:w-full">
            <CircleCollage {...images} />
          </div>

          {rest.length > 0 && (
            <div className={`relative z-10 lg:col-start-2 lg:row-start-3 lg:mt-6 ${bodyText}`}>{rest}</div>
          )}
        </div>
      </Container>
    </Section>
  );
}
