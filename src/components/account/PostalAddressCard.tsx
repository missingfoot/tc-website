"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Check } from "@/components/icons";
import type { Membership } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

/** Their postal address, with a copy button and a link to a proof of address letter. */
export default function PostalAddressCard({ m }: { m: Membership }) {
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => {
    await navigator.clipboard.writeText(m.postalAddress.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <AccountCard heading="Your postal address" intro="For post and deliveries. The front desk signs for parcels when you’re out.">
      <address className="text-base leading-relaxed text-ink not-italic">
        {m.postalAddress.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <Button variant="outline" onClick={copyAddress} className="mt-6 w-full justify-center lg:w-auto">
        {copied && <Check />}
        {copied ? "Copied" : "Copy address"}
      </Button>
      <p className={`mt-6 ${text.body}`}>
        Need to prove you live here, e.g. for a bank or your GP?{" "}
        <Link href="/account/documents/proof-of-address" className="font-medium text-ink underline underline-offset-4">
          Get a proof of address letter
        </Link>
        .
      </p>
    </AccountCard>
  );
}
