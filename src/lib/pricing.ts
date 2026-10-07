// Prices: stored as whole pence with what they're per and how VAT applies, and turned into words
// here, so every price on the site is written the same way and can't disagree with its number.
// Everything that shows or charges a price reads it through these.

/** What a price is for: a night, a week, a month, or once. */
export type PricePer = "night" | "week" | "month" | "once";

/** How VAT applies: included in the amount, added on top (shown as "+VAT"), or not charged. */
export type PriceVat = "included" | "excluded" | "none";

export type PriceItem = {
  label: string;
  /** In pence: £150 is 15000. */
  amount: number;
  per: PricePer;
  vat: PriceVat;
  /** Small print after the period, e.g. "all bills included". */
  note?: string;
};

/** 15000 → "£150"; 106167 → "£1,061.67" (pence only when there are any). */
export function formatPence(pence: number) {
  const pounds = pence / 100;
  return pounds.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/** "£150" → 15000 (for prices written as text, e.g. in the seed's content files). */
export const penceFromText = (text: string) => Math.round(Number(text.replace(/[^\d.]/g, "")) * 100);

/** The line under a price: "Per month +VAT", "Per week, all bills included", "One-off". */
export function periodLine(price: Pick<PriceItem, "per" | "vat" | "note">) {
  const per = price.per === "once" ? "One-off" : `Per ${price.per}`;
  return `${per}${price.vat === "excluded" ? " +VAT" : ""}${price.note ? `, ${price.note}` : ""}`;
}

/** The lowest price, if there are any. */
export const lowest = <T extends { amount: number }>(prices: T[]) => (prices.length ? prices.reduce((a, b) => (b.amount < a.amount ? b : a)) : undefined);

/** A card's pill from its prices: "From £150 per month" (the lowest), or nothing without prices. */
export function fromPill(prices: PriceItem[]) {
  const min = lowest(prices);
  if (!min) return undefined;
  return min.per === "once" ? `From ${formatPence(min.amount)}` : `From ${formatPence(min.amount)} per ${min.per}`;
}
