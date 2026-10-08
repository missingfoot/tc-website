"use client";

import { useSyncExternalStore } from "react";

// The members' account (membership, renewal, referrals, details), as a DEMO that runs entirely in
// the browser (localStorage). Every function here is what a real backend would do, so wiring one
// up means replacing this file:
// - requestCode / verifyCode: email a one-time sign-in code and check it
// - the membership: read from the bookings system; requestRenewal sends a renewal request
// - inviteFriends / revokeInvite: store invites and email the friends
// - Direct Debit: start GoCardless's hosted setup (Billing Request Flow) and receive its webhook
// - requestEmailChange / confirmEmailChange: email a code to the new address and check it
// - saveDetails / saveComms: store them (comms preferences sync to the email tool, e.g. HubSpot)
// - support tickets: create and reply through the help desk (e.g. Zendesk), whose team replies come back by webhook
// Only members can sign in and refer; rewards come off their rent.
// TODO: replace with API calls once there's a backend.

export type ReferralStatus = "invited" | "toured" | "moved-in" | "paid";

export type Referral = {
  id: string;
  email: string;
  /** ISO date the invite was sent. */
  invitedAt: string;
  status: ReferralStatus;
  /** What the referrer earns once the friend has moved in (depends on their contract). */
  reward?: number;
};

/** What a member asked for when renewing. */
export type RenewalRequest = {
  months: number;
  monthlyPrice: number;
  /** The new term, as ISO dates. */
  start: string;
  end: string;
  reasons: string[];
  comments?: string;
  at: string;
};

/**
 * How rent is collected. Bank details are entered on GoCardless's own secure page and never
 * reach us; we only hear back the bank's name and the last digits of the account.
 */
export type DirectDebit = {
  status: "active" | "pending" | "failed";
  bank: string;
  accountEnding: string;
};

/** A resident's current booking. Dates are ISO strings. */
export type Membership = {
  roomType: string;
  /** Length of the current membership, in months. */
  months: number;
  photo: { src: string; alt: string };
  floor: string;
  roomNumber: string;
  building: string;
  checkIn: string;
  checkOut: string;
  /** Months of notice needed to leave (or renew) before checkout. */
  noticeMonths: number;
  postalAddress: string[];
  monthlyPrice: number;
  /** Missing until they've set one up. */
  directDebit?: DirectDebit;
  renewal: {
    /** Thank-you for renewing, e.g. "£100 gift voucher". */
    bonus: string;
    /** Set once they've asked to renew. */
    requested?: RenewalRequest;
    /** Set once they've told us they're leaving at the end of the membership. */
    movingOut?: { reasons: string[]; comments?: string; at: string };
  };
};

export type TicketCategory = "maintenance" | "housekeeping" | "general";

export type TicketMessage = {
  from: "member" | "team";
  body: string;
  /** ISO date and time. */
  at: string;
};

/** A support request and its conversation with the team. */
export type Ticket = {
  /** The reference shown to members, e.g. "474848645". */
  id: string;
  category: TicketCategory;
  status: "open" | "closed";
  messages: TicketMessage[];
  /** The team has replied since the member last looked. */
  unread: boolean;
};

/** Which optional emails a member gets (essential ones about their membership always go out). */
export type CommsPreferences = { blog: boolean; marketing: boolean; oneToOne: boolean };

/** What the member told us on their room application (answers as the form gives them, e.g. "Yes"). */
export type Profile = {
  /** ISO date. */
  dateOfBirth: string;
  gender: string;
  nationality: string;
  visa: string;
  student: string;
};

export type Account = {
  firstName: string;
  lastName: string;
  email: string;
  /** Missing means the default: everything on. */
  comms?: CommsPreferences;
  phone?: { dialCode: string; mobile: string };
  /** A new email waiting to be confirmed with the code sent to it. */
  emailChange?: { email: string; code: string };
  /** From their room application; missing if they didn't apply online. */
  profile?: Profile;
  /** Signing in is for members, so this is set; it's missing only if a membership has ended. */
  membership?: Membership;
  /** The renewal reminder banner was dismissed ("Not now"). */
  renewalReminderDismissed?: boolean;
  /** Short code in the referral link. */
  code: string;
  referrals: Referral[];
  /** Newest first. */
  tickets: Ticket[];
};

