"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Check, Close } from "@/components/icons";
import { PhoneField, TextField } from "@/components/application/fields";
import { useModalDialog } from "@/hooks/useModalDialog";
import { text } from "@/lib/styles";
import type { EnquiryKind } from "@/lib/types";

export type { EnquiryKind };

const copy = {
  living: {
    title: "Apply now",
    image: { src: "/images/old-oak/promos/friends-chatting.jpg", alt: "Two residents chatting in the lounge" },
  },
  working: {
    title: "Book a free trial day",
    image: { src: "/images/working/spaces/07-communal-tables.jpg", alt: "Members working at the communal tables" },
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

type EnquiryModalProps = {
  kind: EnquiryKind;
  open: boolean;
  onClose: () => void;
};

/**
 * Enquiry form taking over the whole screen: on desktop a rounded photo fills the left half and the
 * form sits in the right; on mobile it's just the form. Shows a
 * thank-you once sent. TODO: send the enquiry somewhere (CRM / email); for now nothing is sent.
 */
export default function EnquiryModal({ kind, open, onClose }: EnquiryModalProps) {
  const ref = useModalDialog(open);
  const uid = useId();
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"tour" | "room">("tour");
  const { title, image } = copy[kind];

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <dialog
      ref={ref}
      aria-label={title}
      tabIndex={-1}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-smooth focus:outline-none open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
    >
      <div className="grid h-full transition-transform duration-500 ease-smooth starting:translate-y-6 motion-reduce:transition-none lg:grid-cols-2">
        {/* Desktop: the photo in a rounded panel filling the left half, inset from the screen edge */}
        <div className="hidden p-6 lg:block">
          <div className="relative h-full overflow-hidden rounded-4xl bg-ink/10">
            <Image src={image.src} alt={image.alt} fill sizes="(min-resolution: 2dppx) 50vw, 100vw" quality={90} className="object-cover" />
          </div>
        </div>

        {/* Top-aligned (not centred), so switching "tour" / "room" doesn't shift the form */}
        <div className="relative overflow-y-auto px-6 pt-20 pb-10 lg:flex lg:flex-col lg:px-16 lg:pt-32 lg:pb-24 xl:px-24">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 flex size-10 items-center justify-center text-ink lg:top-8 lg:right-8">
            <Close />
          </button>

          {sent ? (
            <div className="flex h-full flex-col items-start justify-center gap-6 lg:items-center lg:text-center">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
                <Check strokeWidth={3} />
              </span>
              <h2 className={text.sectionHeading}>Thank you</h2>
              <p className={text.body}>Someone from our team will be in touch shortly.</p>
              <Button variant="dark" onClick={onClose} className="w-full justify-center lg:w-auto lg:min-w-40">
                Done
              </Button>
            </div>
          ) : (
            <>
              <h2 className={text.sectionHeading}>{title}</h2>
              <p className={`mt-4 ${text.body}`}>{intro}</p>

              <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
                {kind === "living" && (
                  <fieldset>
                    <legend className="font-bold text-ink">I want to…</legend>
                    {/* Segmented control: two radios styled as one pill */}
                    <div className="mt-3 inline-flex rounded-full border border-ink/15 p-1">
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
                      {/* Days only once open, so the server and browser agree on "today" */}
                      <Select id={`${uid}-day`} name="day" required placeholder="Pick a day" options={open ? nextDays() : []} className="mt-2" />
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
                  {kind === "working" ? (
                    <TextField id={`${uid}-company`} name="company" label="Company name" autoComplete="organization" />
                  ) : (
                    <TextField id={`${uid}-email`} name="email" label="Email address" type="email" autoComplete="email" required />
                  )}
                </div>

                {kind === "working" && <TextField id={`${uid}-email`} name="email" label="Email address" type="email" autoComplete="email" required />}
                {/* Full width: the country code and number need the room */}
                <PhoneField id={`${uid}-phone`} />

                {kind === "working" && (
                  <div>
                    <label htmlFor={`${uid}-people`} className={`block ${text.label}`}>
                      How many people do you need space for?
                    </label>
                    <Select id={`${uid}-people`} name="people" options={["1", "2", "3", "4", "5", "6–10", "11–20", "More than 20"]} className="mt-2" />
                  </div>
                )}

                <Button type="submit" variant="dark" className="mt-2 w-full justify-center lg:w-auto lg:min-w-40 lg:self-start">
                  {kind === "working" ? "Book my trial day" : mode === "tour" ? "Book a tour" : "Apply now"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
