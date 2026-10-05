import type { ReactNode } from "react";
import { text } from "@/lib/styles";

type AccountCardProps = {
  heading: string;
  /** Anchor, e.g. so a link can return to this card. */
  id?: string;
  intro?: ReactNode;
  children: ReactNode;
};

/** A white card with a heading: each part of an account tab. */
export default function AccountCard({ heading, intro, id, children }: AccountCardProps) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl bg-white p-6 lg:p-8">
      <h2 className={text.subheading}>{heading}</h2>
      {intro && <div className={`mt-2 ${text.body}`}>{intro}</div>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
