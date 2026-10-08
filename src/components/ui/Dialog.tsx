"use client";

import { useId, type ReactNode } from "react";
import { useModalDialog } from "@/hooks/useModalDialog";
import { Close } from "@/components/icons";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** A small white modal in a native <dialog> (Escape, the backdrop and the cross close it). */
export default function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useModalDialog(open);
  const titleId = useId();

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      tabIndex={-1}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-6 text-ink opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-smooth backdrop:bg-ink/60 focus:outline-none open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none lg:p-8"
    >
      <div className="flex items-start gap-4">
        <h2 id={titleId} className="flex-1 text-2xl font-bold leading-heading">
          {title}
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="-m-2 flex size-10 items-center justify-center text-stone hover:text-ink">
          <Close />
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
