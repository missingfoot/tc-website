import type { InputHTMLAttributes, ReactNode } from "react";
import { Help } from "@/components/icons";
import { field, text } from "@/lib/styles";

/** A labelled text input. Extra props go to the <input>. */
export function TextField({ label, id, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`block ${text.label}`}>
        {label}
      </label>
      <input id={id} name={id} {...props} className={`mt-2 ${field}`} />
    </div>
  );
}

/** A labelled group of radio buttons (stacked). One must be picked before the step can be submitted. */
export function RadioGroup({ legend, name, options, defaultValue }: { legend: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <fieldset>
      <legend className={text.label}>{legend}</legend>
      <div className="mt-3 flex flex-col gap-3">
        {options.map((option) => (
          <label key={option} className="flex w-fit cursor-pointer items-center gap-3 text-base text-ink">
            <input type="radio" name={name} value={option} required defaultChecked={option === defaultValue} className="size-5 accent-ink" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Label / value rows, e.g. a finished step's answers or the summary card's facts. */
export function Details({ rows, split = false }: { rows: [ReactNode, ReactNode][]; split?: boolean }) {
  return (
    <dl className="flex flex-col gap-2 text-base">
      {rows.map(([label, value], i) => (
        <div key={i} className={split ? "flex justify-between gap-4" : "grid grid-cols-[9rem_1fr] gap-4"}>
          <dt className="flex items-center gap-1.5 text-stone">{label}</dt>
          <dd className={`min-w-0 break-words text-ink ${split ? "text-right" : ""}`}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A "?" that shows a short explanation on hover or keyboard focus. */
export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-label={`About ${label}`} className="text-ink">
        <Help />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-sm leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
