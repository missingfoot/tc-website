import EnquiryForm from "@/components/enquiry/EnquiryForm";
import { getLocations } from "@/lib/payload";

export const metadata = { title: "Make an enquiry" };

/** Event space enquiry, listing the venues in the CMS. A venue's page links here with ?venue=slug to pre-select it. */
export default async function EventEnquiry({ searchParams }: PageProps<"/event-enquiry">) {
  const { venue } = await searchParams;
  const venueOptions = (await getLocations("venue")).map((v) => ({ value: v.slug, label: `${v.name} (${v.area})` }));
  return <EnquiryForm kind="events" venueOptions={venueOptions} venue={typeof venue === "string" ? venue : undefined} />;
}
