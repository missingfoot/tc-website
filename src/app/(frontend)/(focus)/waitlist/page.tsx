import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata = { title: "Join the waitlist" };

/** Waitlist for buildings that aren't open yet. Links pass ?location=slug to pre-select one. */
export default async function Waitlist({ searchParams }: PageProps<"/waitlist">) {
  const { location } = await searchParams;
  return <EnquiryForm kind="waitlist" location={typeof location === "string" ? location : undefined} />;
}
