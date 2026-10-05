"use client";

import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import { DoorEntry, HandsHeart, People, Shelves, Sofa, TeamChat } from "@/components/icons";
import { confirmMoveOut } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import ReasonTiles, { type Reason } from "./ReasonTiles";

const long = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const reasons: Reason[] = [
  { label: "I haven’t connected with anyone", icon: People },
  { label: "I need more space", icon: Shelves },
  { label: "It doesn’t feel like home", icon: DoorEntry },
  { label: "I’m moving in with my partner", icon: HandsHeart },
  { label: "I didn’t get on with The Collective team", icon: TeamChat },
  { label: "Co-living isn’t for me", icon: Sofa },
  { label: "Other" },
];

/** The "I'm moving out" path: why they're leaving, then confirming. */
export default function MoveOutForm({ checkOut }: { checkOut: Date }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    confirmMoveOut({ reasons: data.getAll("reasons").map(String), comments: String(data.get("comments") ?? "").trim() || undefined });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <form onSubmit={submit}>
      <AccountCard heading="Let us know why you’re leaving" intro="Select as many as you like. It helps us make The Collective better.">
        <ReasonTiles reasons={reasons} name="reasons" legend="Why you’re leaving" />

        <label htmlFor="moveout-comments" className={`mt-8 block ${text.label}`}>
          Anything else? (optional)
        </label>
        <textarea
          id="moveout-comments"
          name="comments"
          rows={4}
          placeholder="We love getting your feedback."
          className="mt-2 w-full rounded-xl border border-ink/15 bg-white p-4 text-base text-ink placeholder:text-stone focus:border-ink focus:outline-none"
        />

        <InfoBox className="mt-6">
          By confirming, you’re letting us know you’ll move out at the end of your membership, on <span className="font-medium">{long.format(checkOut)}</span> (check-out
          by 10:00).
        </InfoBox>

        <Button type="submit" variant="dark" className="mt-6 w-full justify-center lg:w-auto">
          Confirm move out
        </Button>
      </AccountCard>
    </form>
  );
}
