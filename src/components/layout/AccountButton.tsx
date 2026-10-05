"use client";

import Button from "@/components/ui/Button";
import { useAccount } from "@/lib/account";

/** "Sign in", or "Your account" once signed in. Shown in the desktop nav and pinned to the bottom of the mobile menu. */
export default function AccountButton({ className = "", onClick, compact = false }: { className?: string; onClick?: () => void; compact?: boolean }) {
  const signedIn = Boolean(useAccount()?.account);
  return (
    <span onClickCapture={onClick} className="contents">
      <Button href={signedIn ? "/account" : "/account/sign-in"} variant="light" compact={compact} className={className}>
        {signedIn ? "Your account" : "Sign in"}
      </Button>
    </span>
  );
}
