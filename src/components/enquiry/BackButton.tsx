"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "@/components/icons";
import { hasSiteHistory } from "@/components/layout/NavigationTracker";

type BackButtonProps = {
  /** Where to go when there's no page of ours to go back to (e.g. opened from a shared link). */
  fallback: string;
  label?: string;
  /** Leading arrow (default on). */
  icon?: boolean;
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

/** Goes back to the previous page on this site, or to `fallback`. */
export default function BackButton({ fallback, label = "Back", icon = true, variant = "outline", className = "" }: BackButtonProps) {
  const router = useRouter();
  const back = () => {
    // From another of our pages (in-app, or a full page load from our site): go back to it
    const cameFromHere = hasSiteHistory() || document.referrer.startsWith(window.location.origin);
    if (cameFromHere && window.history.length > 1) router.back();
    else router.push(fallback);
  };
  return (
    <Button variant={variant} onClick={back} className={className}>
      {icon && <ArrowLeft className="size-4" />}
      {label}
    </Button>
  );
}
