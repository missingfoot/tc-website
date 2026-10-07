import { text } from "@/lib/styles";

type SectionIntroProps = {
  heading: string;
  intro?: string;
  /** Centred on every screen size, for blocks whose content is centred on mobile too (e.g. numbered steps). */
  centered?: boolean;
};

/** Section heading with an optional intro line: left-aligned below lg (site rule), centred on desktop. */
export default function SectionIntro({ heading, intro, centered = false }: SectionIntroProps) {
  return (
    <div className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left lg:items-center lg:text-center"}`}>
      <h2 className={text.sectionHeading}>{heading}</h2>
      {intro && <p className={`mt-8 max-w-3xl ${text.body}`}>{intro}</p>}
    </div>
  );
}
