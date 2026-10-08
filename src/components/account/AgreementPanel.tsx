"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import Checkbox from "@/components/ui/Checkbox";
import FaqAccordion from "@/components/ui/FaqAccordion";
import InfoBox from "@/components/ui/InfoBox";
import { Details, TextField } from "@/components/application/fields";
import { formatMoney } from "@/lib/application";
import { documentStatus, fullName, requiredDocuments, signAgreement, useAccount } from "@/lib/account";
import AccountCard from "./AccountCard";
import { renewalTerms } from "./RenewalPanel";
import SuccessCard from "./SuccessCard";

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** A typed name counts as the signature when it matches theirs (ignoring case and extra spaces). */
const normalise = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Renewal: sign the new membership agreement, once the documents are checked. The typed name is the
 * signature. DEMO: TODO: send it through an e-signature service (e.g. DocuSign), which keeps the record.
 */
export default function AgreementPanel() {
  const account = useAccount()?.account;
  const [problem, setProblem] = useState("");
  if (!account) return null;
  const m = account.membership;
  const request = m?.renewal.requested;

  if (!m || !request) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/renewal">Back to your renewal</BackLink>
        <AccountCard heading="Membership agreement" intro="Your new agreement appears here once you’ve asked to renew.">
          <Button href="/account/renewal" variant="dark" className="w-full justify-center lg:w-auto">
            Renew your membership
          </Button>
        </AccountCard>
      </div>
    );
  }

  const documentsChecked = requiredDocuments(account).every((k) => documentStatus(account.documents?.[k]) === "approved");
  const name = fullName(account);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typed = String(new FormData(e.currentTarget).get("signature"));
    if (normalise(typed) !== normalise(name)) return setProblem(`Type your name exactly as it appears: ${name}.`);
    signAgreement();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/renewal">Back to your renewal</BackLink>

      {m.renewal.agreementSignedAt && (
        <SuccessCard heading="Agreement signed">
          You signed on {long.format(new Date(m.renewal.agreementSignedAt))}, so your renewal is confirmed. We’ve emailed you a copy, and your {m.renewal.bonus} is on its way as our
          thank-you for staying.
        </SuccessCard>
      )}

      <AccountCard heading="Your membership agreement" intro="A licence to occupy your room at The Collective, between you and The Collective Old Oak.">
        <Details
          split
          lines
          rows={[
            ["Member", name],
            ["Room", `${m.roomType}, room ${m.roomNumber}, floor ${m.floor}`],
            ["Building", m.building],
            ["Starts", long.format(new Date(request.start))],
            ["Ends", long.format(new Date(request.end))],
            ["Monthly licence fee", formatMoney(request.monthlyPrice)],
            ["Notice to leave or renew", `${m.noticeMonths} months`],
          ]}
        />
        <div className="mt-6">
          <FaqAccordion idPrefix="agreement-terms" initiallyOpen={[]} items={renewalTerms} />
        </div>
      </AccountCard>

      {!m.renewal.agreementSignedAt &&
        (documentsChecked ? (
          <AccountCard heading="Sign your agreement" intro="Typing your name below is your signature, just like signing on paper.">
            <form onSubmit={submit} className="flex flex-col gap-6">
              <div>
                <TextField id="signature" label="Your full name" autoComplete="name" required onChange={() => setProblem("")} />
                {problem && (
                  <p role="alert" className="mt-2 text-sm text-red-700">
                    {problem}
                  </p>
                )}
              </div>
              <Checkbox required>I’ve read my membership agreement and agree to its terms</Checkbox>
              <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto lg:self-start">
                Sign agreement
              </Button>
            </form>
          </AccountCard>
        ) : (
          <AccountCard heading="Sign your agreement">
            <InfoBox>You can sign once we’ve checked your documents. Upload them if you haven’t yet, and we’ll let you know when they’re checked.</InfoBox>
            <Button href="/account/renewal/documents" variant="dark" className="mt-6 w-full justify-center lg:w-auto">
              Your documents
            </Button>
          </AccountCard>
        ))}
    </div>
  );
}
