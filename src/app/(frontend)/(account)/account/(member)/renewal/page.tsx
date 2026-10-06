import RenewalPanel from "@/components/account/RenewalPanel";

export const metadata = { title: "Renewal · Your account" };

/** ?choice=renew or ?choice=leave opens that path straight away. */
export default async function RenewalPage({ searchParams }: PageProps<"/account/renewal">) {
  const { choice } = await searchParams;
  return <RenewalPanel initialChoice={choice === "renew" || choice === "leave" ? choice : undefined} />;
}
