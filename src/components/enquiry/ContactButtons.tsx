import EnquiryButton from "@/components/enquiry/EnquiryButton";
import Button from "@/components/ui/Button";
import { getContact } from "@/lib/payload";

/**
 * Call, email or apply: full width and stacked on mobile, side by side on desktop. The number and
 * email are the CMS's Contact details.
 */
export default async function ContactButtons() {
  const contact = await getContact();
  return (
    <div className="flex w-full flex-col gap-3 *:justify-center lg:w-auto lg:flex-row">
      <Button href={contact.phoneLink} variant="outline">
        Call us
      </Button>
      <Button href={`mailto:${contact.email}`} variant="outline">
        Email us
      </Button>
      <EnquiryButton kind="living" />
    </div>
  );
}
