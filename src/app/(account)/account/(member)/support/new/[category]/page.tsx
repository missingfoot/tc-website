import { notFound } from "next/navigation";
import { TicketForm } from "@/components/account/NewTicket";
import { ticketCategories } from "@/content/support";
import type { TicketCategory } from "@/lib/account";

export const metadata = { title: "Report an issue · Your account" };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ticketCategories).map((category) => ({ category }));
}

export default async function NewTicketCategoryPage({ params }: PageProps<"/account/support/new/[category]">) {
  const { category } = await params;
  if (!(category in ticketCategories)) notFound();
  return <TicketForm category={category as TicketCategory} />;
}
