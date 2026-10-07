"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useModalDialog } from "@/hooks/useModalDialog";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import StickyBar from "@/components/ui/StickyBar";
import { Check } from "@/components/icons";
import { formatMoney, nationalities, paymentPlans, periodMonths, roomCosts, type ApplicationRoom } from "@/lib/application";
import { text } from "@/lib/styles";
import ApplicationStep, { type StepState } from "./ApplicationStep";
import ApplicationSummary from "./ApplicationSummary";
import DateOfBirth from "./DateOfBirth";
import { Details, PhoneField, RadioGroup, TextField } from "./fields";

type Answers = Record<string, string>;
const STEPS = ["Contact details", "Personal information", "Payment plan", "Payment"] as const;

/** Reads a submitted step form into plain strings. */
const formValues = (form: HTMLFormElement): Answers =>
  Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value)]));

/** The step's primary button: right-aligned on desktop, full width on mobile. */
function StepSubmit({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 flex lg:justify-end">
      <Button type="submit" variant="dark" className="w-full justify-center lg:w-auto lg:min-w-40">
        {children}
      </Button>
    </div>
  );
}

/**
 * The room application: four steps on the left (one open at a time; finished ones collapse to
 * their answers with an "Edit" button) and the room summary beside them. On mobile the summary
 * opens from a bar pinned to the bottom of the screen. Each step is a real <form>, so the
 * browser checks required fields before moving on.
 *
 * TODO: nothing is sent anywhere yet. Submitting the last step should create the application and
 * take the payment (e.g. Stripe Elements in place of the card fields).
 */
