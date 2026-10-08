"use client";

import Link from "next/link";
import { useState, type ComponentType, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { sizes2x } from "@/lib/images";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import InfoBox from "@/components/ui/InfoBox";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { Bed, CalendarCheck, Check, CocktailGlass, DoorEntry, HandsHeart, HomeHeart, More, MoveOut, People, Renew, Sofa, TeamHeart } from "@/components/icons";
import { Details } from "@/components/application/fields";
import { formatMoney } from "@/lib/application";
import { renewalDates, renewalOptions, requestRenewal, useAccount, type Membership, type RenewalRequest } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import Countdown from "./Countdown";
import ReasonTiles, { type Reason } from "./ReasonTiles";
import MoveOutForm from "./MoveOutForm";

const long = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const short = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const RENEWALS_EMAIL = "renewals@thecollective.co.uk";

// TODO: the real renewal terms (the design's text was copied from the booking form)
const renewalTerms = [
  {
    question: "Renewal terms",
    numbered: true,
    answer: [
      "Your new membership starts the day after your current one ends, in the same room, at the monthly fee shown.",
      "Your security bond carries over to your new membership.",
      "We’ll email your new membership agreement to sign. Your renewal is confirmed once it’s signed.",
    ],
  },
];

const reasons: Reason[] = [
  { label: "I’m really at home here", icon: HomeHeart },
  { label: "I’ve made great connections with other members", icon: People },
  { label: "It’s a great place to grow and develop", icon: HandsHeart },
  { label: "I like the convenient lifestyle", icon: CocktailGlass },
  { label: "I appreciate The Collective team", icon: TeamHeart },
  { label: "I love the shared spaces", icon: Sofa },
  { label: "Other", icon: More },
];

function Fact({ icon: FactIcon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <li className="flex items-center gap-4 py-4">
      <FactIcon className="text-ink" />
      <div>
        <p className={text.label}>{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </li>
  );
}

/** A membership plan's details beside the room's photo (details only on mobile, where the photo just pushed them down). */
function PlanCard({ heading, m, plan }: { heading: string; m: Membership; plan: { months: number; start: Date; end: Date; monthlyPrice: number } }) {
  return (
    <AccountCard heading={heading}>
      <div className="grid gap-6 md:grid-cols-[1fr_14rem]">
        <Details
          split
          lines
          rows={[
            ["Room type", m.roomType],
            ["Membership", `${plan.months} months`],
            ["Starts", short.format(plan.start)],
            ["Ends", short.format(plan.end)],
            ["Monthly licence fee", formatMoney(plan.monthlyPrice)],
          ]}
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/10 max-md:hidden">
          <Photo src={m.photo.src} alt={m.photo.alt} sizes={sizes2x([null, "14rem"])} className="object-cover" />
        </div>
      </div>
    </AccountCard>
  );
}

type Choice = "renew" | "leave";

/**
 * Renewal tab: the deadline, then a choice between renewing and moving out, each revealing its
 * own form. `initialChoice` opens one straight away (e.g. the Membership tab's "I'm moving out").
 */
export default function RenewalPanel({ initialChoice }: { initialChoice?: Choice }) {
  const account = useAccount()?.account;
  const [months, setMonths] = useState(12);
  const [choice, setChoice] = useState<Choice | undefined>(initialChoice);
  if (!account) return null;
  const m = account.membership;

  if (!m) {
    return (
      <AccountCard heading="Renewal" intro="We can’t find an active membership to renew.">
        <Button href="/co-living" variant="dark" arrow className="w-full justify-center lg:w-auto">
          Find your next home
        </Button>
      </AccountCard>
    );
  }

  if (m.renewal.requested) return <RenewalConfirmed m={m} request={m.renewal.requested} />;
  if (m.renewal.movingOut) return <MovingOut m={m} />;

  const { checkOut, renewBy } = renewalDates(m);
  const options = renewalOptions(m);
  const chosen = options.find((o) => o.months === months) ?? options[0];
  const currentStart = new Date(m.checkIn);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    requestRenewal({
      months: chosen.months,
      monthlyPrice: chosen.monthlyPrice,
      start: chosen.start.toISOString(),
      end: chosen.end.toISOString(),
      reasons: data.getAll("reasons").map(String),
      comments: String(data.get("comments") ?? "").trim() || undefined,
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const choices: { value: Choice; label: string; hint: string; icon: ComponentType<{ className?: string }> }[] = [
    {
      value: "renew",
      label: "Renew my membership",
      hint: "Stay on in your room",
      icon: Renew,
    },
    {
      value: "leave",
      label: "I’m moving out",
      hint: `Leave on ${short.format(checkOut)}`,
      icon: MoveOut,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AccountCard
        heading="How time flies when you’re having fun"
        intro="Your membership is coming to an end, but it doesn’t have to. Renew early to guarantee your room."
      >
        <Countdown
          start={new Date(m.checkIn)}
          label="Time left to renew"
          target={renewBy}
          note={`Renew by ${long.format(renewBy)}`}
          passed="Renewal deadline passed"
        />
        <ul className="mt-4 divide-y divide-ink/10">
          <Fact icon={Bed} label="Current contract" value={`${m.roomType} at ${m.building}`} />
          <Fact icon={CalendarCheck} label="Your membership ends" value={long.format(checkOut)} />
          <Fact icon={HandsHeart} label="Renewal bonus" value={m.renewal.bonus} />
          <Fact icon={DoorEntry} label="Secure your room, renew by" value={long.format(renewBy)} />
        </ul>
      </AccountCard>

      <AccountCard heading="What would you like to do?">
        <div role="radiogroup" aria-label="Renew or move out" className="grid gap-3 sm:grid-cols-2">
          {choices.map((c) => {
            const selected = choice === c.value;
            return (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(c.value)}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  selected ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink hover:border-ink/40"
                }`}
              >
                <c.icon className="shrink-0" />
                <span className="flex flex-col">
                  <span className="text-lg font-bold">{c.label}</span>
                  <span className={`mt-1 text-sm ${selected ? "text-white/70" : "text-stone"}`}>{c.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </AccountCard>

      {choice === "renew" && (
        <form onSubmit={submit} className="flex flex-col gap-6">
          <PlanCard
            heading="Your current membership"
            m={m}
            plan={{
              months: m.months,
              start: currentStart,
              end: checkOut,
              monthlyPrice: m.monthlyPrice,
            }}
          />

          <AccountCard heading="How long would you like to stay?">
            <label htmlFor="renewal-term" className="sr-only">
              Length of your new membership
            </label>
            <Select
              id="renewal-term"
              value={String(months)}
              onChange={(e) => setMonths(Number(e.target.value))}
              options={options.map((o) => ({
                value: String(o.months),
                label: `${o.months} months: ${formatMoney(o.monthlyPrice)} a month`,
              }))}
            />
            <InfoBox className="mt-4">
              For less than three months, email{" "}
              <a href={`mailto:${RENEWALS_EMAIL}`} className="font-medium text-ink underline underline-offset-4">
                {RENEWALS_EMAIL}
              </a>
              .
            </InfoBox>
          </AccountCard>

          <PlanCard heading="Your new membership" m={m} plan={chosen} />

          <AccountCard heading="Why are you staying?" intro="Select as many as you like. It helps us keep doing what you love.">
            <ReasonTiles reasons={reasons} name="reasons" legend="Why you want to renew" />

            <label htmlFor="renewal-comments" className={`mt-8 block ${text.label}`}>
              Anything else? (optional)
            </label>
            <textarea
              id="renewal-comments"
              name="comments"
              rows={4}
              placeholder="We love getting your feedback."
              className="mt-2 w-full rounded-xl border border-ink/15 bg-white p-4 text-base text-ink placeholder:text-stone focus:border-ink focus:outline-none"
            />
          </AccountCard>

          <AccountCard heading="Confirm your renewal">
            <FaqAccordion idPrefix="renewal-terms" initiallyOpen={[]} items={renewalTerms} />
            <InfoBox className="mt-6">
              By confirming, you’re asking to stay on for {chosen.months} months from {long.format(chosen.start)}, at {formatMoney(chosen.monthlyPrice)} a month.
            </InfoBox>
            <Checkbox required className="mt-6">
              I’ve read and agree to the renewal terms and the{" "}
              <Link href="/terms" className="font-medium underline underline-offset-4">
                terms &amp; conditions
              </Link>
            </Checkbox>
            <Button type="submit" variant="dark" className="mt-6 w-full justify-center lg:w-auto">
              Confirm renewal
            </Button>
          </AccountCard>
        </form>
      )}

      {choice === "leave" && <MoveOutForm checkOut={checkOut} />}
    </div>
  );
}

function RenewalConfirmed({ m, request }: { m: Membership; request: RenewalRequest }) {
  return (
    <>
      <AccountCard heading="Thanks for renewing">
        <div className="flex flex-col items-start gap-4">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
            <Check strokeWidth={3} />
          </span>
          <p className={text.body}>
            We’ve emailed you a confirmation and we’re reviewing your renewal. We’ll be in touch with next steps as soon as we can. Any questions, email{" "}
            <a href={`mailto:${RENEWALS_EMAIL}`} className="font-medium text-ink underline underline-offset-4">
              {RENEWALS_EMAIL}
            </a>
            .
          </p>
        </div>
      </AccountCard>

      <PlanCard
        heading="Your new membership"
        m={m}
        plan={{
          months: request.months,
          start: new Date(request.start),
          end: new Date(request.end),
          monthlyPrice: request.monthlyPrice,
        }}
      />

      <AccountCard heading="Next up">
        <ol className="flex flex-col gap-6">
          <li className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream font-bold text-ink">1</span>
            <div>
              <h3 className="font-bold text-ink">Sign your membership agreement</h3>
              <p className={`mt-1 ${text.body}`}>We’ll email it over as soon as we can. If any of your documents need updating, we’ll let you know.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream font-bold text-ink">2</span>
            <div>
              <h3 className="font-bold text-ink">Get your {m.renewal.bonus}</h3>
              <p className={`mt-1 ${text.body}`}>Our thank-you for staying, once your agreement is signed.</p>
            </div>
          </li>
        </ol>
      </AccountCard>
    </>
  );
}

/** Shown once they've told us they're leaving. */
function MovingOut({ m }: { m: Membership }) {
  const { checkOut } = renewalDates(m);
  return (
    <>
      <AccountCard heading="Move-out confirmed">
        <div className="flex flex-col items-start gap-4">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
            <Check strokeWidth={3} />
          </span>
          <p className={text.body}>We’re sad to see you go, but don’t forget, we’d love to have you back any time.</p>
        </div>
      </AccountCard>
      <AccountCard heading="Your check-out" intro={`Your membership ends on ${long.format(checkOut)}. Check-out is by 10:00.`}>
        <Countdown start={new Date(m.checkIn)} label="Until check-out" target={checkOut} passed="Checked out" />
        <p className={`mt-6 ${text.body}`}>
          Changed your mind? Email{" "}
          <a href={`mailto:${RENEWALS_EMAIL}`} className="font-medium text-ink underline underline-offset-4">
            {RENEWALS_EMAIL}
          </a>{" "}
          and we’ll see if your room is still available.
        </p>
      </AccountCard>
    </>
  );
}
