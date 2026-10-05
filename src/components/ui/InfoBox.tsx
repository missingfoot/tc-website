import type { ReactNode } from "react";
import { Info } from "@/components/icons";

type InfoBoxProps = {
  children: ReactNode;
  /** "info" (cream, the default) or "success" (soft green, for good news like a referral). */
  tone?: "info" | "success";
  className?: string;
};

const tones = { info: "bg-cream", success: "bg-sage/15" };

/** A soft note with an "i" icon: things worth knowing before you act, e.g. what confirming a form means. */
export default function InfoBox({ children, tone = "info", className = "" }: InfoBoxProps) {
  return (
    <div className={`flex gap-3 rounded-xl p-4 text-base leading-relaxed text-ink ${tones[tone]} ${className}`}>
      <Info className="mt-1 text-stone" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
