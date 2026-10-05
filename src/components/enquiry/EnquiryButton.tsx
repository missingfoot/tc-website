"use client";

import { useState, type ComponentProps } from "react";
import Button from "@/components/ui/Button";
import EnquiryModal, { type EnquiryKind } from "./EnquiryModal";

/** Every button for a form says the same thing. */
const labels: Record<EnquiryKind, string> = { living: "Apply now", working: "Get a free day trial" };

type EnquiryButtonProps = {
  kind: EnquiryKind;
  variant?: ComponentProps<typeof Button>["variant"];
  arrow?: boolean;
  className?: string;
};

/** A button that opens an enquiry form: "Apply now" (co-living) or "Get a free day trial" (working). */
export default function EnquiryButton({ kind, variant = "dark", arrow = true, className = "" }: EnquiryButtonProps) {
  const [open, setOpen] = useState(false);
  // A new key each time it opens gives a fresh form (closing keeps the last state so the fade-out doesn't flash)
  const [session, setSession] = useState(0);
  return (
    <>
      <Button
        variant={variant}
        arrow={arrow}
        onClick={() => {
          setSession((n) => n + 1);
          setOpen(true);
        }}
        className={className}
      >
        {labels[kind]}
      </Button>
      <EnquiryModal key={session} kind={kind} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
