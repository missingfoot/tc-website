import type { ComponentType } from "react";

export type FeatureItem = { icon: ComponentType<{ className?: string }>; label: string };

type FeatureListProps = {
  items: FeatureItem[];
  /** Spread the items over two columns from lg. */
  twoColumn?: boolean;
  className?: string;
};

/** The site's icon list: each item a light cream tile with its icon and label. */
export default function FeatureList({ items, twoColumn = false, className = "" }: FeatureListProps) {
  return (
    <ul className={`grid gap-2.5 ${twoColumn ? "lg:grid-cols-2 lg:gap-x-8" : ""} ${className}`}>
      {items.map(({ icon: ItemIcon, label }) => (
        <li key={label} className="flex items-center gap-4 rounded-xl bg-cream/40 p-4">
          <ItemIcon className="shrink-0 text-ink" />
          <span className="text-base font-medium text-ink">{label}</span>
        </li>
      ))}
    </ul>
  );
}
