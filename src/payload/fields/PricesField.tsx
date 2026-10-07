"use client";

import { Button, useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { formatPence, periodLine, type PriceItem } from "@/lib/pricing";
import type { PricingChange, PricingOwner, PricingRow } from "../endpoints/pricingSheet";

type Kind = "room" | "location";
type Draft = { months?: number; label?: string; amount?: number; per: PriceItem["per"]; vat: PriceItem["vat"] };

const blank = (kind: Kind): Draft => (kind === "room" ? { per: "week", vat: "included" } : { per: "month", vat: "included" });
const toPence = (text: string) => {
  const n = Number(text.replace(/[^\d.]/g, ""));
  return text.trim() === "" || Number.isNaN(n) ? undefined : Math.round(n * 100);
};

/** A row of the Pricing sheet as words, e.g. "12 months £245/wk" or "Hot Desk £150 Per month +VAT". */
const describe = (row: PricingRow) =>
  row.months !== undefined ? `${row.months} months ${formatPence(row.amount)}/wk` : `${row.option} ${formatPence(row.amount)} ${periodLine({ per: row.per ?? "month", vat: row.vat ?? "included", note: row.note })}`;

/**
 * A room's or location's prices in its form, read-only (they're edited on the Pricing page, with
 * every other price), with a link there. A saved one with no prices gets a dialog, once, to copy
 * another's as a starting point or set new ones; after that a "Set up pricing" button opens it.
 * Venues are priced on request, so they're left alone.
 */
export function PricesField({ kind }: { kind: Kind }) {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  const api = `${config.serverURL}${config.routes.api}/pricing-sheet`;
  const type = useFormFields(([fields]) => fields.type?.value as string | undefined);
  const prices = useFormFields(([fields]) => {
    const list: string[] = [];
    const field = kind === "room" ? "rates" : "prices";
    for (let i = 0; fields[`${field}.${i}.${kind === "room" ? "months" : "label"}`]; i++) {
      const amount = Number(fields[`${field}.${i}.${kind === "room" ? "weekly" : "amount"}`]?.value);
      list.push(
        kind === "room"
          ? `${fields[`${field}.${i}.months`]?.value} months ${formatPence(amount)}/wk`
          : `${fields[`${field}.${i}.label`]?.value} ${formatPence(amount)} ${periodLine({ per: (fields[`${field}.${i}.per`]?.value as PriceItem["per"]) ?? "month", vat: (fields[`${field}.${i}.vat`]?.value as PriceItem["vat"]) ?? "included" })}`,
      );
    }
    return list;
  });
  const [open, setOpen] = useState(false);
  const venue = kind === "location" && type === "venue";

  // A saved one without prices: ask, once (per browser session), as soon as it's opened
  useEffect(() => {
    if (!id || venue || prices.length) return;
    const asked = `pricing-asked-${kind}-${id}`;
    try {
      if (sessionStorage.getItem(asked)) return;
      sessionStorage.setItem(asked, "1");
    } catch {
      // Storage blocked: just ask
    }
    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, [id, venue, prices.length, kind]);

  if (venue) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="field-label" style={{ marginBottom: 6 }}>
        {kind === "room" ? "Rates" : "Prices"}
      </div>
      {!id ? (
        <p style={{ margin: 0 }}>Save it first, then set its prices.</p>
      ) : prices.length ? (
        <p style={{ margin: 0 }}>
          {prices.join(" · ")} <Link href="/admin/pricing">Edit on the Pricing page</Link>
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>No prices yet.</span>
          <Button size="small" margin={false} onClick={() => setOpen(true)}>
            Set up pricing
          </Button>
        </div>
      )}
      {open && id && <PricingDialog kind={kind} id={Number(id)} api={api} onClose={() => setOpen(false)} />}
    </div>
  );
}

/** The dialog: copy another room's (or location's) prices, or set new ones; saved through the Pricing page's endpoint. */
function PricingDialog({ kind, id, api, onClose }: { kind: Kind; id: number; api: string; onClose: () => void }) {
  const [sheet, setSheet] = useState<{ rows: PricingRow[]; owners: PricingOwner[] }>();
  const [mode, setMode] = useState<"copy" | "new">("copy");
  const [from, setFrom] = useState<string>();
  const [drafts, setDrafts] = useState<Draft[]>([blank(kind)]);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const prefix = `${kind}:${id}`;

  useEffect(() => {
    fetch(api, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { rows: [], owners: [] }))
      .then(setSheet);
  }, [api]);

  // Others of the same kind with prices (for a location, the same type: working spaces copy working spaces)
  const group = sheet?.owners.find((o) => o.prefix === prefix)?.group;
  const sources = (sheet?.owners ?? []).filter(
    (o) => o.kind === kind && o.prefix !== prefix && o.group === group && sheet!.rows.some((r) => r.key.startsWith(`${o.prefix}:`)),
  );
  const chosen = from ?? sources[0]?.prefix;
  const preview = (sheet?.rows ?? []).filter((r) => chosen && r.key.startsWith(`${chosen}:`));

  async function save() {
    let n = 0;
    const changes: PricingChange[] =
      mode === "copy"
        ? preview.map((r) => ({ key: `${prefix}:new:${++n}`, amount: r.amount, months: r.months, label: r.months === undefined ? r.option : undefined, per: r.per, vat: r.vat, note: r.note }))
        : drafts.filter((d) => d.amount !== undefined).map((d) => ({ key: `${prefix}:new:${++n}`, ...d }));
    if (!changes.length) return setError(mode === "copy" ? "Pick prices to copy." : "Add at least one price.");
    if (changes.some((c) => (kind === "room" ? !c.months : !c.label))) return setError(kind === "room" ? "Every rate needs a length in months." : "Every price needs a name.");
    setSaving(true);
    const res = await fetch(api, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ changes }) });
    if (!res.ok) {
      setSaving(false);
      return setError("Couldn't save: try again, or check you're still signed in.");
    }
    // Reload so the form has the new prices (and doesn't save over them)
    window.location.reload();
  }

  const input: CSSProperties = { padding: "6px 8px", borderRadius: 4, border: "1px solid var(--theme-elevation-150)", background: "var(--theme-input-bg)", color: "var(--theme-text)" };
  const choice = (selected: boolean): CSSProperties => ({ ...input, cursor: "pointer", borderColor: selected ? "var(--theme-text)" : "var(--theme-elevation-150)", background: selected ? "var(--theme-elevation-100)" : "transparent" });
  const setDraft = (i: number, change: Partial<Draft>) => setDrafts((all) => all.map((d, j) => (i === j ? { ...d, ...change } : d)));

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="pricing-dialog-title" style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.5)" }}>
      <div style={{ width: "min(640px, calc(100vw - 32px))", maxHeight: "calc(100vh - 64px)", overflow: "auto", padding: 28, borderRadius: 12, background: "var(--theme-bg)", color: "var(--theme-text)" }}>
        <h2 id="pricing-dialog-title" style={{ margin: "0 0 6px" }}>
          Set up {kind === "room" ? "this room's rates" : "its prices"}
        </h2>
        <p style={{ margin: "0 0 18px", color: "var(--theme-elevation-600)" }}>
          It has no prices yet, so it won’t show a price on its card or page. Start from another one’s, or set new ones. You can change them any time on the Pricing page.
        </p>

        <div role="radiogroup" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button type="button" role="radio" aria-checked={mode === "copy"} style={choice(mode === "copy")} onClick={() => setMode("copy")} disabled={!sources.length}>
            Copy from another
          </button>
          <button type="button" role="radio" aria-checked={mode === "new"} style={choice(mode === "new")} onClick={() => setMode("new")}>
            Set new prices
          </button>
        </div>

        {!sheet ? (
          <p>Loading…</p>
        ) : mode === "copy" ? (
          sources.length ? (
            <>
              <select value={chosen} onChange={(e) => setFrom(e.target.value)} style={{ ...input, width: "100%" }}>
                {sources.map((o) => (
                  <option key={o.prefix} value={o.prefix}>
                    {o.item} ({o.group})
                  </option>
                ))}
              </select>
              <ul style={{ margin: "12px 0 0", paddingLeft: 18 }}>
                {preview.map((r) => (
                  <li key={r.key}>{describe(r)}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>There’s nothing of this kind with prices to copy yet: set new ones.</p>
          )
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {drafts.map((d, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {kind === "room" ? (
                  <>
                    <input inputMode="numeric" placeholder="12" defaultValue={d.months} onBlur={(e) => setDraft(i, { months: Number.parseInt(e.target.value, 10) || undefined })} style={{ ...input, width: 64 }} />
                    months at £
                  </>
                ) : (
                  <input placeholder="e.g. Hot Desk" defaultValue={d.label} onBlur={(e) => setDraft(i, { label: e.target.value.trim() || undefined })} style={{ ...input, flex: 1, minWidth: 140 }} />
                )}
                <input inputMode="decimal" placeholder="0" onBlur={(e) => setDraft(i, { amount: toPence(e.target.value) })} style={{ ...input, width: 96 }} />
                {kind === "room" ? (
                  "a week"
                ) : (
                  <>
                    <select value={d.per} onChange={(e) => setDraft(i, { per: e.target.value as Draft["per"] })} style={input}>
                      <option value="night">per night</option>
                      <option value="week">per week</option>
                      <option value="month">per month</option>
                      <option value="once">one-off</option>
                    </select>
                    <select value={d.vat} onChange={(e) => setDraft(i, { vat: e.target.value as Draft["vat"] })} style={input}>
                      <option value="included">VAT included</option>
                      <option value="excluded">+VAT</option>
                      <option value="none">no VAT</option>
                    </select>
                  </>
                )}
                {drafts.length > 1 && (
                  <button type="button" onClick={() => setDrafts((all) => all.filter((_, j) => j !== i))} style={{ ...input, cursor: "pointer" }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setDrafts((all) => [...all, blank(kind)])} style={{ ...input, alignSelf: "flex-start", cursor: "pointer" }}>
              + Add another
            </button>
          </div>
        )}

        {error && <p style={{ margin: "16px 0 0", color: "var(--theme-error-500)" }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <Button buttonStyle="secondary" margin={false} onClick={onClose} disabled={saving}>
            Later
          </Button>
          <Button margin={false} onClick={save} disabled={saving || !sheet}>
            {saving ? "Saving…" : "Save prices"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** For a room's form. */
export const RoomPrices = () => <PricesField kind="room" />;

/** For a location's form. */
export const LocationPrices = () => <PricesField kind="location" />;