export default function RoomApplication({ room }: { room: ApplicationRoom }) {
  const [answers, setAnswers] = useState<Answers[]>([{}, {}, {}, {}]);
  const [done, setDone] = useState([false, false, false, false]);
  const [active, setActive] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const costs = roomCosts(room.weeklyPrice, room.rules);
  const plans = paymentPlans(room.weeklyPrice, periodMonths(room.period), room.rules);
  const [contact, personal, planAnswers] = answers;
  const plan = plans.find((p) => p.id === planAnswers.plan);

  const complete = (step: number) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextAnswers = answers.map((a, i) => (i === step ? formValues(e.currentTarget) : a));
    const nextDone = done.map((d, i) => d || i === step);
    setAnswers(nextAnswers);
    setDone(nextDone);
    if (step === STEPS.length - 1) {
      setSubmitted(true);
      return;
    }
    // Carry on with the first step that still needs doing
    const next = nextDone.findIndex((d) => !d);
    setActive(next);
    // Bring the next step's heading into view (after it renders)
    requestAnimationFrame(() => document.getElementById(`step-${next + 1}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const stateOf = (step: number): StepState => (step === active ? "active" : done[step] ? "done" : "upcoming");
  const edit = (step: number) => () => setActive(step);

  // Once the confirmation replaces the steps, start it from the top of the page. Done after it has
  // rendered (and instantly): scrolling while the much longer form was still there left people at the bottom.
  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: "instant" });
  }, [submitted]);

  if (submitted)
    return (
      <div className="grid items-start gap-16 lg:grid-cols-[1fr_24rem] lg:gap-x-12 xl:gap-x-16">
        <Confirmation room={room} answers={answers} />
        <aside aria-label="Next step" className="lg:sticky lg:top-28">
          <NextStep />
        </aside>
      </div>
    );

  return (
    <>
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_24rem] lg:gap-x-12 lg:gap-y-6 xl:gap-x-16">
        <div className="flex flex-col gap-16 lg:gap-6">
          <ApplicationStep number={1} total={4} title={STEPS[0]} state={stateOf(0)} onEdit={edit(0)}>
            {stateOf(0) === "active" ? (
              <form onSubmit={complete(0)} className="flex flex-col gap-6">
                <TextField id="firstName" label="First name" autoComplete="given-name" required defaultValue={contact.firstName} />
                <TextField id="lastName" label="Last name" autoComplete="family-name" required defaultValue={contact.lastName} />
                <TextField id="email" label="Email" type="email" autoComplete="email" required defaultValue={contact.email} />
                <PhoneField id="mobile" label="Mobile number (only used about your booking)" defaultValue={contact} />
                <StepSubmit>Next</StepSubmit>
              </form>
            ) : (
              done[0] && (
                <Details
                  rows={[
                    ["First name", contact.firstName],
                    ["Last name", contact.lastName],
                    ["Email", contact.email],
                    ["Mobile number", `${contact.dialCode} ${contact.mobile}`],
                  ]}
                />
              )
            )}
          </ApplicationStep>

          <ApplicationStep number={2} total={4} title={STEPS[1]} state={stateOf(1)} onEdit={edit(1)}>
            {stateOf(1) === "active" ? (
              <form onSubmit={complete(1)} className="flex flex-col gap-8">
                <p className={text.body}>
                  We ask for this as part of our affordability check, and we keep it safe. Read more in our{" "}
                  <Link href="/privacy" className="font-medium text-ink underline underline-offset-4">
                    privacy policy
                  </Link>
                  .
                </p>
                <DateOfBirth defaultValue={personal.day ? { day: personal.day, month: personal.month, year: personal.year } : undefined} />
                <RadioGroup legend="What is your gender?" name="gender" options={["Female", "Male", "Other"]} defaultValue={personal.gender} />
                <div>
                  <label htmlFor="nationality" className={`block ${text.label}`}>
                    Nationality
                  </label>
                  <Select id="nationality" name="nationality" required placeholder="Choose one…" options={nationalities} defaultValue={personal.nationality} className="mt-2" />
                </div>
                <RadioGroup legend="Do you need a visa to stay in the UK?" name="visa" options={["Yes", "No"]} defaultValue={personal.visa} />
                <RadioGroup legend="Are you a student?" name="student" options={["Yes", "No"]} defaultValue={personal.student} />
                <StepSubmit>Next</StepSubmit>
              </form>
            ) : (
              done[1] && (
                <Details
                  rows={[
                    ["Date of birth", `${personal.day.padStart(2, "0")}/${personal.month.padStart(2, "0")}/${personal.year}`],
                    ["Gender", personal.gender],
                    ["Nationality", personal.nationality],
                    ["Visa needed", personal.visa],
                    ["Student", personal.student],
                  ]}
                />
              )
            )}
          </ApplicationStep>

          <ApplicationStep number={3} total={4} title={STEPS[2]} state={stateOf(2)} onEdit={edit(2)} editLabel="Change plan">
            {stateOf(2) === "active" ? (
              <form onSubmit={complete(2)} className="flex flex-col gap-8">
                <TextField
                  id="salary"
                  label="What is your annual salary? (GBP)"
                  inputMode="numeric"
                  pattern="[0-9,]+"
                  title="Numbers only, e.g. 32,000"
                  placeholder="e.g. 32,000"
                  required
                  defaultValue={planAnswers.salary}
                />

                <div className="rounded-xl bg-cream p-6">
                  <h3 className="text-xl font-bold leading-heading text-ink">Please note</h3>
                  <dl className="mt-4 flex flex-col gap-4">
                    <div>
                      <dt className="font-medium text-ink">What you pay today</dt>
                      <dd className={`mt-1 ${text.body}`}>A holding deposit (one week’s licence fee) and a membership joining fee.</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">If your application is successful</dt>
                      <dd className={`mt-1 ${text.body}`}>
                        You’ll sign a licence agreement and pay the rest of your security bond before you move in. Your holding deposit becomes part of
                        that bond, held on trust for you until the end of your membership.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink">If you cancel</dt>
                      <dd className={`mt-1 ${text.body}`}>
                        The holding deposit isn’t refundable if you cancel before signing your membership agreement. See our{" "}
                        <Link href="/terms" className="font-medium text-ink underline underline-offset-4">
                          terms &amp; conditions
                        </Link>
                        .
                      </dd>
                    </div>
                  </dl>
                </div>

                <fieldset>
                  <legend className={text.label}>Choose your payment plan</legend>
                  <div className="mt-3 flex flex-col gap-4">
                    {plans.map((option) => (
                      <label
                        key={option.id}
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink/15 bg-white transition has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:ring-2 has-focus-visible:ring-ink"
                      >
                        <input type="radio" name="plan" value={option.id} required defaultChecked={option.id === planAnswers.plan} className="sr-only" />
                        <span className="flex flex-col gap-1 px-5 pt-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                          <span className="text-lg font-bold text-ink">{option.name}</span>
                          <span className="text-base font-medium text-ink">{option.headline}</span>
                        </span>
                        <ul className="flex flex-col gap-1 px-5 pt-3 pb-5 text-sm leading-relaxed text-stone">
                          {option.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                        <span className="flex items-center justify-center gap-2 border-t border-ink/10 py-3 text-base font-bold text-ink group-has-checked:bg-ink group-has-checked:text-white">
                          <Check className="hidden group-has-checked:block" />
                          <span className="group-has-checked:hidden">Select plan</span>
                          <span className="hidden group-has-checked:inline">Selected</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <TextField id="referral" label="Referral code (optional)" placeholder="Get one from a friend who’s a member" defaultValue={planAnswers.referral} />
                <StepSubmit>Next</StepSubmit>
              </form>
            ) : (
              plan && (
                <Details
                  split
                  rows={[
                    ["Plan", `${plan.name}: ${plan.headline}`],
                    [plan.id === "upfront" ? "Licence fee (in full)" : "First month’s licence fee", formatMoney(plan.licenceFee, true)],
                    ["Security bond", formatMoney(plan.securityBond, true)],
                    ["Holding deposit (paid today)", `−${formatMoney(costs.holdingDeposit, true)}`],
                    ...(planAnswers.referral ? [["Referral code", planAnswers.referral] as [string, string]] : []),
                    [
                      <span key="total" className="font-bold text-ink">
                        To pay once you’re verified
                      </span>,
                      <span key="amount" className="font-bold">
                        {formatMoney(plan.licenceFee + plan.securityBond - costs.holdingDeposit, true)}
                      </span>,
                    ],
                  ]}
                />
              )
            )}
          </ApplicationStep>

          <ApplicationStep number={4} total={4} title={STEPS[3]} state={stateOf(3)}>
            <PaymentForm total={costs.dueToday} onSubmit={complete(3)} />
          </ApplicationStep>
        </div>

        <aside aria-label="Your room" className="hidden lg:sticky lg:top-28 lg:block">
          <ApplicationSummary room={room} />
        </aside>
      </div>

      <StickyBar title={room.name} subtitle={`Total today ${formatMoney(costs.dueToday, true)}`}>
        <Button variant="outline" onClick={() => setSummaryOpen(true)}>
          Show info
        </Button>
      </StickyBar>
      <SummarySheet room={room} open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </>
  );
}

/** Step 4: card or in-person payment, terms, and the button that sends the application. */
function PaymentForm({ total, onSubmit }: { total: number; onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [method, setMethod] = useState("Card payment");
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <fieldset>
        <legend className={text.label}>Payment method</legend>
        <div className="mt-3 flex flex-col gap-3">
          {["Card payment", "Pay in person"].map((option) => (
            <label key={option} className="flex w-fit cursor-pointer items-center gap-3 text-base text-ink">
              <input type="radio" name="method" value={option} checked={method === option} onChange={() => setMethod(option)} className="size-5 accent-ink" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {method === "Card payment" ? (
        // Stand-in card fields (never sent anywhere): to be replaced by the payment provider's own fields
        <fieldset>
          <legend className={text.label}>Card details</legend>
          <div className="mt-2 grid grid-cols-[1fr_6rem_5rem] rounded-xl border border-ink/15 bg-white focus-within:border-ink">
            <input aria-label="Card number" autoComplete="cc-number" inputMode="numeric" placeholder="Card number" required pattern="[\d ]{12,23}" className="h-12 min-w-0 rounded-l-xl bg-transparent px-4 text-base text-ink placeholder:text-stone focus:outline-none" />
            <input aria-label="Expiry date" autoComplete="cc-exp" placeholder="MM / YY" required pattern="\d{2} ?/ ?\d{2}" className="h-12 min-w-0 bg-transparent px-2 text-base text-ink placeholder:text-stone focus:outline-none" />
            <input aria-label="Security code" autoComplete="cc-csc" inputMode="numeric" placeholder="CVC" required pattern="\d{3,4}" className="h-12 min-w-0 rounded-r-xl bg-transparent px-2 text-base text-ink placeholder:text-stone focus:outline-none" />
          </div>
        </fieldset>
      ) : (
        <p className={text.body}>We’ll be in touch to arrange paying the {formatMoney(total, true)} in person.</p>
      )}

      <div className="flex flex-col gap-4">
        <Checkbox name="terms" required>
          I have read and agree to the{" "}
          <Link href="/terms" className="font-medium underline underline-offset-4">
            terms &amp; conditions
          </Link>
        </Checkbox>
        <p className={text.body}>
          By completing your application you agree to our{" "}
          <Link href="/privacy" className="font-medium text-ink underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </div>

      <StepSubmit>{method === "Card payment" ? `Pay ${formatMoney(total, true)} and apply` : "Send application"}</StepSubmit>
    </form>
  );
}

/**
 * Mobile: the room summary as a full-screen page over the application, with a bottom bar
 * matching the page's own ("Show info" becomes "Hide info").
 */
function SummarySheet({ room, open, onClose }: { room: ApplicationRoom; open: boolean; onClose: () => void }) {
  const ref = useModalDialog(open);

  // The sheet is mobile-only (lg:hidden). If the screen widens while it's open (e.g. an iPad
  // rotated to landscape) it would stay open but invisible, blocking the form; so close it.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => desktop.matches && onClose();
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      aria-label="Your room"
      onClose={onClose}
      tabIndex={-1}
      // Fades in and out (display/overlay transition discretely so the exit can play). Only opacity
      // here: a transform on the dialog would unpin the fixed bar inside it, so the slide is on the content.
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-white p-0 pb-28 opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-smooth focus:outline-none open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none lg:hidden"
    >
      <div className="transition-transform duration-500 ease-smooth starting:translate-y-6 motion-reduce:transition-none">
        <ApplicationSummary room={room} fullScreen />
      </div>
      <StickyBar title={room.name} subtitle={`Total today ${formatMoney(roomCosts(room.weeklyPrice, room.rules).dueToday, true)}`}>
        <Button variant="outline" onClick={onClose}>
          Hide info
        </Button>
      </StickyBar>
    </dialog>
  );
}

/** Shown in place of the steps once the application is sent: everything entered, and what was paid. */
function Confirmation({ room, answers }: { room: ApplicationRoom; answers: Answers[] }) {
  const [contact, personal, planAnswers, payment] = answers;
  const costs = roomCosts(room.weeklyPrice, room.rules);
  const plan = paymentPlans(room.weeklyPrice, periodMonths(room.period), room.rules).find((p) => p.id === planAnswers.plan);
  const paidByCard = payment.method === "Card payment";

  const block = (heading: string, rows: [ReactNode, ReactNode][]) => (
    <div className="border-t border-ink/10 py-6">
      <h3 className="font-bold text-ink">{heading}</h3>
      <div className="mt-3">
        <Details rows={rows} />
      </div>
    </div>
  );

  return (
    <div className="lg:rounded-2xl lg:bg-white lg:p-10 lg:shadow-xl lg:shadow-black/5">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage">
        <Check strokeWidth={3} />
      </span>
      <h2 className={`mt-6 ${text.subheading}`}>{paidByCard ? "Payment successful" : "Application sent"}</h2>
      <p className={`mt-3 ${text.body}`}>
        {paidByCard ? "Your holding deposit and joining fee have been paid." : `We’ll be in touch to arrange paying the ${formatMoney(costs.dueToday, true)} in person.`} We’ve sent a
        confirmation to <span className="font-medium text-ink">{contact.email}</span>.
      </p>

      <div className="mt-8">
        {block("Your room", [
          ["Room", room.name],
          ["Location", room.location],
          ["Membership", room.period],
          ["Move in", room.moveIn],
        ])}
        {block("Your details", [
          ["Name", `${contact.firstName} ${contact.lastName}`],
          ["Email", contact.email],
          ["Mobile number", `${contact.dialCode} ${contact.mobile}`],
          ["Nationality", personal.nationality],
        ])}
        {plan &&
          block("Payment plan", [
            ["Plan", `${plan.name}: ${plan.headline}`],
            ["Security bond", formatMoney(plan.securityBond, true)],
            ...(planAnswers.referral ? [["Referral code", planAnswers.referral] as [string, string]] : []),
          ])}
        {block(paidByCard ? "You’ve paid" : "To pay in person", [
          ["Holding deposit", formatMoney(costs.holdingDeposit, true)],
          ["Joining fee", formatMoney(costs.joiningFee, true)],
        ])}
        <p className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-6 text-2xl font-bold text-ink">
          <span>{paidByCard ? "Total paid" : "Total to pay"}</span>
          <span>{formatMoney(costs.dueToday, true)}</span>
        </p>
      </div>

      <Button variant="outline" onClick={() => window.print()} className="mt-10 w-full justify-center lg:w-auto">
        Print receipt
      </Button>
    </div>
  );
}

const nextSteps = [
  {
    title: "Send your documents",
    text: "Within 10 days, or at least a day before you move in if that’s sooner. Otherwise we can’t guarantee your room.",
  },
  { title: "Pay your first instalment", text: "Once we’ve verified your documents." },
  { title: "Get your contract", text: "We’ll send it to you, and your booking is confirmed." },
];

/**
 * Beside the confirmation: what happens next (documents, first payment, contract).
 * TODO: link "Start verification now" to the verification flow.
 */
function NextStep() {
  return (
    <div className="border-t border-ink/10 pt-12 lg:rounded-2xl lg:border-0 lg:bg-white lg:p-8 lg:shadow-xl lg:shadow-black/10">
      <h2 className={text.subheading}>Next steps</h2>
      <p className={`mt-3 ${text.body}`}>Your room is reserved. To turn your reservation into a booking:</p>
      <ol className="mt-6 flex flex-col gap-6">
        {nextSteps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-base font-bold text-ink">
              {i + 1}
            </span>
            <div>
              <h3 className="font-bold text-ink">{step.title}</h3>
              <p className={`mt-1 ${text.body}`}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button href="#" variant="dark" className="mt-8 w-full justify-center">
        Start verification now
      </Button>
    </div>
  );
}
