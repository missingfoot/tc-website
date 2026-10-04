import type { ReactNode } from "react";
import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

type SplitIntroProps = {
  heading: string;
  /** Body copy. Pass a string, or JSX for several paragraphs. */
  children: ReactNode;
  cta?: Cta;
};

/** Big right-aligned heading on the left, body text and a button on the right. */
export default function SplitIntro({ heading, children, cta }: SplitIntroProps) {
  return (
    <section className="w-full bg-white py-20 lg:py-[100px]">
      <Container className="grid gap-10 lg:grid-cols-[1fr_509px] lg:gap-[117px]">
        <h2 className="text-5xl font-bold leading-[1.2] text-ink lg:text-right xl:text-[64px]">
          {heading}
        </h2>

        <div className="flex max-w-[484px] flex-col items-start gap-[30px] lg:pt-[18px]">
          <div className="flex flex-col gap-5 text-base font-[450] leading-[1.6] text-stone">
            {typeof children === "string" ? <p>{children}</p> : children}
          </div>

          {cta && (
            <Button href={cta.href} arrow>
              {cta.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
