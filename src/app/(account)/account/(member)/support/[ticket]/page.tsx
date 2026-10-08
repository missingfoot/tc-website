import TicketThread from "@/components/account/TicketThread";

export const metadata = { title: "Your ticket · Your account" };

/** ?sent=1 (straight after reporting an issue) thanks them and gives the reference. */
export default async function TicketPage({ params, searchParams }: PageProps<"/account/support/[ticket]">) {
  const [{ ticket }, { sent }] = await Promise.all([params, searchParams]);
  return <TicketThread ticketId={ticket} sent={sent === "1"} />;
}
