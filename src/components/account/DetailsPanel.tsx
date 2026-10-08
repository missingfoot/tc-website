"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import CodeInput from "@/components/ui/CodeInput";
import InfoBox from "@/components/ui/InfoBox";
import { Check } from "@/components/icons";
import { Details, PhoneField, RadioGroup, TextField } from "@/components/application/fields";
import { cancelEmailChange, confirmEmailChange, requestEmailChange, saveDetails, useAccount, type Account, type Profile } from "@/lib/account";
import { site } from "@/config/site";
import AccountCard from "./AccountCard";
import GuarantorCard from "./GuarantorCard";
import PrivacyCard from "./PrivacyCard";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); // a date-only ISO string is midnight UTC

const contactLink = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

/**
 * Your details tab: name, mobile and the application answers that can change (gender, student),
 * their email (also how they sign in, so a new one is confirmed with a code), then the answers
 * checked for their right to rent, which only we can change.
 */
export default function DetailsPanel() {
  const account = useAccount()?.account;
  const [saved, setSaved] = useState(false);
  if (!account) return null;
  const { profile } = account;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "");
    saveDetails({
      firstName: value("firstName"),
      lastName: value("lastName"),
      dialCode: value("dialCode"),
      mobile: value("mobile"),
      gender: value("gender"),
      student: value("student"),
    });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <AccountCard heading="Your details">
        <form onSubmit={submit} onChange={() => setSaved(false)} className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="firstName" label="First name" autoComplete="given-name" required defaultValue={account.firstName} />
            <TextField id="lastName" label="Last name" autoComplete="family-name" required defaultValue={account.lastName} />
          </div>
          <PhoneField id="mobile" label="Mobile number" defaultValue={account.phone} />
          {profile && (
            <>
              <RadioGroup legend="Gender" name="gender" options={["Female", "Male", "Other"]} defaultValue={profile.gender} />
              <RadioGroup legend="Are you a student?" name="student" options={["Yes", "No"]} defaultValue={profile.student} />
            </>
          )}
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

      <EmailCard account={account} />
      {profile && <RightToRent profile={profile} />}
      <GuarantorCard account={account} />
      <PrivacyCard account={account} />
    </div>
  );
}

function RightToRent({ profile }: { profile: Profile }) {
  return (
    <AccountCard
      heading="Right to rent"
      intro={
        <>
          From your application. We checked these when you moved in, so if anything’s wrong or has changed,{" "}
          <a href={contactLink("Update my right to rent details")} className="font-medium text-ink underline underline-offset-4">
            contact us
          </a>
          .
        </>
      }
    >
      <Details
        lines
        rows={[
          ["Date of birth", dateFormat.format(new Date(profile.dateOfBirth))],
          ["Nationality", profile.nationality],
          ["Visa needed", profile.visa],
        ]}
      />
    </AccountCard>
  );
}

/**
 * The sign-in email. Changing it sends a code to the new address, and it only changes once the
 * code is entered, so a typo can't lock them out.
 */
function EmailCard({ account }: { account: Account }) {
  const [editing, setEditing] = useState(false);
  const [problem, setProblem] = useState("");
  const [wrong, setWrong] = useState(0);
  const [changed, setChanged] = useState(false);
  const pending = account.emailChange;

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("newEmail")).trim().toLowerCase();
    if (email === account.email) return setProblem("That’s already your email.");
    requestEmailChange(email);
    setWrong(0);
    setEditing(false);
  };

  const cancel = () => {
    cancelEmailChange();
    setEditing(false);
    setProblem("");
  };

  if (pending) {
    return (
      <AccountCard heading="Email" intro={<>We’ve sent a 6-digit code to <span className="font-medium text-ink">{pending.email}</span>. Enter it to confirm your new email.</>}>
        {/* TODO: remove once codes are really emailed */}
        <InfoBox>
          <span className="font-bold">Demo:</span> nothing is emailed yet, so your code is <span className="font-bold tracking-widest">{pending.code}</span>.
        </InfoBox>
        <div className="mt-6">
          <CodeInput
            key={wrong}
            label="Confirmation code"
            invalid={wrong > 0}
            onComplete={(code) => {
              if (confirmEmailChange(code)) setChanged(true);
              else setWrong((n) => n + 1);
            }}
          />
          {wrong > 0 && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              That code isn’t right. Check the email and try again.
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-base">
          <button type="button" onClick={() => (requestEmailChange(pending.email), setWrong(0))} className="font-medium text-ink underline underline-offset-4">
            Send a new code
          </button>
          <button type="button" onClick={cancel} className="font-medium text-ink underline underline-offset-4">
            Keep {account.email}
          </button>
        </div>
      </AccountCard>
    );
  }

  return (
    <AccountCard heading="Email" intro="You sign in with this, and it’s where we send anything about your membership.">
      {editing ? (
        <form onSubmit={send} className="flex flex-col gap-6">
          <div>
            <TextField
              id="newEmail"
              label="New email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              onChange={() => setProblem("")}
            />
            {problem && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {problem}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 lg:flex-row">
            <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
              Send code
            </Button>
            <Button variant="outline" onClick={cancel} className="w-full justify-center lg:w-auto">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{account.email}</p>
            {changed && (
              <p role="status" className="mt-1 flex items-center gap-2 text-sm text-ink">
                <Check className="size-4 text-sage" />
                Email changed. Sign in with this from now on.
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => (setEditing(true), setChanged(false))} className="w-full justify-center lg:w-auto">
            Change email
          </Button>
        </div>
      )}
    </AccountCard>
  );
}
