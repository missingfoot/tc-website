import type { ComponentProps } from "react";
import Button from "@/components/ui/Button";
import type { EnquiryKind } from "@/lib/types";

/** Every button for a form says the same thing, and goes to the same page. */
const labels: Record<EnquiryKind, string> = { living: "Apply now", working: "Get a free day trial" };
export const enquiryPages: Record<EnquiryKind, string> = { living: "/apply", working: "/free-trial" };

type EnquiryButtonProps = {
  kind: EnquiryKind;
  variant?: ComponentProps<typeof Button>["variant"];
  arrow?: boolean;
  className?: string;
};

/** A link to an enquiry page: "Apply now" (co-living) or "Get a free day trial" (working). */
export default function EnquiryButton({ kind, variant = "dark", arrow = true, className = "" }: EnquiryButtonProps) {
  return (
    <Button href={enquiryPages[kind]} variant={variant} arrow={arrow} className={className}>
      {labels[kind]}
    </Button>
  );
}
