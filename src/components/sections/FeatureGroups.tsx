import type { ComponentType } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";

export type FeatureGroup = {
  label: string;
  items: { icon: ComponentType<{ className?: string }>; label: string }[];
};

type FeatureGroupsProps = {
  heading: string;
  intro?: string;
  groups: FeatureGroup[];
};

/** Heading and intro, then labelled lists of icon rows: two columns on desktop, stacked on mobile. */
export default function FeatureGroups({ heading, intro, groups }: FeatureGroupsProps) {
  return (
    <Section className="bg-white">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <div className="mx-auto mt-12 grid max-w-3xl items-start gap-x-8 gap-y-10 lg:mt-16 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-bold text-stone">{group.label}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.items.map(({ icon: ItemIcon, label }) => (
                  <li key={label} className="flex items-center gap-4 rounded-xl bg-cream/40 p-4">
                    <ItemIcon className="shrink-0 text-ink" />
                    <span className="text-base font-medium text-ink">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
