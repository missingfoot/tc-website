import MembershipPanel from "@/components/account/MembershipPanel";

export const metadata = { title: "Membership · Your account" };

/** ?directDebit=updated (after the Direct Debit setup) shows a confirmation in Billing. */
export default async function MembershipPage({ searchParams }: PageProps<"/account">) {
  const { directDebit } = await searchParams;
  return <MembershipPanel directDebitUpdated={directDebit === "updated"} />;
}