type State = {
  account: Account | null;
  /** A sign-in waiting for its code, and where to go afterwards. */
  pending: { email: string; name: string; code: string; next: string } | null;
};

// Bump the version when the saved shape changes, so old demo data is ignored rather than breaking pages
const KEY = "tc-account-demo-v4";
const empty: State = { account: null, pending: null };

let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved) state = JSON.parse(saved);
  } catch {
    state = empty;
  }
}

function save(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode / storage full: the demo still works for this visit
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The demo state, or null while rendering on the server (before the browser's storage is read). */
export function useAccount(): State | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => null,
  );
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/** "First Last", e.g. for a greeting or the support conversation. */
export const fullName = (account: Pick<Account, "firstName" | "lastName">) => [account.firstName, account.lastName].filter(Boolean).join(" ");

const randomCode = (length: number, chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)), (n) => chars[n % chars.length]).join("");
const id = () => randomCode(10);

/** Starts sign-in (or sign-up, with a name): "emails" a 6-digit code. Returns it, since the demo can't send email. */
export function requestCode(email: string, name = "", next = "/account"): string {
  load();
  const code = randomCode(6, "0123456789");
  save({ ...state, pending: { email: email.trim().toLowerCase(), name: name.trim(), code, next } });
  return code;
}

/** Checks the code; on success signs in (creating a demo account if it's new) and returns where to go next. */
export function verifyCode(code: string): string | null {
  load();
  const pending = state.pending;
  if (!pending || code !== pending.code) return null;
  const existing = state.account?.email === pending.email ? state.account : null;
  // The demo has no application to read the name from, so it's taken from the email if not given
  const [firstName, ...rest] = (pending.name || pending.email.split("@")[0].replace(/[._-]+/g, " ")).split(" ");
  const account: Account = existing ?? {
    firstName: capitalise(firstName),
    lastName: rest.map(capitalise).join(" "),
    email: pending.email,
    phone: { dialCode: "+44", mobile: "07700 900123" },
    profile: sampleProfile(),
    code: randomCode(8),
    membership: sampleMembership(),
    referrals: sampleReferrals(),
    tickets: sampleTickets(),
  };
  save({ account, pending: null });
  return pending.next;
}

/** Abandons a sign-in that's waiting for its code (e.g. "use a different email"). */
export function cancelSignIn() {
  save({ ...state, pending: null });
}

export function signOut() {
  save({ ...state, account: null, pending: null });
}

/** Adds invites for new emails (skips ones already invited). Returns how many were sent. */
export function inviteFriends(emails: string[]): number {
  const account = state.account;
  if (!account) return 0;
  const known = new Set(account.referrals.map((r) => r.email));
  const fresh = [...new Set(emails.map((e) => e.trim().toLowerCase()))].filter((e) => e && !known.has(e));
  const now = new Date().toISOString();
  save({ ...state, account: { ...account, referrals: [...fresh.map((email) => ({ id: id(), email, invitedAt: now, status: "invited" as const })), ...account.referrals] } });
  return fresh.length;
}

/** Withdraws an invite nobody has acted on yet. */
export function revokeInvite(referralId: string) {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, referrals: account.referrals.filter((r) => !(r.id === referralId && r.status === "invited")) } });
}

/** Starts changing the sign-in email: "emails" a code to the new address. Returns it, since the demo can't send email. */
export function requestEmailChange(email: string): string {
  const account = state.account;
  if (!account) return "";
  const code = randomCode(6, "0123456789");
  save({ ...state, account: { ...account, emailChange: { email: email.trim().toLowerCase(), code } } });
  return code;
}

/** Checks the code sent to the new email; on success it becomes their email (and sign-in). */
export function confirmEmailChange(code: string): boolean {
  const account = state.account;
  if (!account?.emailChange || code !== account.emailChange.code) return false;
  save({ ...state, account: { ...account, email: account.emailChange.email, emailChange: undefined } });
  return true;
}

export function cancelEmailChange() {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, emailChange: undefined } });
}

export function saveDetails(details: { firstName: string; lastName: string; dialCode: string; mobile: string; gender: string; student: string }) {
  const account = state.account;
  if (!account) return;
  const { firstName, lastName, dialCode, mobile, gender, student } = details;
  save({
    ...state,
    account: {
      ...account,
      firstName: firstName.trim() || account.firstName,
      lastName: lastName.trim() || account.lastName,
      phone: mobile.trim() ? { dialCode, mobile: mobile.trim() } : undefined,
      profile: account.profile && { ...account.profile, gender, student },
    },
  });
}

