"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { Check, Car } from "@/components/icons";
import { appLinks, arrivalSlots, manualChecklist, provided, toBring } from "@/content/move-in";
import { hasMovedIn, saveMoveIn, useAccount } from "@/lib/account";
import { pressable, text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import Countdown from "./Countdown";
import WifiCard from "./WifiCard";

const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
const DAY = 86_400_000;

/**
 * Moving in tab (before check-in): a countdown, booking an arrival slot (and saying if they're driving), a
 * checklist, Wi-Fi to set up early, and what's provided and what to bring.
 */
export default function MoveInPanel() {
  const account = useAccount()?.account;
  if (!account) return null;
  const m = account.membership;

  if (!m || hasMovedIn(m)) {
    return (
      <AccountCard heading="Moving in" intro="You’ve moved in, welcome home! Everything about your room and rent is under Membership.">
        <Button href="/account" variant="dark" className="w-full justify-center lg:w-auto">
          Your membership
        </Button>
      </AccountCard>
    );
  }

  const checkIn = new Date(m.checkIn);
  const plan = account.moveIn ?? { ticked: [] };
  const toggle = (id: string) => saveMoveIn({ ticked: plan.ticked.includes(id) ? plan.ticked.filter((t) => t !== id) : [...plan.ticked, id] });

  const checklist: { id: string; title: string; body: ReactNode; done: boolean; action?: ReactNode; manual?: boolean }[] = [
    {
      id: "arrival",
      title: "Book your arrival time",
      body: plan.arrival ? `${weekday.format(checkIn)}, ${plan.arrival}.` : "So the front desk is ready with your keys.",
      done: Boolean(plan.arrival),
      action: !plan.arrival && (
        <Button href="#arrival" variant="outline" className="w-full justify-center lg:w-auto">
          Choose a time
        </Button>
      ),
    },
    {
      id: "direct-debit",
      title: "Set up your Direct Debit",
      body: m.directDebit ? `Set up with ${m.directDebit.bank}.` : "Your rent is collected on the 1st of each month.",
      done: Boolean(m.directDebit),
      action: !m.directDebit && (
        <Button href="/account/direct-debit" variant="dark" className="w-full justify-center lg:w-auto">
          Set up Direct Debit
        </Button>
      ),
    },
    ...manualChecklist.map((item) => ({
      ...item,
      done: plan.ticked.includes(item.id),
      manual: true,
      action:
        item.id === "app" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {appLinks.map((link) => (
              <Button key={link.label} href={link.href} variant="outline" newTab className="justify-center">
                {link.label}
              </Button>
            ))}
          </div>
        ) : undefined,
    })),
  ];
  const done = checklist.filter((c) => c.done).length;

  return (
    <>
      <AccountCard heading="Getting ready to move in" intro={`You move in on ${weekday.format(checkIn)}. Here’s everything to sort before then.`}>
        <Countdown start={new Date(checkIn.getTime() - 28 * DAY)} label="Until you move in" target={checkIn} note={`${weekday.format(checkIn)}, from 14:00`} passed="Welcome home" />
      </AccountCard>

      <AccountCard heading="Before you arrive" intro={`${done} of ${checklist.length} done`}>
        <ol className="flex flex-col gap-6">
          {checklist.map((item, i) => (
            <li key={item.id} className="flex gap-4">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full font-bold ${item.done ? "bg-sage text-white" : "bg-cream text-ink"}`}>
                {item.done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                {item.done && <span className="sr-only">Done:</span>}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className={`mt-1 ${text.body}`}>{item.body}</p>
                {item.action && <div className="mt-4">{item.action}</div>}
                {item.manual && (
                  <Checkbox checked={item.done} onChange={() => toggle(item.id)} className="mt-4">
                    Done
                  </Checkbox>
                )}
              </div>
            </li>
          ))}
        </ol>
      </AccountCard>

      <AccountCard heading="Your arrival" id="arrival" intro={`Check-in is from 14:00 on ${weekday.format(checkIn)}. Pick a time and we’ll have your keys ready at the front desk.`}>
        <fieldset>
          <legend className="sr-only">Arrival time</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {arrivalSlots.map((slot) => (
              <label key={slot} className="cursor-pointer">
                <input type="radio" name="arrival" value={slot} checked={plan.arrival === slot} onChange={() => saveMoveIn({ arrival: slot })} className="peer sr-only" />
                <span
                  className={`flex h-12 items-center justify-center rounded-xl border border-ink/15 bg-white font-medium text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 hover:border-ink/40 ${pressable}`}
                >
                  {slot}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 flex gap-4 rounded-2xl bg-cream p-5">
          <Car className="mt-0.5 text-stone" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Coming by car or van?</p>
            <p className={`mt-1 ${text.body}`}>Let us know and we’ll keep a parking space free outside while you unload.</p>
            <Checkbox checked={Boolean(plan.byCar)} onChange={(e) => saveMoveIn({ byCar: e.target.checked })} className="mt-4">
              I’m coming by car
            </Checkbox>
          </div>
        </div>
        {plan.arrival && (
          <p className="mt-6 flex items-center gap-2 font-medium text-ink" role="status">
            <Check className="size-5 text-sage" />
            See you {weekday.format(checkIn)}, {plan.arrival}
            {plan.byCar ? ". We’ll keep a parking space free for you" : ""}.
          </p>
        )}
      </AccountCard>

      <WifiCard account={account} intro="Your login works from the moment you arrive, so you can save it to your devices now." />

      <AccountCard heading="What to bring">
        <div className="grid gap-8 sm:grid-cols-2">
          <List heading="We provide" items={provided} />
          <List heading="Bring with you" items={toBring} />
        </div>
      </AccountCard>
    </>
  );
}

function List({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-bold text-ink">{heading}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-relaxed text-ink">
            <Check className="mt-1 size-4 shrink-0 text-sage" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
