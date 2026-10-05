"use client";

import { useSyncExternalStore } from "react";

// The members' account (membership, renewal, referrals, details), as a DEMO that runs entirely in
// the browser (localStorage). Every function here is what a real backend would do, so wiring one
// up means replacing this file:
// - requestCode / verifyCode: email a one-time sign-in code and check it
// - the membership: read from the bookings system; requestRenewal sends a renewal request
// - inviteFriends / revokeInvite: store invites and email the friends
// - Direct Debit: start GoCardless's hosted setup (Billing Request Flow) and receive its webhook
// - saveDetails / saveComms: store them (comms preferences sync to the email tool, e.g. HubSpot)
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

/** Which optional emails a member gets (essential ones about their membership always go out). */
export type CommsPreferences = { blog: boolean; marketing: boolean; oneToOne: boolean };

export type Account = {
  name: string;
  email: string;
  /** Missing means the default: everything on. */
  comms?: CommsPreferences;
  phone?: string;
  /** Signing in is for members, so this is set; it's missing only if a membership has ended. */
  membership?: Membership;
  /** The renewal reminder banner was dismissed ("Not now"). */
  renewalReminderDismissed?: boolean;
  /** Short code in the referral link. */
  code: string;
  referrals: Referral[];
};

type State = {
  account: Account | null;
  /** A sign-in waiting for its code, and where to go afterwards. */
  pending: { email: string; name: string; code: string; next: string } | null;
};

// Bump the version when the saved shape changes, so old demo data is ignored rather than breaking pages
const KEY = "tc-account-demo-v2";
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
  const account: Account = existing ?? {
    name: pending.name || pending.email.split("@")[0],
    email: pending.email,
    code: randomCode(8),
    membership: sampleMembership(),
    referrals: sampleReferrals(),
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

export function saveDetails(details: { name: string; phone: string }) {
  const account = state.account;
  if (!account) return;
  save({ ...state, account: { ...account, name: details.name.trim() || account.name, phone: details.phone.trim() || undefined } });
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

/** Totals for the dashboard. */
export function referralTotals(referrals: Referral[]) {
  const sum = (status: ReferralStatus) => referrals.filter((r) => r.status === status).reduce((n, r) => n + (r.reward ?? 0), 0);
  return { earned: sum("paid"), pending: sum("moved-in"), invited: referrals.length };
}
