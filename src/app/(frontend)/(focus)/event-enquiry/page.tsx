import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata = { title: "Make an enquiry" };

/** Event space enquiry. A venue's page links here with ?venue=slug to pre-select it. */
export default async function EventEnquiry({ searchParams }: PageProps<"/event-enquiry">) {
  const { venue } = await searchParams;
  return <EnquiryForm kind="events" venue={typeof venue === "string" ? venue : undefined} />;
}
