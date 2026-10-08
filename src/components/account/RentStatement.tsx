"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import Select from "@/components/ui/Select";
import { formatMoney } from "@/lib/application";
import { fullName, monthKey, rentPayments, useAccount, type RentPayment } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import PrintableDocument, { buildingAddress } from "./PrintableDocument";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const short = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** A statement of rent paid between two months they choose (all of it to start with), to print. */
export default function RentStatement() {
  const account = useAccount()?.account;
  // Oldest first
  const paid = account
    ? rentPayments(account)
        .filter((p) => p.paid)
        .reverse()
    : [];
  const months = paid.map((p) => ({ value: monthKey(p.date), label: monthYear.format(p.date) }));
  // The months picked, and the ones the statement below was made for (undefined: all of them)
  const [draft, setDraft] = useState<{ from?: string; to?: string }>({});
  const [made, setMade] = useState<{ from?: string; to?: string }>({});
  if (!account) return null;
  const m = account.membership;

  if (!m || paid.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/documents">Back to your documents</BackLink>
        <AccountCard heading="Rent statement" intro="Your statement will be ready once you’ve made your first payment.">
          {null}
        </AccountCard>
      </div>
    );
  }

  const range = (r: { from?: string; to?: string }) => [r.from ?? months[0].value, r.to ?? months.at(-1)!.value];
  const [pickedStart, pickedEnd] = range(draft);
  const [start, end] = range(made);
  const changed = pickedStart !== start || pickedEnd !== end;
  // Picking a start after the end (or the reverse) swaps them rather than showing nothing
  const [first, last] = start <= end ? [start, end] : [end, start];
  const rows = paid.filter((p) => monthKey(p.date) >= first && monthKey(p.date) <= last);
  const total = rows.reduce((n, p) => n + p.amount, 0);
  const name = fullName(account);

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/documents">Back to your documents</BackLink>

      <AccountCard heading="Rent statement" intro="Choose the months to include, then print the statement or save it as a PDF.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMade(draft);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="statement-from" className={`block ${text.label}`}>
                From
              </label>
              <Select id="statement-from" options={months} value={pickedStart} onChange={(e) => setDraft({ ...draft, from: e.target.value })} className="mt-2" />
            </div>
            <div>
              <label htmlFor="statement-to" className={`block ${text.label}`}>
                To
              </label>
              <Select id="statement-to" options={months} value={pickedEnd} onChange={(e) => setDraft({ ...draft, to: e.target.value })} className="mt-2" />
            </div>
          </div>
          {changed && (
            <div className="mt-6 flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-4">
              <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
                Update statement
              </Button>
              <p className="text-sm text-stone" role="status">
                Update the statement to see your changes before printing it.
              </p>
            </div>
          )}
        </form>
      </AccountCard>

      <PrintableDocument from={buildingAddress(m.postalAddress)} outdated={changed}>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <h1 className="text-lg font-bold">Rent statement</h1>
            <p className="text-stone">
              {monthYear.format(rows[0].date)} to {monthYear.format(rows.at(-1)!.date)}
            </p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 sm:text-right">
            <dt className="text-stone">Member</dt>
            <dd>{name}</dd>
            <dt className="text-stone">Room</dt>
            <dd>
              {m.roomNumber}, {m.building}
            </dd>
            <dt className="text-stone">Issued</dt>
            <dd>{long.format(new Date())}</dd>
          </dl>
        </div>

        <table className="mt-8 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/15 text-stone">
              <th scope="col" className="py-2 pr-4 font-normal">
                Date
              </th>
              <th scope="col" className="py-2 pr-4 font-normal">
                Description
              </th>
              <th scope="col" className="py-2 text-right font-normal">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <StatementRows key={p.date.toISOString()} payment={p} monthlyPrice={m.monthlyPrice} />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink/15 font-bold">
              <td colSpan={2} className="py-3 pr-4">
                Total paid
              </td>
              <td className="py-3 text-right tabular-nums">{formatMoney(total, true)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-8 text-stone">Rent is collected by Direct Debit on the 1st of each month and includes all bills, Wi-Fi and council tax.</p>
      </PrintableDocument>
    </div>
  );
}

/** A month's rent, then a line for each reward taken off it. */
function StatementRows({ payment, monthlyPrice }: { payment: RentPayment; monthlyPrice: number }) {
  return (
    <>
      <tr className="border-b border-ink/10 align-top">
        <td className="py-2 pr-4 whitespace-nowrap">{short.format(payment.date)}</td>
        <td className="py-2 pr-4">Rent, {monthYear.format(payment.date)}</td>
        <td className="py-2 text-right tabular-nums">{formatMoney(monthlyPrice, true)}</td>
      </tr>
      {payment.deductions.map((d) => (
        <tr key={`${d.reason}-${d.detail}`} className="border-b border-ink/10 align-top text-stone">
          <td className="py-2 pr-4" />
          <td className="py-2 pr-4">{d.reason}</td>
          <td className="py-2 text-right tabular-nums">−{formatMoney(d.amount, true)}</td>
        </tr>
      ))}
    </>
  );
}
