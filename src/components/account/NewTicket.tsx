"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { ChevronRight } from "@/components/icons";
import { ticketCategories } from "@/content/support";
import { createTicket, type TicketCategory } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import BackLink from "@/components/ui/BackLink";

/** Report an issue, step 1: which help desk queue it's for. */
export function CategoryPicker() {
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account/support">Back to support</BackLink>
      <AccountCard heading="Report an issue" intro="Choose a category to get started.">
        <ul className="grid gap-3 sm:grid-cols-3">
          {(Object.entries(ticketCategories) as [TicketCategory, (typeof ticketCategories)[TicketCategory]][]).map(([key, { label, icon: CategoryIcon, description }]) => (
            <li key={key}>
              <Link
                href={`/account/support/new/${key}`}
                className="flex h-full items-center gap-4 rounded-xl border border-ink/15 p-4 transition-colors hover:border-ink sm:flex-col sm:items-start sm:p-6"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cream text-ink">
                  <CategoryIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{label}</span>
                  <span className="mt-1 block text-sm text-stone">{description}</span>
                </span>
                <ChevronRight className="text-stone sm:hidden" />
              </Link>
            </li>
          ))}
        </ul>
      </AccountCard>
    </div>
  );
}

/**
 * Report an issue, step 2: the message. Leaving with something typed asks first, as it'd be lost.
 * Sending opens the ticket and shows its conversation.
 */
export function TicketForm({ category }: { category: TicketCategory }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [confirming, setConfirming] = useState(false);
  const { label, prompt } = ticketCategories[category];
  const dirty = body.trim() !== "";

  // Closing the tab or reloading: the browser's own "leave site?" warning
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dirty) return;
    const ticketId = createTicket(category, body);
    router.push(`/account/support/${ticketId}?sent=1`);
  };

  return (
    <div className="flex flex-col gap-6">
      <BackLink
        href="/account/support/new"
        onClick={(e) => {
          if (!dirty) return;
          e.preventDefault();
          setConfirming(true);
        }}
      >
        Choose another category
      </BackLink>

      <AccountCard heading={`Report an issue: ${label.toLowerCase()}`} intro={prompt}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label htmlFor="ticket-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="ticket-message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            placeholder="Type your message…"
            className="min-h-40 w-full resize-y rounded-xl border border-ink/15 bg-white p-4 text-base leading-relaxed text-ink placeholder:text-stone focus:border-ink focus:outline-none"
          />
          <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto lg:self-end">
            Send
          </Button>
        </form>
      </AccountCard>

      <Dialog open={confirming} onClose={() => setConfirming(false)} title="Discard your message?">
        <p className={text.body}>If you go back, your message will be lost.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="dark" onClick={() => router.push("/account/support/new")} className="justify-center">
            Yes, discard it
          </Button>
          <Button variant="outline" onClick={() => setConfirming(false)} className="justify-center">
            No, keep writing
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
