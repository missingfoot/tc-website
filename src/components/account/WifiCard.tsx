"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "@/components/icons";
import { wifiDetails, type Account } from "@/lib/account";
import { pressable, text } from "@/lib/styles";
import AccountCard from "./AccountCard";

/** The building Wi-Fi: network and password, each with a copy button. */
export default function WifiCard({ account, intro }: { account: Account; intro?: string }) {
  const wifi = wifiDetails(account);
  return (
    <AccountCard heading="Wi-Fi" intro={intro ?? "One network across the building, from your room to the lounges and co-working spaces."}>
      <div className="flex flex-col gap-3">
        <WifiRow label="Network" value={wifi.network} />
        <WifiRow label="Password" value={wifi.password} mono />
      </div>
      <p className={`mt-6 ${text.body}`}>
        Trouble connecting?{" "}
        <Link href="/account/support/new/general" className="font-medium text-ink underline underline-offset-4">
          Let us know
        </Link>
        .
      </p>
    </AccountCard>
  );
}

function WifiRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-cream p-4 pl-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-stone">{label}</p>
        <p className={`truncate text-lg font-bold text-ink ${mono ? "tracking-wide" : ""}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`flex h-12 shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 font-bold text-ink hover:bg-cream-dark ${pressable}`}
      >
        {copied ? <Check /> : <Copy />}
        <span className="max-sm:sr-only">{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}
