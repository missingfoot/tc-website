"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import InfoBox from "@/components/ui/InfoBox";
import { Check } from "@/components/icons";
import { saveComms, useAccount, type CommsPreferences } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

const types: { key: keyof CommsPreferences; title: string; description: string }[] = [
  { key: "blog", title: "Blog and news", description: "The latest from our blog and what’s happening at The Collective." },
  { key: "marketing", title: "Offers and updates", description: "Member offers, new spaces and things we think you’ll like." },
  { key: "oneToOne", title: "One-to-one emails", description: "Personal emails from our team, e.g. following up on an enquiry." },
];

const allOn: CommsPreferences = { blog: true, marketing: true, oneToOne: true };

/** Communication tab: which optional emails to get, or none at all. */
export default function CommsPanel() {
  const account = useAccount()?.account;
  const [prefs, setPrefs] = useState<CommsPreferences>(account?.comms ?? allOn);
  const [saved, setSaved] = useState(false);
  if (!account) return null;

  const none = types.every((t) => !prefs[t.key]);
  const update = (next: CommsPreferences) => {
    setPrefs(next);
    setSaved(false);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveComms(prefs);
    setSaved(true);
  };

  return (
    <AccountCard heading="Communication" intro={`Choose which emails we send to ${account.email}.`}>
      <form onSubmit={submit} className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Emails you’d like to get</legend>
          {types.map((t) => (
            <Checkbox
              key={t.key}
              checked={prefs[t.key]}
              onChange={(e) => update({ ...prefs, [t.key]: e.target.checked })}
              className="rounded-xl border border-ink/15 p-4 has-checked:border-ink"
            >
              <span className="block font-medium text-ink">{t.title}</span>
              <span className="mt-1 block text-sm text-stone">{t.description}</span>
            </Checkbox>
          ))}
        </fieldset>

        <div>
          <p className={text.label}>Or turn them all off</p>
          <Checkbox checked={none} onChange={(e) => update(e.target.checked ? { blog: false, marketing: false, oneToOne: false } : allOn)} className="mt-3">
            Don’t send me any of these emails
          </Checkbox>
        </div>

        <InfoBox>We’ll still email you about your membership, like renewals, payments and your agreement, as you need those.</InfoBox>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
            Save preferences
          </Button>
          {saved && (
            <p role="status" className="flex items-center gap-2 text-base text-ink">
              <Check className="text-sage" />
              Saved
            </p>
          )}
        </div>
      </form>
    </AccountCard>
  );
}
