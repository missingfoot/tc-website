"use client";

import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import { LogoMark } from "@/components/layout/Logo";
import { ticketCategories } from "@/content/support";
import { closeTicket, fullName, markTicketRead, replyToTicket, useAccount, type TicketMessage } from "@/lib/account";
import { text } from "@/lib/styles";
import BackLink from "@/components/ui/BackLink";
import TicketStatus from "./TicketStatus";

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
const when = (iso: string) => `${dayFormat.format(new Date(iso))} at ${timeFormat.format(new Date(iso))}`;

/** One support ticket: the conversation with the team, a reply box, and a way to mark it sorted. `sent` thanks them for a new one. */
export default function TicketThread({ ticketId, sent }: { ticketId: string; sent: boolean }) {
  const account = useAccount()?.account;
  const ticket = account?.tickets.find((t) => t.id === ticketId);
  const [reply, setReply] = useState("");

  // Seeing the conversation reads any new reply, including one that arrives while it's open
  useEffect(() => {
    if (ticket?.unread) markTicketRead(ticket.id);
  }, [ticket?.id, ticket?.unread]);

  if (!account) return null;
  if (!ticket) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink href="/account/support">Back to support</BackLink>
        <section className="rounded-2xl bg-white p-6 lg:p-8">
          <h1 className={text.subheading}>We couldn’t find that ticket</h1>
          <p className={`mt-2 ${text.body}`}>It may belong to another account. Your tickets are listed in Support.</p>
        </section>
      </div>
    );
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reply.trim()) return;
    replyToTicket(ticket.id, reply);
    setReply("");
  };

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/support">Back to support</BackLink>

      {sent && (
        <InfoBox tone="success">
          Thanks, we’ve got your message. Your reference is #{ticket.id}, and our replies will show up here.
        </InfoBox>
      )}

      <section className="rounded-2xl bg-white p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className={text.subheading}>{ticketCategories[ticket.category].label}</h1>
          <TicketStatus status={ticket.status} />
        </div>
        <p className={`mt-1 ${text.label}`}>#{ticket.id}</p>

        <ol className="mt-8 flex flex-col gap-8">
          {ticket.messages.map((m, i) => (
            <Message key={i} message={m} memberName={fullName(account)} />
          ))}
        </ol>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
          {ticket.status === "closed" && <InfoBox>This ticket is closed. Send a reply if you need to reopen it.</InfoBox>}
          <label htmlFor="ticket-reply" className="sr-only">
            Your reply
          </label>
          <textarea
            id="ticket-reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required
            rows={4}
            placeholder="Type your message…"
            className="min-h-32 w-full resize-y rounded-xl border border-ink/15 bg-white p-4 text-base leading-relaxed text-ink placeholder:text-stone focus:border-ink focus:outline-none"
          />
          <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-center">
            <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
              Send
            </Button>
            {ticket.status === "open" && (
              <Button variant="outline" onClick={() => closeTicket(ticket.id)} className="w-full justify-center lg:w-auto">
                It’s sorted, close ticket
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function Message({ message, memberName }: { message: TicketMessage; memberName: string }) {
  const fromTeam = message.from === "team";
  return (
    <li className="flex gap-4">
      {fromTeam ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
          <LogoMark variant="icon" className="h-5" />
        </span>
      ) : (
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream font-bold text-ink">
          {memberName.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{fromTeam ? "The Collective support team" : memberName}</p>
        <p className="text-sm text-stone">{when(message.at)}</p>
        <p className={`mt-3 whitespace-pre-line ${text.body}`}>{message.body}</p>
      </div>
    </li>
  );
}
