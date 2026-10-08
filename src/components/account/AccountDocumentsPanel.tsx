"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { ChevronRight } from "@/components/icons";
import { formatMoney } from "@/lib/application";
import { agreements, monthKey, rentPayments, useAccount } from "@/lib/account";
import AccountCard from "./AccountCard";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Documents tab: your agreements, a proof of address letter, a rent statement, and a receipt for each payment. */
export default function AccountDocumentsPanel() {
  const account = useAccount()?.account;
  const [all, setAll] = useState(false);
  if (!account) return null;
  const paid = rentPayments(account).filter((p) => p.paid);
  const shown = all ? paid : paid.slice(0, 6);

  const signed = agreements(account);

  return (
    <>
      {signed.length > 0 && (
        <AccountCard heading="Your agreements" intro="Every membership agreement you’ve signed with us, to read or print.">
          <ul className="-my-3 divide-y divide-ink/10">
            {signed.map((a) => (
              <li key={a.id}>
                <Link href={`/account/documents/agreements/${a.id}`} className="group flex items-center gap-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{a.title}</span>
                    <span className="block text-sm text-stone">
                      {long.format(a.start)} to {long.format(a.end)}
                    </span>
                  </span>
                  <ChevronRight className="text-stone transition-transform group-hover:translate-x-0.5" />
                  <span className="sr-only">View agreement</span>
                </Link>
              </li>
            ))}
          </ul>
        </AccountCard>
      )}

      <AccountCard heading="Proof of address" intro="A letter confirming you live here and for how long, for banks, your GP, employers or visa applications.">
        <Button href="/account/documents/proof-of-address" variant="dark" className="w-full justify-center lg:w-auto">
          Get a letter
        </Button>
      </AccountCard>

      <AccountCard heading="Rent statement" intro="Every payment over a period you choose, with any referral rewards taken off. Handy for a guarantor, your employer or your tax return.">
        <Button href="/account/documents/statement" variant="dark" className="w-full justify-center lg:w-auto">
          Get a statement
        </Button>
      </AccountCard>

      <AccountCard heading="Receipts" intro="A receipt for each month’s rent, once it’s been paid.">
        {paid.length === 0 ? (
          <p className="text-base text-stone">Your first receipt will appear here after your first payment.</p>
        ) : (
          <>
            <ul className="-my-3 divide-y divide-ink/10">
              {shown.map((p) => (
                <li key={p.date.toISOString()}>
                  <Link href={`/account/documents/receipts/${monthKey(p.date)}`} className="group flex items-center gap-4 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{monthYear.format(p.date)}</span>
                      <span className="block text-sm text-stone">Paid {long.format(p.date)}</span>
                    </span>
                    <span className="font-bold text-ink tabular-nums">{formatMoney(p.amount)}</span>
                    <ChevronRight className="text-stone transition-transform group-hover:translate-x-0.5" />
                    <span className="sr-only">View receipt</span>
                  </Link>
                </li>
              ))}
            </ul>
            {paid.length > shown.length || all ? (
              <button type="button" onClick={() => setAll(!all)} className="mt-6 font-medium text-ink underline underline-offset-4">
                {all ? "Show fewer" : `Show all ${paid.length} receipts`}
              </button>
            ) : null}
          </>
        )}
      </AccountCard>
    </>
  );
}
