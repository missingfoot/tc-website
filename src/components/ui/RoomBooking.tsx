"use client";

import { useState } from "react";
import type { Cta, RoomDetails, RoomPrice } from "@/lib/types";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { text } from "@/lib/styles";

type RoomBookingProps = {
  /** The lowest weekly price, e.g. "£245": shown as "From …" when the chosen period has no price of its own. */
  price: string;
  /** Prices by membership length, matched to periods like "6 months". */
  prices?: RoomPrice[];
  booking: RoomDetails["booking"];
  cta: Cta;
  /** Sent with the form as hidden fields (a GET form drops any query string in `cta.href`), e.g. { location: "canary-wharf" }. */
  fields?: Record<string, string>;
  className?: string;
};

const pounds = (amount: number) => `£${amount.toLocaleString("en-GB")}`;

/** Price, move-in details, a membership period picker and the apply button. A white card on desktop. */
export default function RoomBooking({ price, prices = [], booking, cta, fields = {}, className = "" }: RoomBookingProps) {
  const [period, setPeriod] = useState(booking.periods[0]);
  // "6 months" → its price; a period without one (e.g. "A short stay") keeps the "From" price
  const chosen = prices.find((p) => `${p.months} months` === period);

  return (
    <div id="booking" className={`lg:rounded-2xl lg:bg-white lg:p-6 lg:shadow-xl lg:shadow-black/10 ${className}`}>
      {chosen ? (
        <>
          <p className="text-2xl font-bold text-ink">{pounds(chosen.weekly)} per week</p>
          <p className="mt-1 text-base text-stone">{pounds(chosen.monthly)} per month</p>
        </>
      ) : (
        <p className="text-2xl font-bold text-ink">From {price} per week</p>
      )}

      <dl className="mt-5 flex flex-col gap-2 text-base">
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Move in</dt>
          <dd className="text-ink">{booking.moveIn}</dd>
        </div>
        {booking.floor && (
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Floor</dt>
            <dd className="text-ink">{booking.floor}</dd>
          </div>
        )}
      </dl>

      {/* A plain GET form: the chosen period goes to the application as ?period=… */}
      <form action={cta.href}>
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <label htmlFor="membership-period" className={`mt-6 block ${text.label}`}>
          Select membership period
        </label>
        <Select id="membership-period" name="period" options={booking.periods} value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-2" />

        <Button type="submit" variant="dark" className="mt-6 w-full justify-center">
          {cta.label}
        </Button>
      </form>
    </div>
  );
}
