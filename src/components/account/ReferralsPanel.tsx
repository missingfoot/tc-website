"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import AccountCard from "./AccountCard";
import { Check, Facebook, Mail, Twitter } from "@/components/icons";
import EmailChips from "@/components/referrals/EmailChips";
import { formatMoney } from "@/lib/application";
import { inviteFriends, referralTotals, revokeInvite, useAccount, type Account, type ReferralStatus } from "@/lib/account";
import { field, text } from "@/lib/styles";

const statusLabels: Record<ReferralStatus, { label: string; tone: string }> = {
  invited: { label: "Invited", tone: "bg-cream text-ink" },
  toured: { label: "Booked a tour", tone: "bg-cream text-ink" },
  "moved-in": { label: "Moved in", tone: "bg-sage/20 text-ink" },
  paid: { label: "Paid", tone: "bg-sage text-white" },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Referrals tab: totals, the referral link, email invites and the referrals so far. Rewards come off the member's rent. */
export default function ReferralsPanel() {
  const account = useAccount()?.account;
  // The account layout only shows this once signed in
  if (!account) return null;

  const totals = referralTotals(account.referrals);

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {[
          ["Earned", formatMoney(totals.earned)],
          ["On its way", formatMoney(totals.pending)],
          ["Friends invited", String(totals.invited)],
        ].map(([label, value]) => (
          <li key={label} className="rounded-2xl bg-white p-6">
            <p className={text.label}>{label}</p>
            <p className="mt-2 text-4xl font-bold leading-heading text-ink">{value}</p>
          </li>
        ))}
      </ul>

      <ShareLink code={account.code} />
      <InviteByEmail />
      <ReferralList account={account} />
    </div>
  );
}

// The page's own address, read in the browser (the server doesn't know it)
const noSubscribe = () => () => {};
const useOrigin = () =>
  useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );

function ShareLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const link = `${origin}/apply?ref=${code}`;
  const message = `I live at The Collective and think you’d love it. Use my link to get up to £200 off your rent: ${link}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shares = [
    {
      label: "Share by email",
      href: `mailto:?subject=${encodeURIComponent("Come and live at The Collective")}&body=${encodeURIComponent(message)}`,
      icon: Mail,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      icon: Twitter,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      icon: Facebook,
    },
  ];

  return (
    <AccountCard heading="Your link" intro="It’s unique to you, so we know who to thank. Your friend uses it when they book.">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 gap-2">
          <input
            readOnly
            value={link}
            aria-label="Your referral link"
            onFocus={(e) => e.currentTarget.select()}
            className={`${field} min-w-0 flex-1 bg-cream/40`}
          />
          <Button variant="dark" onClick={copy} className="shrink-0">
            {copied ? <Check /> : null}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <ul className="flex gap-2">
          {shares.map(({ label, href, icon: ShareIcon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-12 items-center justify-center rounded-full bg-cream text-ink hover:bg-cream-dark"
              >
                <ShareIcon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AccountCard>
  );
}

function InviteByEmail() {
  const [emails, setEmails] = useState<string[]>([]);
  const [sent, setSent] = useState<number | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emails.length === 0) return;
    setSent(inviteFriends(emails));
    setEmails([]);
    e.currentTarget.reset();
  };

  return (
    <AccountCard heading="Invite by email" intro="Add your friends’ emails and we’ll let them know you referred them.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label htmlFor="invite-emails" className={text.label}>
          Your friends’ email addresses
        </label>
        <EmailChips id="invite-emails" emails={emails} onChange={(next) => (setEmails(next), setSent(null))} />
        <Checkbox name="consent" required>
          They’re happy for me to share their email with The Collective
        </Checkbox>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
            Send {emails.length > 1 ? `${emails.length} invites` : "invite"}
          </Button>
          {sent !== null && (
            <p role="status" className="flex items-center gap-2 text-base text-ink">
              <Check className="text-sage" />
              {sent === 0 ? "You’ve already invited them." : `${sent} ${sent === 1 ? "invite" : "invites"} sent.`}
            </p>
          )}
        </div>
      </form>
    </AccountCard>
  );
}

function ReferralList({ account }: { account: Account }) {
  return (
    <AccountCard heading="Your referrals" intro="Once a friend has paid their first month’s rent, your reward comes off your next rent payment.">
      {account.referrals.length === 0 ? (
        <p className={text.body}>No one yet. Share your link or invite a friend by email to get started.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {account.referrals.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{r.email}</p>
                <p className="text-sm text-stone">Invited {dateFormat.format(new Date(r.invitedAt))}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusLabels[r.status].tone}`}>{statusLabels[r.status].label}</span>
                <span className="w-16 text-right font-bold text-ink">{r.reward ? formatMoney(r.reward) : ""}</span>
                {r.status === "invited" ? (
                  <button type="button" onClick={() => revokeInvite(r.id)} className="w-16 text-sm font-medium text-ink underline underline-offset-4">
                    Revoke
                  </button>
                ) : (
                  <span className="w-16" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountCard>
  );
}
