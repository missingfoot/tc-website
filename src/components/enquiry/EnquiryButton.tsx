import type { ComponentProps } from "react";
import Button from "@/components/ui/Button";
import type { EnquiryKind } from "@/lib/types";

/** Every button for a form says the same thing, and goes to the same page. */
const labels: Record<EnquiryKind, string> = { living: "Apply now", working: "Get a free day trial", serviced: "Book a viewing", events: "Make an enquiry", waitlist: "Join the waitlist" };
export const enquiryPages: Record<EnquiryKind, string> = { living: "/apply", working: "/free-trial", serviced: "/book-a-viewing", events: "/event-enquiry", waitlist: "/waitlist" };

type EnquiryButtonProps = {
  kind: EnquiryKind;
  variant?: ComponentProps<typeof Button>["variant"];
  arrow?: boolean;
  /** Pre-selects this venue on the event enquiry form. */
  venue?: string;
  /** In place of the form's usual label. */
  label?: string;
  className?: string;
};

/** A link to an enquiry page: "Apply now" (co-living), "Get a free day trial" (working), "Book a viewing" (serviced living) or "Make an enquiry" (event spaces). */
export default function EnquiryButton({ kind, variant = "dark", arrow = true, venue, label, className = "" }: EnquiryButtonProps) {
  return (
    <Button href={venue ? `${enquiryPages[kind]}?venue=${venue}` : enquiryPages[kind]} variant={variant} arrow={arrow} className={className}>
      {label || labels[kind]}
    </Button>
  );
}