/**
 * Demo of finishing GoCardless's setup: in reality GoCardless's page takes the bank details and
 * tells our backend (by webhook) once the new Direct Debit exists, replacing any old one. A new
 * Direct Debit is "pending" until the bank confirms it, usually within a few working days.
 */
export function completeDirectDebitSetup(details: { bank: string; accountEnding: string }) {
  const account = state.account;
  if (!account?.membership) return;
  save({ ...state, account: { ...account, membership: { ...account.membership, directDebit: { status: "pending", ...details } } } });
}

export function saveComms(comms: CommsPreferences) {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, comms } });
}

/** Asks to renew the membership for another term. */
export function requestRenewal(request: Omit<RenewalRequest, "at">) {
  const account = state.account;
  if (!account?.membership) return;
  const { membership } = account;
  save({
    ...state,
    account: { ...account, membership: { ...membership, renewal: { ...membership.renewal, requested: { ...request, at: new Date().toISOString() } } } },
  });
}

/**
 * The renewal options: shorter terms cost a little more each month. TODO: real renewal prices
 * (from the pricing system), which the design shows lower than the current fee.
 */
export function renewalOptions(m: Membership) {
  const uplift: Record<number, number> = { 12: 1, 9: 1.04, 6: 1.08, 3: 1.12 };
  const start = new Date(m.checkOut);
  start.setDate(start.getDate() + 1);
  return [12, 9, 6, 3].map((months) => {
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    end.setDate(end.getDate() - 1);
    return { months, monthlyPrice: Math.round(m.monthlyPrice * uplift[months]), start, end };
  });
}

/** Tells us they're not renewing and will move out when the membership ends. */
export function confirmMoveOut(details: { reasons: string[]; comments?: string }) {
  const account = state.account;
  if (!account?.membership) return;
  const { membership } = account;
  save({
    ...state,
    account: { ...account, membership: { ...membership, renewal: { ...membership.renewal, movingOut: { ...details, at: new Date().toISOString() } } } },
  });
}

const updateTicket = (ticketId: string, change: (t: Ticket) => Ticket) => {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, tickets: account.tickets.map((t) => (t.id === ticketId ? change(t) : t)) } });
};

/** Opens a ticket and returns its reference. The demo has the team acknowledge it a few seconds later. */
export function createTicket(category: TicketCategory, body: string): string {
  const account = state.account;
  if (!account) return "";
  const ticket: Ticket = {
    id: randomCode(9, "0123456789").replace(/^0/, "4"),
    category,
    status: "open",
    messages: [{ from: "member", body: body.trim(), at: new Date().toISOString() }],
    unread: false,
  };
  save({ ...state, account: { ...account, tickets: [ticket, ...account.tickets] } });
  setTimeout(
    () =>
      updateTicket(ticket.id, (t) => ({
        ...t,
        unread: true,
        messages: [
          ...t.messages,
          {
            from: "team",
            body: `Thanks ${account.firstName}, we’ve got your message. Someone from the team will pick it up shortly and reply here. If it’s urgent, give us a call or come and see us at the front desk.`,
            at: new Date().toISOString(),
          },
        ],
      })),
    4000,
  );
  return ticket.id;
}

/** Adds the member's reply; replying to a closed ticket reopens it. */
export function replyToTicket(ticketId: string, body: string) {
  updateTicket(ticketId, (t) => ({ ...t, status: "open", messages: [...t.messages, { from: "member", body: body.trim(), at: new Date().toISOString() }] }));
}

export function markTicketRead(ticketId: string) {
  if (state.account?.tickets.find((t) => t.id === ticketId)?.unread) updateTicket(ticketId, (t) => ({ ...t, unread: false }));
}

/** The member says it's sorted. */
export function closeTicket(ticketId: string) {
  updateTicket(ticketId, (t) => ({ ...t, status: "closed" }));
}

export function dismissRenewalReminder() {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, renewalReminderDismissed: true } });
}

const DAY = 86_400_000;

