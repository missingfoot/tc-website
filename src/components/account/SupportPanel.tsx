"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { Book, Check, ChevronRight, Copy, Phone, TeamChat, Warning } from "@/components/icons";
import { site } from "@/config/site";
import { ticketCategories } from "@/content/support";
import { useAccount, type Ticket } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import TicketStatus from "./TicketStatus";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Support tab: report an issue, the Member Support Hub, urgent help and the member's tickets. */
export default function SupportPanel() {
  const account = useAccount()?.account;
  if (!account) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <ActionCard
          icon={TeamChat}
          heading="Ask us anything"
          body="Report a problem or ask a question, and we’ll reply here."
          action="Report an issue"
          href="/account/support/new"
        />
        <ActionCard
          icon={Book}
          heading="Find an answer"
          body="Guides to living at Old Oak, from house rules to parcels."
          action="Member Support Hub"
          href="/support"
          newTab
        />
      </div>
      <UrgentHelp />
      <TicketList tickets={account.tickets} />
    </div>
  );
}

type ActionCardProps = { icon: ComponentType<{ className?: string }>; heading: string; body: string; action: string; href: string; newTab?: boolean };

function ActionCard({ icon: CardIcon, heading, body, action, href, newTab }: ActionCardProps) {
  return (
    <section className="flex flex-col rounded-2xl bg-white p-6 lg:p-8">
      <span className="flex size-12 items-center justify-center rounded-full bg-cream text-ink">
        <CardIcon />
      </span>
      <h2 className={`mt-6 ${text.subheading}`}>{heading}</h2>
      <p className={`mt-2 flex-1 ${text.body}`}>{body}</p>
      <Button href={href} newTab={newTab} variant="dark" className="mt-6 w-full justify-center lg:w-auto lg:self-start">
        {action}
      </Button>
    </section>
  );
}

function UrgentHelp() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // The international number from the tel: link: the displayed one's "(0)" would misdial if pasted
  const copy = async () => {
    await navigator.clipboard.writeText(site.phoneLink.replace("tel:", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-alert/12 p-6 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-alert text-white">
        <Warning className="size-5" />
      </span>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-ink">Urgent enquiries</h2>
        <p className="mt-1 text-base leading-relaxed text-ink">A leak, a lockout, anything that can’t wait: give us a call or come and see us at the front desk.</p>
      </div>
      <Button variant="dark" onClick={() => setOpen(true)} className="w-full justify-center lg:w-auto">
        Call now
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Call us now">
        <p className={text.body}>Our front desk is open 24 hours a day, in the lobby at Old Oak.</p>
        <p className="mt-6 text-3xl font-bold leading-heading text-ink">{site.phone}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={site.phoneLink} variant="dark" className="justify-center">
            <Phone />
            Call now
          </Button>
          <Button variant="outline" onClick={copy} className="justify-center">
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy number"}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}

function TicketList({ tickets }: { tickets: Ticket[] }) {
  // Open tickets first, then the most recent activity
  const sorted = [...tickets].sort(
    (a, b) => Number(a.status === "closed") - Number(b.status === "closed") || b.messages.at(-1)!.at.localeCompare(a.messages.at(-1)!.at),
  );
  return (
    <AccountCard heading="Your tickets">
      {sorted.length === 0 ? (
        <p className={text.body}>Nothing yet. When you report an issue, you’ll find it here with our replies.</p>
      ) : (
        // Rows run edge to edge, to the bottom of the card
        <ul className="-mx-6 -mb-6 divide-y divide-ink/10 overflow-hidden rounded-b-2xl border-t border-ink/10 lg:-mx-8 lg:-mb-8">
          {sorted.map((t) => (
            <li key={t.id}>
              <Link href={`/account/support/${t.id}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-cream/40 lg:px-8">
                <span className={`size-2.5 shrink-0 rounded-full ${t.unread ? "bg-alert" : ""}`}>
                  {t.unread && <span className="sr-only">New reply</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">
                    {ticketCategories[t.category].label} <span className="font-normal text-stone">#{t.id}</span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-stone">
                    {dateFormat.format(new Date(t.messages[0].at))} · {t.messages.at(-1)!.body}
                  </p>
                </div>
                <TicketStatus status={t.status} />
                <ChevronRight className="text-stone" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AccountCard>
  );
}
