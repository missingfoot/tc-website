import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import FeatureList, { type FeatureItem } from "@/components/ui/FeatureList";

export type FeatureGroup = {
  /** Small grey label above the group. Optional: unlabelled groups just split a list into columns. */
  label?: string;
  items: FeatureItem[];
};

type FeatureGroupsProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  groups: FeatureGroup[];
};

/** Heading and intro, then labelled lists of icon rows: two columns on desktop, stacked on mobile. */
export default function FeatureGroups({ heading, intro, groups, tone = "white" }: FeatureGroupsProps) {
  const single = groups.length === 1;
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        {/* Several groups sit in two columns; a single group spreads its items over both */}
        <div className={`mx-auto mt-12 grid max-w-3xl items-start gap-x-8 gap-y-10 lg:mt-16 ${single ? "" : "lg:grid-cols-2"}`}>
          {groups.map((group, i) => (
            <div key={group.label ?? i}>
              {group.label && <h3 className="mb-4 text-sm font-bold text-stone">{group.label}</h3>}
              <FeatureList items={group.items} twoColumn={single} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
