"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Check, Clock } from "@/components/icons";
import { Details, TextField } from "@/components/application/fields";
import { guarantorStatus, saveGuarantor, type Account } from "@/lib/account";
import { useTick } from "@/hooks/useTick";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";

const relationships = ["Parent", "Other family member", "Partner", "Employer", "Friend", "Other"];
const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * Your guarantor: who it is and whether they're verified, with a form to add one or swap them. A new
 * guarantor gets an email from our referencing partner to complete their checks.
 */
export default function GuarantorCard({ account }: { account: Account }) {
  const g = account.guarantor;
  const status = guarantorStatus(g);
  const [editing, setEditing] = useState(false);
  // Re-checks while referencing is under way, so it flips to verified by itself
  useTick(status === "pending");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    saveGuarantor({ name: value("guarantorName"), email: value("guarantorEmail").toLowerCase(), relationship: value("relationship") });
    setEditing(false);
  };

  return (
    <AccountCard heading="Guarantor" intro="Someone in the UK who agrees to cover your rent if you can’t. Not everyone needs one: it depends on your referencing.">
      {g && !editing && (
        <>
          <Details
            rows={[
              ["Name", g.name],
              ["Email", g.email],
              ["Relationship", g.relationship],
              [
                "Status",
                <span key="status" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-ink ${status === "verified" ? "bg-sage/20" : "bg-cream-dark"}`}>
                  {status === "verified" ? <Check className="size-4" /> : <Clock className="size-4" />}
                  {status === "verified" ? "Verified" : "Being checked"}
                </span>,
              ],
            ]}
          />
          {status === "pending" && (
            <p className={`mt-6 ${text.body}`}>
              We emailed {g.name.split(" ")[0]} on {long.format(new Date(g.invitedAt))} to complete their referencing. It usually takes a couple of working days once they’ve
              filled it in.
            </p>
          )}
          <Button variant="outline" onClick={() => setEditing(true)} className="mt-6 w-full justify-center lg:w-auto">
            Change guarantor
          </Button>
        </>
      )}

      {!g && !editing && (
        <Button variant="dark" onClick={() => setEditing(true)} className="w-full justify-center lg:w-auto">
          Add a guarantor
        </Button>
      )}

      {editing && (
        <form onSubmit={submit} className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id="guarantorName" label="Their full name" autoComplete="off" required defaultValue={g?.name} />
            <TextField id="guarantorEmail" label="Their email" type="email" autoComplete="off" required defaultValue={g?.email} />
          </div>
          <div>
            <label htmlFor="relationship" className={`block ${text.label}`}>
              How do you know them?
            </label>
            <Select id="relationship" name="relationship" options={relationships} placeholder="Choose one" required defaultValue={g?.relationship} className="mt-2" />
          </div>
          <p className={text.body}>We’ll email them a link from our referencing partner to confirm they’re happy to be your guarantor and to check their details.</p>
          <div className="flex flex-col gap-3 lg:flex-row">
            <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto">
              {g ? "Change guarantor" : "Add guarantor"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)} className="w-full justify-center lg:w-auto">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </AccountCard>
  );
}
