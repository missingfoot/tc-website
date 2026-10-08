import AgreementDocument from "@/components/account/AgreementDocument";

export const metadata = { title: "Membership agreement · Your account" };

/** `id` is "current" or "renewal". */
export default async function AgreementDocumentPage({ params }: PageProps<"/account/documents/agreements/[id]">) {
  const { id } = await params;
  return <AgreementDocument id={id} />;
}
