import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "@/components/icons";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  /** The label beside the box (can include links). */
  children: ReactNode;
};

/** A labelled checkbox in the site's style: a rounded box that fills ink with a white tick. */
export default function Checkbox({ children, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-base text-ink ${className}`}>
      <input type="checkbox" {...props} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-ink/30 bg-white text-white transition peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
      >
        <Check className="size-3" strokeWidth={2.5} />
      </span>
      <span>{children}</span>
    </label>
  );
}
