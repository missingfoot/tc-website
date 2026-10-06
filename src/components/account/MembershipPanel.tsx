"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/icons";
import { Details } from "@/components/application/fields";
import { formatMoney } from "@/lib/application";
import { renewalDates, useAccount, type Referral } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import Countdown from "./Countdown";
import DirectDebitStatus from "./DirectDebitStatus";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
// Short months for the check-in / check-out box, where each date gets under half the width on phones
const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

/** A check-in / check-out date: "8 Jan 2026", with the year on a subtle line of its own on phones. */
function BoxDate({ date }: { date: Date }) {
  return (
    <p className="mt-1 text-xl font-bold text-ink">
      {dayMonth.format(date)}
      <span className="max-sm:block max-sm:text-sm max-sm:font-normal max-sm:text-stone"> {date.getFullYear()}</span>
    </p>
  );
}

// `detail` (e.g. the friend's email) is left out on phones, where long ones crowd the row
type Deduction = { amount: number; reason: string; detail?: string };
type Payment = { date: Date; amount: number; paid: boolean; deductions: Deduction[] };

/**
 * The months of rent from check-in to check-out, each due on the 1st, latest first. Referral
 * rewards come off the rent: a paid one on the most recent payment made, one for a friend who's
 * moved in on the next payment due. TODO: with a backend, use the real payment each reward was applied to.
 */
function rentSchedule(checkIn: Date, checkOut: Date, monthly: number, referrals: Referral[]): Payment[] {
  const payments: Payment[] = [];
  const day = new Date(checkIn.getFullYear(), checkIn.getMonth() + 1, 1);
  while (day < checkOut) {
    payments.push({ date: new Date(day), amount: monthly, paid: day.getTime() < Date.now(), deductions: [] });
    day.setMonth(day.getMonth() + 1);
  }
  const lastPaid = payments.findLast((p) => p.paid);
  const nextDue = payments.find((p) => !p.paid);
  for (const r of referrals) {
    const target = r.status === "paid" ? lastPaid : r.status === "moved-in" ? nextDue : undefined;
    if (!target || !r.reward) continue;
    target.deductions.push({ amount: r.reward, reason: "Referral reward", detail: r.email });
    target.amount -= r.reward;
  }
  return payments.reverse();
}

