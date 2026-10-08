"use client";

import BackLink from "@/components/ui/BackLink";
import { formatMoney } from "@/lib/application";
import { fullName, monthKey, rentPayments, useAccount } from "@/lib/account";
import AccountCard from "./AccountCard";
import PrintableDocument, { buildingAddress } from "./PrintableDocument";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** The receipt for one month's rent (`month` is "2026-09"), to print. */
export default function RentReceipt({ month }: { month: string }) {
  const account = useAccount()?.account;
  if (!account) return null;
  const m = account.membership;
  const payment = rentPayments(account).find((p) => p.paid && monthKey(p.date) === month);

  if (!m || !payment) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/documents">Back to your documents</BackLink>
        <AccountCard heading="Receipt not found" intro="There’s no paid rent for that month. Your receipts are listed under Documents.">
          {null}
        </AccountCard>
      </div>
    );
  }

  const rows: [string, string][] = [
    [`Rent, ${monthYear.format(payment.date)}`, formatMoney(m.monthlyPrice, true)],
    ...payment.deductions.map((d): [string, string] => [d.reason, `−${formatMoney(d.amount, true)}`]),
  ];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/documents">Back to your documents</BackLink>
      <PrintableDocument from={buildingAddress(m.postalAddress)}>
        <h1 className="text-lg font-bold">Receipt</h1>
        <p className="text-stone">Reference {account.code}-{month.replace("-", "")}</p>

        <dl className="mt-8 grid grid-cols-[8rem_1fr] gap-y-1">
          <dt className="text-stone">Received from</dt>
          <dd>{fullName(account)}</dd>
          <dt className="text-stone">Room</dt>
          <dd>
            {m.roomNumber}, {m.building}
          </dd>
          <dt className="text-stone">Date paid</dt>
          <dd>{long.format(payment.date)}</dd>
          <dt className="text-stone">Paid by</dt>
          <dd>Direct Debit{m.directDebit ? `, ${m.directDebit.bank} ••••${m.directDebit.accountEnding}` : ""}</dd>
        </dl>

        <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/15">
          {rows.map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-4 py-2">
              <dt>{label}</dt>
              <dd className="tabular-nums">{amount}</dd>
            </div>
          ))}
        </dl>
        <p className="flex justify-between gap-4 py-3 text-base font-bold">
          <span>Total paid</span>
          <span className="tabular-nums">{formatMoney(payment.amount, true)}</span>
        </p>
        <p className="mt-8 text-stone">Thank you. Includes all bills, Wi-Fi and council tax.</p>
      </PrintableDocument>
    </div>
  );
}
