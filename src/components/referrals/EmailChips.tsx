"use client";

import { useState, type KeyboardEvent } from "react";
import { Close } from "@/components/icons";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type EmailChipsProps = {
  emails: string[];
  onChange: (emails: string[]) => void;
  id: string;
};

/**
 * Several email addresses in one field: each becomes a removable chip on Enter, comma, space or
 * leaving the field (pasting a list works too). Anything that isn't an email stays as text.
 */
export default function EmailChips({ emails, onChange, id }: EmailChipsProps) {
  const [draft, setDraft] = useState("");

  const commit = (text: string) => {
    const parts = text.split(/[\s,;]+/).filter(Boolean);
    const good = parts.filter(isEmail).map((e) => e.toLowerCase());
    const bad = parts.filter((p) => !isEmail(p));
    if (good.length) onChange([...new Set([...emails, ...good])]);
    setDraft(bad.join(" "));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " ", ";"].includes(e.key) && draft.trim()) {
      e.preventDefault();
      commit(draft);
    }
    if (e.key === "Backspace" && !draft && emails.length) onChange(emails.slice(0, -1));
  };

  return (
    <div className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl border border-ink/15 bg-white px-3 py-2 focus-within:border-ink">
      {emails.map((email) => (
        <span key={email} className="inline-flex items-center gap-1 rounded-full bg-cream py-1 pr-1 pl-3 text-sm text-ink">
          {email}
          <button type="button" onClick={() => onChange(emails.filter((e) => e !== email))} aria-label={`Remove ${email}`} className="flex size-6 items-center justify-center rounded-full hover:bg-cream-dark">
            <Close className="size-3.5" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        id={id}
        // Text, not type="email": browsers trim email inputs, which would swallow the space that ends a chip
        type="text"
        inputMode="email"
        autoComplete="off"
        value={draft}
        onChange={(e) => (/[\s,;]$/.test(e.target.value) ? commit(e.target.value) : setDraft(e.target.value))}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && commit(draft)}
        onPaste={(e) => {
          e.preventDefault();
          commit(draft + " " + e.clipboardData.getData("text"));
        }}
        placeholder={emails.length ? "Add another" : "friend@example.com"}
        className="h-8 min-w-40 flex-1 bg-transparent text-base text-ink placeholder:text-stone focus:outline-none"
      />
    </div>
  );
}
