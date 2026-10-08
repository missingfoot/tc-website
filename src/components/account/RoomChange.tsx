"use client";

import { type FormEvent } from "react";
import Button from "@/components/ui/Button";
import BackLink from "@/components/ui/BackLink";
import Select from "@/components/ui/Select";
import { Details, RadioGroup } from "@/components/application/fields";
import { cancelRoomChange, requestRoomChange, useAccount } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import SuccessCard from "./SuccessCard";

const reasons = ["A bigger room", "A smaller or cheaper room", "A different floor", "Another building", "Something else"];
const roomTypes = ["No preference", "Ensuite", "Studio", "One Bed Flat"];
const timings = ["As soon as possible", "In the next 3 months", "When my membership ends"];
const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Asking to move to a different room, then where the request is (with a way to cancel it). */
export default function RoomChange() {
  const account = useAccount()?.account;
  if (!account) return null;
  const m = account.membership;
  const request = account.roomChange;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    requestRoomChange({ reason: value("reason"), roomType: value("roomType"), when: value("when"), notes: value("notes") || undefined });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/account">Back to your membership</BackLink>

      {request ? (
        <>
          <SuccessCard heading="Request sent">
            Thanks, our lettings team is looking for a room that fits. We’ll be in touch with what’s available, the price and dates before anything changes.
          </SuccessCard>
          <AccountCard heading="Your request">
            <Details
              rows={[
                ["Sent", long.format(new Date(request.at))],
                ["Looking for", request.reason],
                ["Room type", request.roomType],
                ["When", request.when],
                ...(request.notes ? [["Notes", request.notes] as [string, string]] : []),
              ]}
            />
            <Button variant="outline" onClick={cancelRoomChange} className="mt-6 w-full justify-center lg:w-auto">
              Cancel request
            </Button>
          </AccountCard>
        </>
      ) : (
        <AccountCard
          heading="Change room"
          intro={m ? `You’re in ${m.roomType.toLowerCase()} ${m.roomNumber}, ${m.building}. Tell us what you’re after and we’ll see what’s coming up.` : "Tell us what you’re after and we’ll see what’s coming up."}
        >
          <form onSubmit={submit} className="flex flex-col gap-6">
            <RadioGroup legend="What would you like?" name="reason" options={reasons} />
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="roomType" className={`block ${text.label}`}>
                  Room type
                </label>
                <Select id="roomType" name="roomType" options={roomTypes} className="mt-2" />
              </div>
              <div>
                <label htmlFor="when" className={`block ${text.label}`}>
                  When
                </label>
                <Select id="when" name="when" options={timings} className="mt-2" />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className={`block ${text.label}`}>
                Anything else? (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="e.g. A higher floor with a view, or near my friend in 412"
                className="mt-2 w-full rounded-xl border border-ink/15 bg-white p-4 text-base text-ink placeholder:text-stone focus:border-ink focus:outline-none"
              />
            </div>
            <p className={text.body}>Nothing changes until you’ve agreed a new room, price and date with us.</p>
            <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto lg:self-start">
              Send request
            </Button>
          </form>
        </AccountCard>
      )}
    </div>
  );
}
