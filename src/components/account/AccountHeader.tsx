"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "@/components/icons";
import { signOut, useAccount } from "@/lib/account";

/** The account area's header content (inside Nav): its name, a way back to the site, and sign out. */
export default function AccountHeader() {
  const signedIn = Boolean(useAccount()?.account);
  return (
    <>
      <p className="ml-6 hidden border-l border-white/20 pl-6 text-base font-bold sm:block">Your account</p>
      <div className="ml-auto flex items-center gap-6 text-base font-medium">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70">
          <ArrowLeft />
          <span>
            Back<span className="max-sm:hidden"> to site</span>
          </span>
        </Link>
        {signedIn && (
          // -mr-3: the dock pill runs 24px past the content, so this keeps an even 12px gap to its edge
          <Button variant="light" compact onClick={signOut} className="-mr-3">
            Sign out
          </Button>
        )}
      </div>
    </>
  );
}
