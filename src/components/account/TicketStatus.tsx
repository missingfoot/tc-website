import type { Ticket } from "@/lib/account";

/** A ticket's status as a small pill: green while open, grey once closed. */
export default function TicketStatus({ status }: { status: Ticket["status"] }) {
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${status === "open" ? "bg-sage/20 text-ink" : "bg-cream text-stone"}`}>
      {status === "open" ? "Open" : "Closed"}
    </span>
  );
}
