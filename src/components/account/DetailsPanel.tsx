"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Check } from "@/components/icons";
import { TextField } from "@/components/application/fields";
import { saveDetails, useAccount } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

/** Your details tab: name and phone (email is the sign-in, so it's changed by contacting us). */
/** `email`: the company's, for asking to change yours (the CMS's Contact details). */
export default function DetailsPanel({ email }: { email: string }) {
  const account = useAccount()?.account;
  const [saved, setSaved] = useState(false);
  if (!account) return null;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    saveDetails({ name: String(data.get("name")), phone: String(data.get("phone")) });
    setSaved(true);
  };

  return (
    <AccountCard heading="Your details">
      <form onSubmit={submit} onChange={() => setSaved(false)} className="flex flex-col gap-6">
        <TextField id="name" label="Name" autoComplete="name" required defaultValue={account.name} />
        <TextField id="phone" label="Mobile number" type="tel" autoComplete="tel" defaultValue={account.phone} />
        <div>
          <p className={text.label}>Email</p>
          <p className="mt-2 font-medium text-ink">{account.email}</p>
          <p className="mt-1 text-sm text-stone">
            You sign in with this.{" "}
            <a href={`mailto:${email}?subject=Change my email`} className="underline underline-offset-4">
              Contact us
            </a>{" "}
            to change it.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
            Save
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
