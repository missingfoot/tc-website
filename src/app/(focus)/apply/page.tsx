import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata = { title: "Apply now" };

/** Co-living enquiry: arrange a tour or apply for a room. A friend's referral link adds ?ref=CODE. */
export default async function Apply({ searchParams }: PageProps<"/apply">) {
  const { ref } = await searchParams;
  return <EnquiryForm kind="living" referral={typeof ref === "string" && /^[A-Z0-9]{4,12}$/i.test(ref) ? ref : undefined} />;
}
