"use client";

import { Check } from "@/components/icons";
import { Details } from "@/components/application/fields";
import { formatMoney } from "@/lib/application";
import { depositStages, depositStatus, type Membership } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** The deposit: how much, what it's for, and the steps to getting it back after moving out (ticked as they happen). */
export default function DepositCard({ m }: { m: Membership }) {
  const deposit = depositStatus(m);
  const reached = depositStages.findIndex((s) => s.id === deposit.stage.id);
  const { movedOut } = deposit;

  return (
    <AccountCard heading="Your deposit" intro="Held while you live here and paid back after you move out, less the cost of any damage beyond normal wear and tear.">
      <Details
        rows={[
          ["Amount", formatMoney(deposit.amount)],
          ["Held since", long.format(new Date(m.checkIn))],
          ["Paid back by", movedOut ? long.format(deposit.refundBy) : "Within 10 days of moving out"],
        ]}
      />
      <h3 className="mt-8 font-bold text-ink">After you move out</h3>
      <ol className="mt-4 flex flex-col gap-4">
        {depositStages.map((s, i) => {
          const done = movedOut && i <= reached;
          return (
            <li key={s.id} className="flex items-center gap-4">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-sage text-white" : "bg-cream text-ink"}`}>
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-ink">{s.label}</span>
                <span className="block text-sm text-stone">{stageNotes[s.id]}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className={`mt-6 ${text.body}`}>It’s paid back to the account your rent comes from. If we need to take anything off, we’ll explain why, with photos, before we do.</p>
    </AccountCard>
  );
}

const stageNotes: Record<(typeof depositStages)[number]["id"], string> = {
  held: "Safe with us until check-out",
  inspection: "We check the room against your move-in condition report",
  processing: "Any deductions agreed, and the refund sent",
  paid: "In your account",
};
