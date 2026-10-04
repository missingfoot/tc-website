import { ArrowLeft, ArrowRight } from "@/components/icons";
import { pressable } from "@/lib/styles";

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  /** Accessible name, e.g. "Previous image". */
  label: string;
  className?: string;
};

/** Round dark previous/next button used by carousels. */
export default function ArrowButton({ direction, onClick, label, className = "" }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white hover:bg-ink/85 ${pressable} ${className}`}
    >
      {direction === "left" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
    </button>
  );
}
