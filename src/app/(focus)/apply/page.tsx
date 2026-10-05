import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata = { title: "Apply now" };

/** Co-living enquiry: arrange a tour or apply for a room. */
export default function Apply() {
  return <EnquiryForm kind="living" />;
}
