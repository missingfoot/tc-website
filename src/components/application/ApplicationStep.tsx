import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { Check } from "@/components/icons";

export type StepState = "done" | "active" | "upcoming";

type ApplicationStepProps = {
  number: number;
  total: number;
  title: string;
  state: StepState;
  /** The form (active) or the answers (done). Upcoming steps show only their header. */
  children?: ReactNode;
  /** Reopens a finished step. */
  onEdit?: () => void;
  editLabel?: string;
};

/**
 * One step of the application: a numbered header ("Step 2 of 4"), then its form while active or
 * a summary of the answers once done. A white card on desktop; flat on the white page on mobile.
 */
export default function ApplicationStep({ number, total, title, state, children, onEdit, editLabel = "Edit" }: ApplicationStepProps) {
  const headingId = `step-${number}`;
  return (
    <section aria-labelledby={headingId} className="lg:rounded-2xl lg:bg-white lg:p-8 lg:shadow-xl lg:shadow-black/5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
            state === "done" ? "bg-ink text-white" : "bg-cream text-ink"
          }`}
        >
          {state === "done" ? <Check className="size-5" /> : number}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={headingId} className="text-2xl font-bold leading-heading text-ink">
                {title}
              </h2>
              <p className="mt-1 text-base text-stone">
                Step {number} of {total}
                {state === "done" && <span className="sr-only"> (done)</span>}
              </p>
            </div>
            {state === "done" && onEdit && (
              <Button variant="outline" onClick={onEdit} className="hidden lg:inline-flex">
                {editLabel}
              </Button>
            )}
          </div>

          {state !== "upcoming" && children && <div className="mt-6">{children}</div>}

          {/* Mobile: full-width button under the answers (site rule) */}
          {state === "done" && onEdit && (
            <Button variant="outline" onClick={onEdit} className="mt-6 w-full justify-center lg:hidden">
              {editLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
