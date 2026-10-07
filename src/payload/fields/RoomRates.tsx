"use client";

import { useFormFields } from "@payloadcms/ui";
import Link from "next/link";
import { formatPence } from "@/lib/pricing";

/**
 * A room's rates in its form, read-only: they're edited, added and removed on the Pricing page,
 * with every other price, so this lists them and links there.
 */
export function RoomRates() {
  const rates = useFormFields(([fields]) => {
    const list: { months: number; weekly: number }[] = [];
    for (let i = 0; fields[`rates.${i}.months`]; i++) list.push({ months: Number(fields[`rates.${i}.months`]?.value), weekly: Number(fields[`rates.${i}.weekly`]?.value) });
    return list;
  });
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="field-label" style={{ marginBottom: 6 }}>
        Rates
      </div>
      <p style={{ margin: 0 }}>
        {rates.length ? rates.map((r) => `${r.months} months ${formatPence(r.weekly)}/wk`).join(" · ") : "No rates yet."}{" "}
        <Link href="/admin/pricing">Edit on the Pricing page</Link>
      </p>
    </div>
  );
}
