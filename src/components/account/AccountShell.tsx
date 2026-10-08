"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { dismissRenewalReminder, renewalDates, useAccount } from "@/lib/account";
import { text } from "@/lib/styles";

const tabs = [
  { href: "/account", label: "Membership" },
  { href: "/account/renewal", label: "Renewal" },
  { href: "/account/referrals", label: "Referrals" },
  { href: "/account/support", label: "Support" },
  { href: "/account/details", label: "Your details" },
  { href: "/account/communication", label: "Communication" },
];

/**
 * The signed-in account area: a greeting, tabs (a sidebar on desktop, wrapping pills on
 * mobile), a renewal reminder when one's due, and the tab's content. Signed-out visitors are sent
 * to sign in, then brought back here.
 */
export default function AccountShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const state = useAccount();
  const account = state?.account;

  useEffect(() => {
    if (state && !state.account) router.replace(`/account/sign-in?next=${encodeURIComponent(pathname)}`);
  }, [state, pathname, router]);

  // Before the browser's storage is read, or while redirecting
  if (!account) return <div className="min-h-[60vh]" />;

  const renewal = account.membership && renewalDates(account.membership);
  const unreadTickets = account.tickets.some((t) => t.unread);
  const showReminder = renewal?.due && !account.renewalReminderDismissed && !pathname.startsWith("/account/renewal");

  return (
    // grid-cols-1 (minmax(0, 1fr)) and min-w-0: the scrolling tab bar mustn't widen the page on mobile
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      {/* Desktop: the sidebar stays in view (below the header) while the tab's content scrolls */}
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <h1 className="text-3xl font-bold leading-heading text-ink">Hi {account.firstName}</h1>
        <p className={`mt-1 truncate ${text.label}`}>{account.email}</p>

        {/* Mobile: pills that wrap onto a second line rather than run off the screen. Desktop: a sidebar. */}
        <nav aria-label="Account" className="mt-6 lg:mt-10">
          {/* Desktop: pulled out by the links' padding, so their text lines up with the greeting and the highlight extends past it */}
          <ul className="flex flex-wrap gap-2 lg:-mx-4 lg:flex-col lg:flex-nowrap lg:gap-1">
            {tabs.map((tab) => {
              // A tab stays selected on its sub-pages (e.g. Renewal → Moving out)
              // The Direct Debit page belongs to Membership
              const current =
                pathname === tab.href || (tab.href !== "/account" && pathname.startsWith(`${tab.href}/`)) || (tab.href === "/account" && pathname === "/account/direct-debit");
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium whitespace-nowrap transition-colors lg:rounded-xl lg:px-4 ${
                      current ? "bg-ink text-white" : "bg-white text-ink hover:bg-cream-dark lg:bg-transparent"
                    }`}
                  >
                    {tab.label}
                    {tab.href === "/account/support" && unreadTickets && (
                      <span className="size-2 rounded-full bg-alert">
                        <span className="sr-only">(new reply)</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>

      <div className="flex min-w-0 flex-col gap-6">
        {showReminder && renewal && (
          <div className="flex flex-col gap-4 rounded-2xl bg-ink p-6 text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xl font-bold">Your membership renewal is due</p>
              <p className="mt-1 text-white/80">
                Renew by {renewal.renewBy.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} to keep your room.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/account/renewal" variant="light" arrow className="justify-center">
                Next steps
              </Button>
              <Button variant="glass" onClick={dismissRenewalReminder} className="justify-center">
                Not now
              </Button>
            </div>
          </div>
        )}

        {children}

      </div>
    </div>
  );
}
