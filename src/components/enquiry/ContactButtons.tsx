import EnquiryButton from "@/components/enquiry/EnquiryButton";
import Button from "@/components/ui/Button";
import { site } from "@/config/site";

/** Call, email or apply: full width and stacked on mobile, side by side on desktop. */
export default function ContactButtons() {
  return (
    <div className="flex w-full flex-col gap-3 *:justify-center lg:w-auto lg:flex-row">
      <Button href={site.phoneLink} variant="outline">
        Call us
      </Button>
      <Button href={`mailto:${site.email}`} variant="outline">
        Email us
      </Button>
      <EnquiryButton kind="living" />
    </div>
  );
}
