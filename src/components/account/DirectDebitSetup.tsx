"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import { ArrowLeft, Lock } from "@/components/icons";
import { TextField } from "@/components/application/fields";
import { completeDirectDebitSetup, useAccount } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

// A few UK sort-code prefixes, so the demo can name the bank like GoCardless does
const banks: [RegExp, string][] = [
  [/^20/, "Barclays"],
  [/^(30|77)/, "Lloyds"],
  [/^(40|11)/, "HSBC"],
  [/^(60|01)/, "NatWest"],
  [/^04/, "Monzo"],
];

/**
 * DEMO stand-in for GoCardless's hosted bank details page. TODO: replace with GoCardless's Billing
 * Request Flow (their own page or drop-in), started by our backend; bank details must never pass
 * through our site.
 */
export default function DirectDebitSetup() {
  const router = useRouter();
  const account = useAccount()?.account;
  if (!account) return null;
  const changing = Boolean(account.membership?.directDebit);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const sortCode = String(data.get("sortCode")).replace(/\D/g, "");
    const accountNumber = String(data.get("accountNumber"));
    completeDirectDebitSetup({ bank: banks.find(([prefix]) => prefix.test(sortCode))?.[1] ?? "Your bank", accountEnding: accountNumber.slice(-4) });
    router.push("/account?directDebit=updated#billing");
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/account#billing" className="inline-flex items-center gap-2 self-start text-base font-medium text-ink hover:opacity-70">
        <ArrowLeft />
        Back to your membership
      </Link>

      <AccountCard
        heading={changing ? "Change your bank details" : "Set up your Direct Debit"}
        intro="Your rent is collected by Direct Debit on the 1st of each month, through our payment partner GoCardless."
      >
        <InfoBox className="mb-6">
          <span className="font-bold">Demo:</span> on the live site this step happens on GoCardless’s own secure page, so your bank details never pass through
          ours.
        </InfoBox>

        <form onSubmit={submit} className="flex flex-col gap-6">
          <TextField id="holder" label="Account holder name" autoComplete="name" required defaultValue={account.name} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="sortCode" label="Sort code" inputMode="numeric" placeholder="00-00-00" pattern="\d{2}-?\d{2}-?\d{2}" title="6 digits, e.g. 20-00-00" required />
            <TextField id="accountNumber" label="Account number" inputMode="numeric" pattern="\d{8}" title="8 digits" required />
          </div>

          <InfoBox>
            <span className="font-bold">The Direct Debit Guarantee.</span> If an error is made in the amount or date of your Direct Debit, you’re entitled to a
            full and immediate refund from your bank. You can cancel a Direct Debit at any time by contacting your bank.
          </InfoBox>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" variant="dark" className="w-full justify-center sm:w-auto">
              {changing ? "Update Direct Debit" : "Set up Direct Debit"}
            </Button>
            <p className={`flex items-center gap-2 ${text.label}`}>
              <Lock />
              Secured by GoCardless
            </p>
          </div>
          {changing && <p className="text-sm text-stone">Your old Direct Debit is cancelled once the new one is set up.</p>}
        </form>
      </AccountCard>
    </div>
  );
}
