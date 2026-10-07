"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { RoomPrice } from "@/lib/types";
import { ChevronDown } from "@/components/icons";

type Unit = "week" | "month";

const PricingContext = createContext<{
  months: number;
  setMonths: (months: number) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
} | null>(null);

/** Shares the chosen membership length and unit between the control and the room cards' prices. */
export function RoomPricingProvider({ lengths, children }: { lengths: number[]; children: ReactNode }) {
  const [months, setMonths] = useState(Math.max(...lengths));
  const [unit, setUnit] = useState<Unit>("week");
  return <PricingContext.Provider value={{ months, setMonths, unit, setUnit }}>{children}</PricingContext.Provider>;
}

/** Membership length picker and a weekly/monthly switch, above the room cards. */
export function RoomPricingControl({ lengths }: { lengths: number[] }) {
  const pricing = useContext(PricingContext);
  if (!pricing) return null;
  const { months, setMonths, unit, setUnit } = pricing;

  return (
    // Mobile: the label above a full-width dropdown, then a full-width switch. Desktop: all on one line
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
      <label htmlFor="room-length" className="text-base font-medium text-ink">
        Membership
      </label>
      {/* A pill like the switch beside it, rather than a form field */}
      <div className="relative w-full lg:w-auto">
        <select
          id="room-length"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="h-12 w-full cursor-pointer appearance-none rounded-full bg-white pr-12 pl-5 text-base font-medium text-ink"
        >
          {lengths.map((m) => (
            <option key={m} value={m}>
              {m} months
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink" />
      </div>

      {/* Weekly or monthly prices */}
      <div role="radiogroup" aria-label="Show prices" className="mt-2 flex h-12 w-full rounded-full bg-white p-1 lg:mt-0 lg:ml-3 lg:w-auto">
        {(["week", "month"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={unit === option}
            onClick={() => setUnit(option)}
            className={`min-w-28 flex-1 rounded-full px-5 text-base font-medium transition-colors ${unit === option ? "bg-ink text-white" : "text-ink hover:bg-cream"}`}
          >
            {option === "week" ? "Weekly" : "Monthly"}
          </button>
        ))}
      </div>
    </div>
  );
}

const pounds = (amount: number) => `£${amount.toLocaleString("en-GB")}`;

/** A room's price for the chosen length and unit; `fallback` outside a provider (or for a length it doesn't have). */
export function RoomPriceLabel({ prices, fallback }: { prices: RoomPrice[]; fallback: string }) {
  const pricing = useContext(PricingContext);
  const price = pricing && prices.find((p) => p.months === pricing.months);
  if (!pricing || !price) return <>{fallback}</>;
  return <>{pricing.unit === "week" ? `${pounds(price.weekly)} per week` : `${pounds(price.monthly)} per month`}</>;
}
