"use client";

import { useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPence, monthsLabel, periodLine, resolvePrices } from "@/lib/pricing";
import type { PricingData } from "../endpoints/pricingSheet";

type Kind = "room" | "location";

/**
 * A room's or location's prices in its form, read-only: every price is set on the Pricing page
 * (a new one appears there as a row of its kind's grid), so this lists them and links there.
 * Venues are priced on request, so they're left out.
 */
export function PricesField({ kind }: { kind: Kind }) {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  const type = useFormFields(([fields]) => fields.type?.value as string | undefined);
  const roomRates = useFormFields(([fields]) => {
    const list: string[] = [];
    for (let i = 0; fields[`rates.${i}.months`]; i++) list.push(`${monthsLabel(Number(fields[`rates.${i}.months`]?.value))} ${formatPence(Number(fields[`rates.${i}.weekly`]?.value))}/wk`);
    return list;
  });
  const [locationPrices, setLocationPrices] = useState<string[]>();

  // A location's prices come from its type's plans (its own price or the standard one), so ask the Pricing page's endpoint
  useEffect(() => {
    if (kind !== "location" || !id || (type !== "working" && type !== "serviced")) return;
    fetch(`${config.serverURL}${config.routes.api}/pricing-sheet`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((data: PricingData | undefined) => {
        const grid = data?.[type];
        const row = grid?.rows.find((r) => String(r.id) === String(id));
        setLocationPrices(resolvePrices(row?.prices, grid?.plans).map((p) => `${p.label} ${formatPence(p.amount)} ${periodLine(p)}`));
      });
  }, [kind, id, type, config.serverURL, config.routes.api]);

  if (kind === "location" && type === "venue") return null;
  const prices = kind === "room" ? roomRates : locationPrices;
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="field-label" style={{ marginBottom: 6 }}>
        {kind === "room" ? "Rates" : "Prices"}
      </div>
      <p style={{ margin: 0 }}>
        {!id ? "Once it's saved, it appears on the Pricing page to set its prices." : prices === undefined ? "…" : prices.length ? prices.join(" · ") : "No prices yet."}{" "}
        {id && <Link href="/admin/pricing">{prices?.length ? "Edit on the Pricing page" : "Set them on the Pricing page"}</Link>}
      </p>
    </div>
  );
}

/** For a room's form. */
export const RoomPrices = () => <PricesField kind="room" />;

/** For a location's form. */
export const LocationPrices = () => <PricesField kind="location" />;
