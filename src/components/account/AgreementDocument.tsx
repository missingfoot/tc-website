"use client";

import BackLink from "@/components/ui/BackLink";
import { formatMoney } from "@/lib/application";
import { agreements, depositStatus, fullName, useAccount } from "@/lib/account";
import AccountCard from "./AccountCard";
import PrintableDocument, { buildingAddress } from "./PrintableDocument";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * A signed membership agreement (`id` is "current" or "renewal"), to read or print. DEMO: the key
 * terms only. TODO: the real signed PDF from the e-signature service.
 */
export default function AgreementDocument({ id }: { id: string }) {
  const account = useAccount()?.account;
  if (!account) return null;
  const m = account.membership;
  const agreement = agreements(account).find((a) => a.id === id);

  if (!m || !agreement) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/documents">Back to your documents</BackLink>
        <AccountCard heading="Agreement not found" intro="Your agreements are listed under Documents.">
          {null}
        </AccountCard>
      </div>
    );
  }

  const name = fullName(account);
  const details: [string, string][] = [
    ["Member", name],
    ["Room", `${m.roomType}, room ${m.roomNumber}, floor ${m.floor}`],
    ["Building", m.building],
    ["Starts", long.format(agreement.start)],
    ["Ends", long.format(agreement.end)],
    ["Monthly licence fee", formatMoney(agreement.monthlyPrice, true)],
    ["Security deposit", formatMoney(depositStatus(m).amount, true)],
  ];
  const terms = [
    `This is a licence to occupy your room at ${m.building}, between you and The Collective, from ${long.format(agreement.start)} to ${long.format(agreement.end)}.`,
    `The monthly licence fee of ${formatMoney(agreement.monthlyPrice, true)} is due on the 1st of each month by Direct Debit and includes all bills, Wi-Fi and council tax.`,
    "Your security deposit is held for the length of your membership and paid back after you move out, less the cost of any damage beyond normal wear and tear.",
    `To leave or renew, give us ${m.noticeMonths} months’ notice before your membership ends.`,
    "You agree to follow the house rules and to look after your room and the shared spaces.",
  ];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/documents">Back to your documents</BackLink>
      <PrintableDocument from={buildingAddress(m.postalAddress)}>
        <h1 className="text-lg font-bold">Membership agreement{agreement.id === "renewal" ? " (renewal)" : ""}</h1>
        <p className="text-stone">Reference {account.code}-{agreement.id === "renewal" ? "R" : "M"}</p>

        <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/15">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2">
              <dt className="text-stone">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-8 font-bold">Key terms</h2>
        <ol className="mt-2 flex list-decimal flex-col gap-2 pl-5">
          {terms.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>

        <div className="mt-10 border-t border-ink/15 pt-4">
          <p className="font-bold">{name}</p>
          <p className="text-stone">Signed electronically on {long.format(agreement.signedAt)}</p>
        </div>
      </PrintableDocument>
    </div>
  );
}
