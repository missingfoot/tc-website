import type { ReactNode } from "react";
import { Check } from "@/components/icons";
import { text } from "@/lib/styles";

/**
 * A white card confirming something's done: a green tick, a heading and a line or two, centred on
 * desktop.
 */
export default function SuccessCard({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col items-start rounded-2xl bg-white p-6 lg:items-center lg:p-10 lg:text-center">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
        <Check strokeWidth={3} />
      </span>
      <h2 className={`mt-4 ${text.subheading}`}>{heading}</h2>
      <p className={`mt-2 max-w-xl ${text.body}`}>{children}</p>
    </section>
  );
}
