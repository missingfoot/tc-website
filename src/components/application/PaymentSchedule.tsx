"use client";

import { useId, useState } from "react";
import { CalendarCheck, ChevronDown } from "@/components/icons";
import { formatMoney, type Instalment } from "@/lib/application";
import { text } from "@/lib/styles";

const short = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

type PaymentScheduleProps = {
  instalments: Instalment[];
  /** What the credit on the first payment is, e.g. "Holding deposit". */
  creditLabel?: string;
};

/**
 * A membership's payments: a one-line summary, opening to every payment with its due date, the
 * days it covers and what's left to pay after any credit. Rows rather than a table, so it fits phones.
 */
export default function PaymentSchedule({ instalments, creditLabel = "Already paid" }: PaymentScheduleProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  if (instalments.length === 0) return null;

  const first = instalments[0];
  const total = instalments.reduce((n, i) => n + i.amount - i.credit, 0);
  const summary =
    instalments.length === 1
      ? `One payment of ${formatMoney(first.amount - first.credit, true)}, due ${short.format(first.due)}`
      : `${instalments.length} payments, the first due ${short.format(first.due)}`;

  return (
    <div className="rounded-xl border border-ink/15">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={listId} className="flex w-full items-center gap-4 p-4 text-left lg:px-5">
        <CalendarCheck className="text-stone" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">Your payment schedule</span>
          <span className="block text-sm text-stone">{summary}</span>
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-ink">
          <span className="max-sm:sr-only">{open ? "Hide" : "Show"}</span>
          <ChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {/* grid-rows 0fr → 1fr animates the height */}
      <div id={listId} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <ol className="divide-y divide-ink/10 border-t border-ink/10 px-4 lg:px-5">
            {instalments.map((i) => (
              <li key={i.due.toISOString()} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">Due {short.format(i.due)}</p>
                  <p className="text-sm text-stone">
                    Covers {dayMonth.format(i.from)} – {short.format(i.to)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-ink tabular-nums">{formatMoney(i.amount - i.credit, true)}</p>
                  {i.credit > 0 && (
                    <p className="text-sm text-stone">
                      {formatMoney(i.amount, true)} <span className="text-sage">−{formatMoney(i.credit, true)}</span>
                      <span className="block">{creditLabel}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className={`flex justify-between gap-4 border-t border-ink/10 px-4 py-3 lg:px-5 ${text.label}`}>
            <span>Total to pay</span>
            <span className="font-bold text-ink tabular-nums">{formatMoney(total, true)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
