"use client";

import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import Photo from "@/components/ui/Photo";
import { Check } from "@/components/icons";
import { conditionReport, type ConditionArea } from "@/content/condition-report";
import { addConditionNote, CONDITION_DAYS, conditionDeadline, conditionWindowOpen, hasMovedIn, openConditionReport, useAccount, type ConditionNote } from "@/lib/account";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * The move-in condition report: each part of the room as the team found it at check-in, with
 * photos. For the first week members can report anything missed, so it isn't taken from their deposit.
 */
export default function ConditionReport() {
  const account = useAccount()?.account;
  const movedIn = account?.membership ? hasMovedIn(account.membership) : false;
  // Starts the demo's 7 days the first time they look
  useEffect(() => {
    if (movedIn) openConditionReport();
  }, [movedIn]);
  if (!account) return null;
  const m = account.membership;

  if (!m || !movedIn) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account">Back to your membership</BackLink>
        <AccountCard heading="Move-in condition report" intro="We’ll go round your room before you arrive and the report will be here on check-in day.">
          {null}
        </AccountCard>
      </div>
    );
  }

  const deadline = conditionDeadline(account);
  const open = conditionWindowOpen(account);
  const notes = account.conditionNotes ?? [];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account">Back to your membership</BackLink>
      <AccountCard
        heading="Move-in condition report"
        intro={`How your room ${m.roomNumber} was when you moved in on ${long.format(new Date(m.checkIn))}. We check against this when you move out, so anything not on it won’t come off your deposit.`}
      >
        <p className="rounded-2xl bg-cream p-5 text-base leading-relaxed text-ink">
          {open ? (
            <>
              <span className="font-bold">Spotted something we missed?</span> Report it by {long.format(deadline)} and we’ll add it to your report.
            </>
          ) : (
            <>The {CONDITION_DAYS} days to report problems ended on {long.format(deadline)}. If something’s broken now, report it through Support.</>
          )}
        </p>
      </AccountCard>

      {conditionReport.map((item) => (
        <AreaCard key={item.area} item={item} notes={notes.filter((n) => n.area === item.area)} open={open} />
      ))}
    </div>
  );
}

function AreaCard({ item, notes, open }: { item: ConditionArea; notes: ConditionNote[]; open: boolean }) {
  const [reporting, setReporting] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const note = String(new FormData(e.currentTarget).get("note") ?? "").trim();
    if (!note) return;
    addConditionNote(item.area, note);
    setReporting(false);
  };

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white p-6 sm:flex-row lg:p-8">
      {item.photo && (
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-ink/10 sm:w-48">
          <Photo src={item.photo.src} alt={item.photo.alt} sizes={sizes2x(["(min-width: 640px)", "12rem"], [null, "100vw"])} className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-ink">{item.area}</h2>
          <span className={`rounded-full px-3 py-1 text-sm font-medium text-ink ${item.condition === "Good" ? "bg-sage/20" : "bg-cream-dark"}`}>{item.condition}</span>
        </div>
        <p className={`mt-2 ${text.body}`}>{item.notes}</p>

        {notes.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {notes.map((n) => (
              <li key={n.at} className="rounded-xl bg-cream p-4 text-base text-ink">
                <span className="flex items-center gap-2 text-sm font-medium text-stone">
                  <Check className="size-4 text-sage" />
                  You reported on {long.format(new Date(n.at))}
                </span>
                <span className="mt-1 block">{n.note}</span>
              </li>
            ))}
          </ul>
        )}

        {open &&
          (reporting ? (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <label htmlFor={`note-${item.area}`} className="sr-only">
                What’s wrong with the {item.area.toLowerCase()}?
              </label>
              <textarea
                id={`note-${item.area}`}
                name="note"
                rows={3}
                required
                autoFocus
                placeholder="e.g. A chip in the paint behind the door"
                className="w-full rounded-xl border border-ink/15 bg-white p-4 text-base text-ink placeholder:text-stone focus:border-ink focus:outline-none"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" variant="dark" className="justify-center">
                  Send
                </Button>
                <Button variant="outline" onClick={() => setReporting(false)} className="justify-center">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => setReporting(true)} className="mt-4 font-medium text-ink underline underline-offset-4">
              {notes.length ? "Report something else" : "Report a problem"}
            </button>
          ))}
      </div>
    </section>
  );
}
