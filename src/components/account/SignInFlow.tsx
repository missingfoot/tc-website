"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import CodeInput from "@/components/ui/CodeInput";
import { TextField } from "@/components/application/fields";
import { cancelSignIn, requestCode, useAccount, verifyCode } from "@/lib/account";
import { text } from "@/lib/styles";

/**
 * Passwordless sign-in for members: an email, then the 6-digit code we "send" to it. `next` is where
 * to go afterwards. TODO: with a backend, only member emails get a code ("we can't find a membership").
 */
export default function SignInFlow({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const state = useAccount();
  const [wrong, setWrong] = useState(0);
  const [resent, setResent] = useState(false);

  // Already signed in (e.g. a second tab): straight to the account
  const signedIn = Boolean(state?.account);
  const [destination, setDestination] = useState(next);
  useEffect(() => {
    if (signedIn) router.replace(destination);
  }, [signedIn, destination, router]);

  // Server render and the moment before the browser's storage is read
  if (!state || state.account) return <div className="min-h-64" />;

  if (!state.pending) {
    const submit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      requestCode(String(new FormData(e.currentTarget).get("email")), "", next);
    };
    return (
      <div>
        <h1 className={text.sectionHeading}>Sign in</h1>
        <p className={`mt-4 ${text.body}`}>
          For members: your booking, renewal and referrals. Enter the email you live with us under and we’ll send you a code. No password needed.
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
          <TextField id="email" label="Your email" type="email" autoComplete="email" required autoFocus />
          <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto lg:self-start">
            Email me a code
          </Button>
        </form>
        <p className={`mt-8 ${text.body}`}>
          Not a member yet?{" "}
          <Link href="/co-living" className="font-medium text-ink underline underline-offset-4">
            Find your new home
          </Link>
        </p>
      </div>
    );
  }

  const { email, name, code, next: pendingNext } = state.pending;
  return (
    <div>
      <h1 className={text.sectionHeading}>Check your email</h1>
      <p className={`mt-4 ${text.body}`}>
        We’ve sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. Enter it below to continue.
      </p>

      {/* TODO: remove once codes are really emailed */}
      <InfoBox className="mt-6">
        <span className="font-bold">Demo:</span> nothing is emailed yet, so your code is <span className="font-bold tracking-widest">{code}</span>.
      </InfoBox>

      <div className="mt-8">
        <CodeInput
          key={wrong}
          invalid={wrong > 0}
          onComplete={(entered) => {
            const goTo = verifyCode(entered);
            if (goTo) setDestination(goTo);
            else setWrong((n) => n + 1);
          }}
        />
        {wrong > 0 && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            That code isn’t right. Check the email and try again.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-base">
        <button
          type="button"
          onClick={() => {
            requestCode(email, name, pendingNext);
            setWrong(0);
            setResent(true);
          }}
          className="font-medium text-ink underline underline-offset-4"
        >
          {resent ? "Code sent again" : "Send a new code"}
        </button>
        <button type="button" onClick={cancelSignIn} className="font-medium text-ink underline underline-offset-4">
          Use a different email
        </button>
      </div>
    </div>
  );
}
