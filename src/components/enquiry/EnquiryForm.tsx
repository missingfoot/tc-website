"use client";

import Photo from "@/components/ui/Photo";
import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import Select from "@/components/ui/Select";
import { Check } from "@/components/icons";
import { PhoneField, TextField } from "@/components/application/fields";
import BackButton from "./BackButton";
import { venueOptions } from "@/content/events";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";
import type { EnquiryKind } from "@/lib/types";


const copy = {
  living: {
    title: "Apply now",
    image: { src: "/images/old-oak/promos/friends-chatting.jpg", alt: "Two residents chatting in the lounge" },
  },
  working: {
    title: "Book a free trial day",
    image: { src: "/images/working/spaces/07-communal-tables.jpg", alt: "Members working at the communal tables" },
  },
  events: {
    title: "Make an enquiry",
    image: { src: "/images/event-spaces/the-exchange/01-lounge.jpg", alt: "The Exchange set up for an event" },
  },
  serviced: {
    title: "Book a viewing",
    image: { src: "/images/serviced-living/notting-hill/02-studio-kitchen.jpg", alt: "A Notting Hill studio with its kitchen" },
  },
};

const intro = "We can’t wait to show you around. Fill in the form and we’ll get back to you as soon as we can.";

/** Tour slots, every half hour. TODO: real opening hours and availability. */
const times = Array.from({ length: 17 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

/** The next two weeks, e.g. "Monday 26 February". */
function nextDays() {
  const format = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return Array.from({ length: 14 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i + 1);
    return format.format(day);
  });
}

/** Where Back goes when the page was opened directly (no page of ours to go back to). */
const fallbacks: Record<EnquiryKind, string> = { living: "/co-living", working: "/working", serviced: "/serviced-living", events: "/event-spaces" };

// True in the browser, false while rendering on the server (so the server and browser agree on "today")
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

/**
 * An enquiry page: on desktop a rounded photo fills the left half (fixed in place) and the form
 * sits on the right; on mobile it's just the form. A Back button returns to the page the visitor
 * came from. Shows a thank-you once sent.
 * TODO: send the enquiry somewhere (CRM / email); for now nothing is sent.
 */
type EnquiryFormProps = {
  kind: EnquiryKind;
  /** Pre-selected venue (event enquiries). */
  venue?: string;
  /** Referral code from a friend's link (co-living), sent with the enquiry. */
  referral?: string;
};

export default function EnquiryForm({ kind, venue, referral }: EnquiryFormProps) {
  const uid = useId();
  const isClient = useIsClient();
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"tour" | "room">("tour");
  const { title, image } = copy[kind];

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Desktop: the photo in a rounded panel filling the left half, inset from the screen edge.
          Lazy (with high priority) rather than preloaded, so phones, where it's hidden, skip it */}
      <div className="hidden p-6 lg:sticky lg:top-0 lg:block lg:h-dvh">
        <div className="relative h-full overflow-hidden rounded-4xl bg-ink/10">
          <Photo src={image.src} alt={image.alt} fetchPriority="high" sizes={sizes2x([null, "50vw"])} quality={90} className="object-cover" />
        </div>
      </div>

      <div className="px-6 pt-6 pb-16 lg:px-16 lg:pt-10 lg:pb-24 xl:px-24">
        <BackButton fallback={fallbacks[kind]} />

        <div className="mt-10 lg:mt-20">
          {sent ? (
            <div className="flex flex-col items-start gap-6">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
                <Check strokeWidth={3} />
              </span>
              <h1 className={text.sectionHeading}>Thank you</h1>
              <p className={text.body}>Someone from our team will be in touch shortly.</p>
              <BackButton fallback={fallbacks[kind]} label="Done" icon={false} variant="dark" className="w-full justify-center lg:w-auto lg:min-w-40" />
            </div>
          ) : (
            <>
              <h1 className={text.sectionHeading}>{title}</h1>
              <p className={`mt-4 ${text.body}`}>{intro}</p>

              {referral && (
                <InfoBox tone="success" className="mt-6">
                  <span className="font-bold">A friend referred you.</span> Move in for 9 months or more and you’ll get up to £200 off your rent.
                </InfoBox>
              )}

              <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
                {referral && <input type="hidden" name="referral" value={referral} />}
                {kind === "living" && (
                  <fieldset>
                    {/* Hidden label: the options speak for themselves, but screen readers still need it */}
                    <legend className="sr-only">I want to…</legend>
                    {/* Segmented control: two radios styled as one pill */}
                    <div className="inline-flex rounded-full border border-ink/15 p-1">
                      {(
                        [
                          ["tour", "Arrange a tour"],
                          ["room", "Apply for a room"],
                        ] as const
                      ).map(([value, label]) => (
                        <label
                          key={value}
                          className="cursor-pointer rounded-full px-5 py-2 text-base font-medium text-stone transition has-checked:bg-ink has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-ink has-focus-visible:ring-offset-2"
                        >
                          <input type="radio" name="enquiry" value={value} checked={mode === value} onChange={() => setMode(value)} className="sr-only" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {kind === "living" && mode === "tour" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-day`} className={`block ${text.label}`}>
                        Choose a day
                      </label>
                      <Select id={`${uid}-day`} name="day" required placeholder="Pick a day" options={isClient ? nextDays() : []} className="mt-2" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-time`} className={`block ${text.label}`}>
                        Choose a time
                      </label>
                      <Select id={`${uid}-time`} name="time" required placeholder="Pick a time" options={times} className="mt-2" />
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <TextField id={`${uid}-name`} name="name" label="Full name" autoComplete="name" required />
                  {kind === "working" || kind === "events" ? (
                    <TextField id={`${uid}-company`} name="company" label={kind === "events" ? "Company (optional)" : "Company name"} autoComplete="organization" />
                  ) : (
                    <TextField id={`${uid}-email`} name="email" label="Email address" type="email" autoComplete="email" required />
                  )}
                </div>

                {(kind === "working" || kind === "events") && <TextField id={`${uid}-email`} name="email" label="Email address" type="email" autoComplete="email" required />}
                {/* Full width: the country code and number need the room */}
                <PhoneField id={`${uid}-phone`} />

                {kind === "events" && (
                  <>
                    <div>
                      <label htmlFor={`${uid}-venue`} className={`block ${text.label}`}>
                        Venue
                      </label>
                      <Select
                        id={`${uid}-venue`}
                        name="venue"
                        defaultValue={venue && venueOptions.some((o) => o.value === venue) ? venue : "not-sure"}
                        options={[...venueOptions, { value: "not-sure", label: "Not sure yet" }]}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <TextField id={`${uid}-date`} name="date" label="Event date" type="date" required />
                      <TextField id={`${uid}-guests`} name="guests" label="Number of guests" type="number" inputMode="numeric" min={1} required />
                    </div>
                  </>
                )}

                {kind === "serviced" && (
                  <TextField
                    id={`${uid}-offer`}
                    name="offer"
                    label="Do you have an offer code or are you being referred? (optional)"
                    placeholder="Offer code or the name of who referred you"
                  />
                )}

                {kind === "working" && (
                  <div>
                    <label htmlFor={`${uid}-people`} className={`block ${text.label}`}>
                      How many people do you need space for?
                    </label>
                    <Select id={`${uid}-people`} name="people" options={["1", "2", "3", "4", "5", "6–10", "11–20", "More than 20"]} className="mt-2" />
                  </div>
                )}

                <Button type="submit" variant="dark" className="mt-2 w-full justify-center lg:w-auto lg:min-w-40 lg:self-start">
                  {kind === "working" ? "Book my trial day" : kind === "serviced" ? "Book my viewing" : kind === "events" ? "Send enquiry" : mode === "tour" ? "Book a tour" : "Apply now"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
