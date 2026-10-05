import type { ComponentType } from "react";

export type Reason = { label: string; icon?: ComponentType<{ className?: string }> };

/** Tick-as-many-as-you-like tiles (they turn green when picked). Submits each as `name`. */
export default function ReasonTiles({ reasons, name, legend }: { reasons: Reason[]; name: string; legend: string }) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-2.5">
        {reasons.map(({ label, icon: ReasonIcon }) => (
          <label
            key={label}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-ink/15 p-4 text-base text-ink transition has-checked:border-sage has-checked:bg-sage/15 has-focus-visible:ring-2 has-focus-visible:ring-ink"
          >
            <input type="checkbox" name={name} value={label} className="sr-only" />
            {ReasonIcon ? <ReasonIcon className="text-ink" /> : <span className="size-6" aria-hidden="true" />}
            <span className="flex-1 font-medium">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
