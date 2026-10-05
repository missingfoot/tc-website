"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

type CodeInputProps = {
  /** Called with the full code once every box is filled. */
  onComplete: (code: string) => void;
  length?: number;
  /** Shows the boxes in an error state (e.g. a wrong code). */
  invalid?: boolean;
  label?: string;
};

/**
 * A one-time code as separate digit boxes: digits only, the cursor moves on as you type,
 * Backspace goes back, and pasting (or the phone's SMS/email autofill) fills them all.
 */
export default function CodeInput({ onComplete, length = 6, invalid = false, label = "Sign-in code" }: CodeInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const fill = (next: string[], focus: number) => {
    setDigits(next);
    refs.current[Math.min(focus, length - 1)]?.focus();
    if (next.every(Boolean)) onComplete(next.join(""));
  };

  const type = (i: number, value: string) => {
    const typed = value.replace(/\D/g, "");
    if (!typed) return;
    // Several digits at once (autofill) spread across the boxes
    const next = [...digits];
    typed.split("").forEach((d, k) => {
      if (i + k < length) next[i + k] = d;
    });
    fill(next, i + typed.length);
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) next[i] = "";
      else if (i > 0) {
        next[i - 1] = "";
        refs.current[i - 1]?.focus();
      }
      setDigits(next);
    }
    if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    fill(Array.from({ length }, (_, k) => pasted[k] ?? ""), pasted.length);
  };

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            value={digit}
            onChange={(e) => type(i, e.target.value)}
            onKeyDown={onKeyDown(i)}
            onPaste={onPaste}
            onFocus={(e) => e.currentTarget.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            autoFocus={i === 0}
            className={`h-14 w-12 rounded-xl border bg-white text-center text-2xl font-bold tabular-nums text-ink focus:outline-none ${
              invalid ? "border-red-600" : "border-ink/15 focus:border-ink"
            }`}
          />
        ))}
      </div>
    </fieldset>
  );
}
