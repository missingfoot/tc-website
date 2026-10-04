import type { ReactNode } from "react";

/** A small cream label, e.g. a price. Not interactive (use Button for links). */
export default function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full bg-cream px-4 py-1.5 text-base font-medium text-ink ${className}`}>{children}</span>;
}
