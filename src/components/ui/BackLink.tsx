import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { ArrowLeft } from "@/components/icons";

/** A link back up a level, above a sub-page's content (e.g. "Back to support"). */
export default function BackLink({ href, onClick, children }: { href: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; children: ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="inline-flex items-center gap-2 self-start text-base font-medium text-ink hover:opacity-70">
      <ArrowLeft />
      {children}
    </Link>
  );
}
