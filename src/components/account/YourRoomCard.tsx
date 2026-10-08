import Link from "next/link";
import type { ComponentType } from "react";
import { ChevronRight, Renew, TapeMeasure } from "@/components/icons";
import type { Account } from "@/lib/account";
import AccountCard from "./AccountCard";

/** Links to the room's condition report and asking to change room. */
export default function YourRoomCard({ account }: { account: Account }) {
  const rows: { href: string; title: string; note: string; icon: ComponentType<{ className?: string }> }[] = [
    {
      href: "/account/condition-report",
      title: "Move-in condition report",
      note: account.conditionNotes?.length ? `You’ve reported ${account.conditionNotes.length} ${account.conditionNotes.length === 1 ? "problem" : "problems"}` : "How your room was when you moved in",
      icon: TapeMeasure,
    },
    {
      href: "/account/room-change",
      title: "Change room",
      note: account.roomChange ? "Request sent, we’re looking for a room" : "Ask for a bigger room, another floor or another building",
      icon: Renew,
    },
  ];
  return (
    <AccountCard heading="Your room">
      <ul className="-my-3 divide-y divide-ink/10">
        {rows.map((row) => (
          <li key={row.href}>
            <Link href={row.href} className="group flex items-center gap-4 py-4">
              <row.icon className="size-6 text-stone" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">{row.title}</span>
                <span className="block text-sm text-stone">{row.note}</span>
              </span>
              <ChevronRight className="text-stone transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </AccountCard>
  );
}
