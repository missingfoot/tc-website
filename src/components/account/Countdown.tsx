"use client";

import { useEffect, useState } from "react";
import { text } from "@/lib/styles";

/** The current time, updated every `ms` (only used in the account, which renders in the browser). */
function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(timer);
  }, [ms]);
  return now;
}

type CountdownProps = {
  label: string;
  target: Date;
  /** When the period began (e.g. check-in): the bar shows how much of it is left, draining to empty. */
  start?: Date;
  /** Line under the numbers, e.g. the date itself. */
  note?: string;
  /** What to show once the date has passed. */
  passed?: string;
  /** Dark card, for the deadline that matters most. */
  emphasis?: boolean;
};

/** Days and hours left until a date, with a bar of how much of the period is left. */
export default function Countdown({ label, target, start, note, passed = "Passed", emphasis = false }: CountdownProps) {
  // Hours are the smallest unit shown, so checking once a minute is plenty
  const now = useNow(60_000);
  const left = target.getTime() - now;
  // Share of the period still left, 100 → 0
  const remaining = start ? Math.min(100, Math.max(0, (left / (target.getTime() - start.getTime())) * 100)) : null;
  const units: [number, string][] = [
    [Math.floor(left / 86_400_000), "days"],
    [Math.floor(left / 3_600_000) % 24, "hrs"],
  ];

  return (
    <div className={`rounded-2xl p-5 ${emphasis ? "bg-ink text-white" : "bg-cream text-ink"}`}>
      <p className={emphasis ? "text-white/70" : text.label}>{label}</p>
      {left > 0 ? (
        <p className="mt-2 flex items-baseline gap-4" aria-label={`${units[0][0]} days and ${units[1][0]} hours left`}>
          {units.map(([value, unit]) => (
            <span key={unit} className="flex items-baseline gap-1">
              <span className="text-4xl font-bold leading-heading tabular-nums">{value}</span>
              <span className={`text-sm ${emphasis ? "text-white/70" : "text-stone"}`}>{unit}</span>
            </span>
          ))}
        </p>
      ) : (
        <p className="mt-2 text-2xl font-bold leading-heading">{passed}</p>
      )}
      {remaining !== null && (
        <div
          role="progressbar"
          aria-label={`${label}: time remaining`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(remaining)}
          className={`mt-4 h-2 overflow-hidden rounded-full ${emphasis ? "bg-white/20" : "bg-ink/10"}`}
        >
          <div className={`h-full rounded-full transition-[width] duration-700 ease-smooth ${emphasis ? "bg-white" : "bg-ink"}`} style={{ width: `${remaining}%` }} />
        </div>
      )}
      {note && <p className={`mt-2 text-sm ${emphasis ? "text-white/70" : "text-stone"}`}>{note}</p>}
    </div>
  );
}
