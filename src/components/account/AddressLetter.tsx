"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import Checkbox from "@/components/ui/Checkbox";
import { TextField } from "@/components/application/fields";
import { site } from "@/config/site";
import { formatMoney } from "@/lib/application";
import { fullName, hasMovedIn, renewalDates, useAccount } from "@/lib/account";
import AccountCard from "./AccountCard";
import PrintableDocument, { buildingAddress } from "./PrintableDocument";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

type Options = { to: string; rent: boolean; birthday: boolean };
const defaults: Options = { to: "", rent: false, birthday: false };

/** A proof of address letter: a few choices (who it's for, what to include), then the letter to print, remade when they change. */
export default function AddressLetter() {
  const account = useAccount()?.account;
  // What's in the form, and what the letter below was made with
  const [draft, setDraft] = useState<Options>(defaults);
  const [letter, setLetter] = useState<Options>(defaults);
  const changed = JSON.stringify(draft) !== JSON.stringify(letter);
  if (!account) return null;
  const m = account.membership;

  if (!m) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/documents">Back to your documents</BackLink>
        <AccountCard heading="Proof of address" intro="We can only write a letter for a current membership. If you think that’s wrong, speak to the front desk.">
          {null}
        </AccountCard>
      </div>
    );
  }

  const name = fullName(account);
  const checkIn = new Date(m.checkIn);
  const checkOut = m.renewal.requested ? new Date(m.renewal.requested.end) : renewalDates(m).checkOut;
  const building = buildingAddress(m.postalAddress);
  const dob = account.profile?.dateOfBirth;

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/documents">Back to your documents</BackLink>

      <AccountCard heading="Proof of address" intro="Choose what to include, then print the letter or save it as a PDF.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLetter(draft);
          }}
          className="flex flex-col gap-6"
        >
          <TextField
            id="letter-to"
            label="Who’s it for? (optional)"
            placeholder="e.g. Barclays Bank"
            value={draft.to}
            onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            maxLength={80}
          />
          <div className="flex flex-col gap-3">
            <Checkbox checked={draft.rent} onChange={(e) => setDraft({ ...draft, rent: e.target.checked })}>
              Include my monthly rent
            </Checkbox>
            {dob && (
              <Checkbox checked={draft.birthday} onChange={(e) => setDraft({ ...draft, birthday: e.target.checked })}>
                Include my date of birth
              </Checkbox>
            )}
          </div>
          {changed && (
            <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-4">
              <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
                Update letter
              </Button>
              <p className="text-sm text-stone" role="status">
                Update the letter to see your changes before printing it.
              </p>
            </div>
          )}
        </form>
      </AccountCard>

      <PrintableDocument from={building} outdated={changed}>
        <p className="text-stone">{long.format(new Date())}</p>
        <p className="mt-6">{letter.to.trim() ? `Dear ${letter.to.trim()},` : "To whom it may concern,"}</p>
        <h1 className="mt-6 text-lg font-bold">Confirmation of address: {name}</h1>
        <p className="mt-4">
          We confirm that {name}
          {letter.birthday && dob ? `, born ${long.format(new Date(dob))},` : ""} {hasMovedIn(m) ? "lives" : "will live"} at the address below as a member of {m.building}, under
          a membership agreement {hasMovedIn(m) ? "that began" : "starting"} on {long.format(checkIn)} and running until {long.format(checkOut)}.
        </p>
        <address className="mt-4 font-medium not-italic">
          {[name, ...m.postalAddress].map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        {letter.rent && <p className="mt-4">Their monthly licence fee is {formatMoney(m.monthlyPrice, true)}, which includes all bills, Wi-Fi and council tax.</p>}
        <p className="mt-4">If you need to check any of these details, please email us at {site.email}.</p>
        <p className="mt-8">Yours faithfully,</p>
        <p className="mt-8 font-bold">Member Experience Team</p>
        <p className="text-stone">{m.building}</p>
      </PrintableDocument>
    </div>
  );
}
