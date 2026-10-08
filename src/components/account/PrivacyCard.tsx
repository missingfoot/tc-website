"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { Ban, Download } from "@/components/icons";
import { deleteAccount, exportData, type Account } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

// What a member gives up by deleting their account while their membership is running
const losing = [
  "Your rent schedule, receipts and statements",
  "Proof of address letters and your agreements",
  "Renewing, moving out and changing room",
  "Support requests and replies",
  "Your Wi-Fi details, deposit and condition report",
  "Referral rewards",
];

/** Your data: what we keep and why, a download of all of it, and deleting the account. */
export default function PrivacyCard({ account }: { account: Account }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const member = Boolean(account.membership);

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportData(account)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-collective-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = () => {
    deleteAccount();
    router.replace("/");
  };

  return (
    <AccountCard
      heading="Your data"
      intro={
        <>
          We keep your details, membership, payments and messages to run your membership, and your documents to meet right to rent law. Read more in our{" "}
          <Link href="/privacy" className="font-medium text-ink underline underline-offset-4">
            privacy policy
          </Link>
          .
        </>
      }
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        <Button variant="outline" onClick={download} className="w-full justify-center lg:w-auto">
          <Download />
          Download your data
        </Button>
        <Button variant="outline" onClick={() => setConfirming(true)} className="w-full justify-center text-red-700 lg:w-auto">
          Delete your account
        </Button>
      </div>

      <Dialog open={confirming} onClose={() => setConfirming(false)} title="Delete your account?">
        {member ? (
          <>
            <p className={text.body}>
              We can delete it, but while your membership is running you’d lose easy access to everything you do here. You’d need to sort all of it in person at the front
              desk instead:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {losing.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-ink">
                  <Ban className="mt-1 size-4 shrink-0 text-alert" />
                  {item}
                </li>
              ))}
            </ul>
            <p className={`mt-4 ${text.body}`}>
              We’d still keep what we need to run your membership until it ends, and some records (like payments and right to rent checks) for as long as the law requires
              after that.
            </p>
          </>
        ) : (
          <p className={text.body}>This deletes your details and messages for good. We keep payment records for six years, as the law requires.</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="dark" onClick={() => setConfirming(false)} className="justify-center">
            Keep my account
          </Button>
          <Button variant="outline" onClick={remove} className="justify-center text-red-700">
            Delete anyway
          </Button>
        </div>
      </Dialog>
    </AccountCard>
  );
}
