import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata = { title: "Book a viewing" };

/** Serviced living enquiry: book a viewing. */
export default function BookAViewing() {
  return <EnquiryForm kind="serviced" />;
}
