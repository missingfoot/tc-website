"use client";

import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { text } from "@/lib/styles";

type Parts = { day: string; month: string; year: string };

const boxes = [
  { name: "day", label: "Day", placeholder: "DD", length: 2, width: "w-14" },
  { name: "month", label: "Month", placeholder: "MM", length: 2, width: "w-14" },
  { name: "year", label: "Year", placeholder: "YYYY", length: 4, width: "w-20" },
] as const;

const MIN_AGE = 18;

/** Why a filled-in date isn't acceptable, or "" if it's fine. */
function dateProblem({ day, month, year }: Parts) {
  if (!day || !month || year.length < 4) return "";
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return "That date doesn’t exist.";
  const eighteenth = new Date(y + MIN_AGE, m - 1, d);
  if (eighteenth > new Date()) return `You need to be ${MIN_AGE} or over to apply.`;
  if (y < new Date().getFullYear() - 120) return "Please check the year.";
  return "";
}

/**
 * Date of birth as three boxes that behave like a one-time-code input: digits only, the cursor
 * jumps to the next box once one is full, Backspace in an empty box goes back, and pasting a
 * whole date ("04/12/1989") fills all three. The browser's own validation reports a date that
 * doesn't exist or makes the applicant under 18.
 */
export default function DateOfBirth({ defaultValue }: { defaultValue?: Parts }) {
  const inputs = (from: HTMLElement) => [...from.closest("fieldset")!.querySelectorAll("input")];

  const validate = (from: HTMLElement) => {
    const [day, month, year] = inputs(from);
    year.setCustomValidity(dateProblem({ day: day.value, month: month.value, year: year.value }));
  };

  const onInput = (i: number) => (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/\D/g, "").slice(0, boxes[i].length);
    if (input.value.length === boxes[i].length) inputs(input)[i + 1]?.focus();
    validate(input);
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const prev = inputs(input)[i - 1];
    if (e.key === "Backspace" && input.value === "" && prev) {
      e.preventDefault();
      prev.focus();
      prev.value = prev.value.slice(0, -1);
      validate(input);
    }
    // "/", "-", "." or space after a short day/month (e.g. "4/") moves on, padding it to "04"
    if (["/", "-", ".", " "].includes(e.key)) {
      e.preventDefault();
      if (input.value.length === 1 && i < 2) input.value = input.value.padStart(2, "0");
      inputs(input)[i + 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const parts = e.clipboardData.getData("text").match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
    if (!parts) return;
    e.preventDefault();
    const all = inputs(e.currentTarget);
    [parts[1].padStart(2, "0"), parts[2].padStart(2, "0"), parts[3]].forEach((value, i) => (all[i].value = value));
    all[2].focus();
    validate(all[2]);
  };

  return (
    <fieldset>
      <legend className={text.label}>Date of birth</legend>
      <div className="mt-2 flex gap-2">
        {boxes.map((box, i) => (
          <input
            key={box.name}
            name={box.name}
            aria-label={box.label}
            type="text"
            inputMode="numeric"
            autoComplete={`bday-${box.name}`}
            placeholder={box.placeholder}
            required
            minLength={box.length}
            maxLength={box.length}
            pattern={`\\d{${box.length}}`}
            defaultValue={defaultValue?.[box.name]}
            onInput={onInput(i)}
            onKeyDown={onKeyDown(i)}
            onPaste={onPaste}
            onFocus={(e) => e.currentTarget.select()}
            className={`h-12 ${box.width} rounded-xl border border-ink/15 bg-white text-center text-lg tabular-nums text-ink placeholder:text-base placeholder:text-stone/60 focus:border-ink focus:outline-none`}
          />
        ))}
      </div>
    </fieldset>
  );
}
