"use client";

import Button from "@/components/ui/Button";
import { useAccount } from "@/lib/account";
import { text } from "@/lib/styles";

/** Referring is for members: sign in to get your link (or, if signed in, go straight to it). */
export default function GetLinkForm() {
  const account = useAccount()?.account;

  return (
    // Stacked: the line, then the button (centred on desktop with the rest of the section)
    <div className="flex flex-col items-start gap-8 lg:items-center">
      <p className={text.body}>
        {account ? (
          <>
            You’re signed in as <span className="font-medium text-ink">{account.email}</span>.
          </>
        ) : (
          "Your link and invites are in your account. Sign in with the email you live with us under."
        )}
      </p>
      <Button
        href={account ? "/account/referrals" : "/account/sign-in?next=/account/referrals"}
        variant="dark"
        arrow
        className="w-full justify-center lg:w-auto"
      >
        {account ? "Go to your referrals" : "Sign in to get your link"}
      </Button>
    </div>
  );
}