function sampleMembership(): Membership {
  // A studio ending in about three months: its renew-by date is a few weeks away, so the reminder shows
  const checkIn = new Date(Date.now() - 270 * DAY);
  const checkOut = new Date(Date.now() + 85 * DAY);
  return {
    roomType: "Studio",
    months: 12,
    photo: { src: "/images/old-oak/rooms/studio.jpg", alt: "A studio at Old Oak" },
    floor: "3",
    roomNumber: "507",
    building: "The Collective Old Oak",
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
    noticeMonths: 2,
    postalAddress: ["Room 507", "The Collective Old Oak", "Old Oak Lane", "London", "NW10 6FF"],
    monthlyPrice: 1257,
    directDebit: { status: "active", bank: "Barclays", accountEnding: "1234" },
    renewal: { bonus: "£100 gift voucher" },
  };
}

/** Key dates for renewing: notice starts `noticeMonths` before checkout, which is also the renew-by date. */
export function renewalDates(m: Membership) {
  // Check-out is at 10:00 on the day; renewing is open until the end of the renew-by day
  const checkOut = new Date(m.checkOut);
  checkOut.setHours(10, 0, 0, 0);
  const renewBy = new Date(checkOut);
  renewBy.setMonth(renewBy.getMonth() - m.noticeMonths);
  renewBy.setHours(23, 59, 59, 999);
  const daysLeft = Math.ceil((renewBy.getTime() - Date.now()) / DAY);
  // The reminder shows from a month before the renew-by date
  const decided = Boolean(m.renewal.requested || m.renewal.movingOut);
  const due = !decided && checkOut.getTime() > Date.now() && daysLeft <= 30;
  return { checkOut, renewBy, daysLeft, due, decided };
}

/** Example referrals every demo account starts with, so each stage can be seen. */
function sampleReferrals(): Referral[] {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
  return [
    { id: "sample-1", email: "alex.morgan@example.com", invitedAt: daysAgo(64), status: "paid", reward: 200 },
    { id: "sample-2", email: "sam.okafor@example.com", invitedAt: daysAgo(41), status: "moved-in", reward: 150 },
    { id: "sample-3", email: "priya.shah@example.com", invitedAt: daysAgo(12), status: "toured" },
    { id: "sample-4", email: "jo.kim@example.com", invitedAt: daysAgo(3), status: "invited" },
  ];
}

/** Example application answers for demo accounts. */
function sampleProfile(): Profile {
  return { dateOfBirth: "1994-04-12", gender: "Male", nationality: "British", visa: "No", student: "No" };
}

/** Example tickets every demo account starts with: one with an unread reply, one open, one closed. */
function sampleTickets(): Ticket[] {
  const at = (days: number, hours: number) => new Date(Date.now() - days * DAY - hours * 3_600_000).toISOString();
  return [
    {
      id: "474848645",
      category: "maintenance",
      status: "open",
      unread: true,
      messages: [
        { from: "member", body: "The shower in my bathroom has been draining really slowly for a few days, and this morning the tray nearly overflowed.", at: at(2, 5) },
        {
          from: "team",
          body: "Sorry about that! We’ve booked our maintenance team in for tomorrow between 10:00 and 12:00. If you’re out they’ll let themselves in and leave a card to say they’ve been. Is that OK?",
          at: at(1, 22),
        },
      ],
    },
    {
      id: "474848213",
      category: "general",
      status: "open",
      unread: false,
      messages: [{ from: "member", body: "Could a friend stay with me for a weekend later this month? What do I need to do to sign them in?", at: at(4, 3) }],
    },
    {
      id: "474847990",
      category: "housekeeping",
      status: "closed",
      unread: false,
      messages: [
        { from: "member", body: "My room was missed on last week’s cleaning round. Could someone come by?", at: at(26, 6) },
        { from: "team", body: "Apologies, that shouldn’t have happened. Housekeeping will be with you tomorrow morning, and we’ve put you back on the rota.", at: at(26, 2) },
        { from: "member", body: "All done, thank you!", at: at(25, 1) },
      ],
    },
  ];
}

/** Totals for the dashboard. */
export function referralTotals(referrals: Referral[]) {
  const sum = (status: ReferralStatus) => referrals.filter((r) => r.status === status).reduce((n, r) => n + (r.reward ?? 0), 0);
  return { earned: sum("paid"), pending: sum("moved-in"), invited: referrals.length };
}