/** Membership tab: the booking, postal address, billing and rent schedule. */
export default function MembershipPanel({ directDebitUpdated = false }: { directDebitUpdated?: boolean }) {
  const account = useAccount()?.account;
  const [copied, setCopied] = useState(false);
  const [allPayments, setAllPayments] = useState(false);
  if (!account) return null;

  const m = account.membership;
  if (!m) {
    return (
      <AccountCard heading="Your membership" intro="We can’t find an active membership. If you think that’s wrong, speak to the front desk.">
        <Button href="/co-living" variant="dark" arrow className="w-full justify-center lg:w-auto">
          Find your next home
        </Button>
      </AccountCard>
    );
  }

  const checkIn = new Date(m.checkIn);
  const { checkOut: currentCheckOut, renewBy } = renewalDates(m);
  // Once they've asked to renew, they check out at the end of the new term instead
  const checkOut = m.renewal.requested ? new Date(m.renewal.requested.end) : currentCheckOut;
  checkOut.setHours(10, 0, 0, 0);
  // TODO: once a renewal is confirmed, add the new term's payments (at its price) to the schedule
  const schedule = rentSchedule(checkIn, currentCheckOut, m.monthlyPrice, account.referrals);
  // Latest first, so the payments due are at the top; the last one made follows them
  const lastPaidIndex = schedule.findIndex((p) => p.paid);
  // By default: the next two payments due and the last one made
  const firstShown = Math.max(0, (lastPaidIndex === -1 ? schedule.length : lastPaidIndex + 1) - 3);
  const shown = allPayments ? schedule : schedule.slice(firstShown, firstShown + 3);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(m.postalAddress.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AccountCard heading="Your booking">
        <Details
          rows={[
            ["Room type", m.roomType],
            ["Building", m.building],
            ["Floor", m.floor],
            ["Room number", m.roomNumber],
          ]}
        />
        {/* Spread evenly, so the arrow sits the same distance from both dates whatever their length */}
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-cream p-5">
          <div>
            <p className={text.label}>Check-in</p>
            <BoxDate date={checkIn} />
          </div>
          <ArrowRight className="size-6 shrink-0 text-stone" />
          <div className="text-right">
            <p className={text.label}>Check-out</p>
            <BoxDate date={checkOut} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {m.renewal.movingOut ? (
            <div className="rounded-2xl bg-cream p-5 text-ink">
              <p className={text.label}>Renewal</p>
              <p className="mt-2 text-2xl font-bold leading-heading">Moving out</p>
              <p className="mt-2 text-sm text-stone">You’ve told us you’re not renewing</p>
            </div>
          ) : m.renewal.requested ? (
            <div className="rounded-2xl bg-sage/20 p-5 text-ink">
              <p className={text.label}>Renewal</p>
              <p className="mt-2 text-2xl font-bold leading-heading">Requested</p>
              <p className="mt-2 text-sm text-stone">For another {m.renewal.requested.months} months</p>
            </div>
          ) : (
            <Countdown start={new Date(m.checkIn)} emphasis label="Time left to renew" target={renewBy} note={`Renew by ${long.format(renewBy)} to keep your room`} passed="Renewal deadline passed" />
          )}
          {/* After renewing, the bar starts full again and drains towards the new check-out */}
          <Countdown start={new Date(m.renewal.requested?.at ?? m.checkIn)} label="Until check-out" target={checkOut} note={`${long.format(checkOut)}, by 10:00`} passed="Checked out" />
        </div>
        {!m.renewal.movingOut && (
          <p className={`mt-6 ${text.body}`}>Your notice period is {m.noticeMonths} months.</p>
        )}
        {!m.renewal.movingOut && (
          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <Button href={m.renewal.requested ? "/account/renewal" : "/account/renewal?choice=renew"} variant="dark" arrow className="w-full justify-center lg:w-auto">
              {m.renewal.requested ? "View your renewal" : "Renew your membership"}
            </Button>
            {!m.renewal.requested && (
              <Button href="/account/renewal?choice=leave" variant="outline" className="w-full justify-center lg:w-auto">
                I’m moving out
              </Button>
            )}
          </div>
        )}
      </AccountCard>

      <AccountCard heading="Your postal address" intro="For post and deliveries. The front desk signs for parcels when you’re out.">
        <address className="text-base leading-relaxed text-ink not-italic">
          {m.postalAddress.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <Button variant="outline" onClick={copyAddress} className="mt-6 w-full justify-center lg:w-auto">
          {copied && <Check />}
          {copied ? "Copied" : "Copy address"}
        </Button>
      </AccountCard>

      <AccountCard heading="Billing" id="billing">
        <Details
          rows={[
            ["Price", `${formatMoney(m.monthlyPrice)} per month`],
            ["Paid", "Monthly by Direct Debit, on the 1st"],
          ]}
        />
        <DirectDebitStatus directDebit={m.directDebit} justUpdated={directDebitUpdated} />
        <h3 className="mt-8 font-bold text-ink">Rent schedule</h3>
        <ul className="mt-3 divide-y divide-ink/10">
          {shown.map((p) => (
            <li key={p.date.toISOString()} className="py-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-ink">{long.format(p.date)}</span>
                <span className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${p.paid ? "bg-sage/20 text-ink" : "bg-cream text-ink"}`}>{p.paid ? "Paid" : "Upcoming"}</span>
                  <span className="w-16 text-right font-bold text-ink">{formatMoney(p.amount)}</span>
                </span>
              </div>
              {p.deductions.map((d) => (
                <p key={`${d.reason}-${d.detail}`} className="mt-1 flex justify-between gap-4 text-sm text-stone">
                  <span className="min-w-0 truncate">
                    {d.reason}
                    {d.detail && <span className="max-sm:hidden">: {d.detail}</span>}
                  </span>
                  <span className="shrink-0 font-medium text-sage">−{formatMoney(d.amount)}</span>
                </p>
              ))}
            </li>
          ))}
        </ul>
        {schedule.length > shown.length || allPayments ? (
          <button type="button" onClick={() => setAllPayments(!allPayments)} className="mt-4 font-medium text-ink underline underline-offset-4">
            {allPayments ? "Show fewer" : `Show all ${schedule.length} payments`}
          </button>
        ) : null}
        <p className={`mt-6 ${text.body}`}>
          Have a question about a payment?{" "}
          <Link href="/faq" className="font-medium text-ink underline underline-offset-4">
            See our FAQ
          </Link>{" "}
          or speak to the front desk.
        </p>
      </AccountCard>
    </>
  );
}
