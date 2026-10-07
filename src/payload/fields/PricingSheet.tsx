"use client";

import { Button, useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { PricingChange, PricingRow } from "../endpoints/pricingSheet";

const PER = { night: "Per night", week: "Per week", month: "Per month", once: "One-off" } as const;
const VAT = { included: "Included", excluded: "+VAT", none: "Not charged" } as const;

const pounds = (pence: number) => (pence / 100).toFixed(2).replace(/\.00$/, "");
const toPence = (text: string) => {
  const n = Number(text.replace(/[^\d.]/g, ""));
  return text.trim() === "" || Number.isNaN(n) ? undefined : Math.round(n * 100);
};

/** One CSV cell, quoted when it needs to be. */
const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** CSV text as rows of cells (quoted cells may hold commas, quotes and line breaks). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const endRow = () => {
    row.push(cell);
    rows.push(row);
    row = [];
    cell = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endRow();
    } else cell += c;
  }
  if (cell || row.length) endRow();
  return rows.filter((r) => r.some((c) => c.trim()));
}

const HEADERS = ["Key", "Group", "Item", "Option", "Price (£)", "Per", "VAT", "Small print"];

/**
 * The admin's Pricing page: every price on the site in one table, edited in place (changes are
 * highlighted and saved together), downloaded as a CSV for Excel, or uploaded back from one. Rows
 * match by their Key column, so a re-sorted sheet still lands on the right prices. Adding or
 * removing a price is done on its room or location.
 */
export function PricingSheet() {
  const { config } = useConfig();
  const api = `${config.serverURL}${config.routes.api}/pricing-sheet`;
  const [rows, setRows] = useState<PricingRow[]>();
  const [edits, setEdits] = useState<Record<string, PricingChange>>({});
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(api, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setRows)
      .catch(() => setRows([]));
  }, [api]);

  /** A row with its pending edit applied. */
  const current = (row: PricingRow): PricingRow => ({ ...row, ...edits[row.key] }) as PricingRow;
  const changed = (row: PricingRow, field: keyof PricingChange) => edits[row.key]?.[field] !== undefined && edits[row.key]?.[field] !== row[field];

  const edit = (row: PricingRow, change: Omit<PricingChange, "key">) =>
    setEdits((all) => {
      const next = { ...all[row.key], ...change, key: row.key };
      // Drop fields set back to what's saved, and the edit if nothing's left
      for (const field of ["amount", "per", "vat", "note"] as const) if (next[field] === row[field] || (field === "note" && (next.note ?? "") === (row.note ?? ""))) delete next[field];
      const rest = { ...all };
      delete rest[row.key];
      return Object.keys(next).length > 1 ? { ...rest, [row.key]: next } : rest;
    });

  const pending = Object.values(edits);
  const shown = useMemo(() => {
    const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
    return (rows ?? []).filter((row) => words.every((w) => `${row.group} ${row.item} ${row.option}`.toLowerCase().includes(w)));
  }, [rows, filter]);

  async function save() {
    setSaving(true);
    const res = await fetch(api, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ changes: pending }) });
    setSaving(false);
    if (!res.ok) return setMessage("Couldn't save: try again, or check you're still signed in.");
    const { saved, rows: fresh } = (await res.json()) as { saved: number; rows: PricingRow[] };
    setRows(fresh);
    setEdits({});
    setMessage(`Saved ${saved} price${saved === 1 ? "" : "s"}. Pages using them update now.`);
  }

  function download() {
    const lines = [HEADERS, ...(rows ?? []).map((r) => [r.key, r.group, r.item, r.option, pounds(r.amount), r.per ? PER[r.per] : "", r.vat ? VAT[r.vat] : "", r.note ?? ""])];
    const blob = new Blob([lines.map((l) => l.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `prices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.files?.[0];
    e.target.value = "";
    if (!input || !rows) return;
    const [header, ...lines] = parseCsv(await input.text());
    const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
    const [k, price, per, vat, note] = [col("Key"), col("Price (£)"), col("Per"), col("VAT"), col("Small print")];
    if (k < 0 || price < 0) return setMessage("That file needs a Key and a Price (£) column: start from Download CSV.");
    const byKey = new Map(rows.map((r) => [r.key, r]));
    const fromLabel = <T extends string>(labels: Record<T, string>, text?: string) => (Object.entries(labels) as [T, string][]).find(([, label]) => label === text?.trim())?.[0];
    let loaded = 0;
    let unknown = 0;
    const next = { ...edits };
    for (const line of lines) {
      const row = byKey.get(line[k]?.trim());
      if (!row) {
        unknown++;
        continue;
      }
      const change: PricingChange = { key: row.key };
      const amount = toPence(line[price] ?? "");
      if (amount !== undefined && amount !== row.amount) change.amount = amount;
      if (row.vat) {
        const p = fromLabel(PER, line[per]);
        const v = fromLabel(VAT, line[vat]);
        if (p && p !== row.per) change.per = p;
        if (v && v !== row.vat) change.vat = v;
        if (note >= 0 && (line[note] ?? "").trim() !== (row.note ?? "")) change.note = (line[note] ?? "").trim();
      }
      if (Object.keys(change).length > 1) {
        next[row.key] = change;
        loaded++;
      }
    }
    setEdits(next);
    setMessage(
      `${loaded} change${loaded === 1 ? "" : "s"} loaded from ${input.name}: they're highlighted below. Nothing's saved until you press Save.` +
        (unknown ? ` ${unknown} row${unknown === 1 ? "" : "s"} didn't match a price and were skipped.` : ""),
    );
  }

  const cell = { padding: "6px 10px", borderBottom: "1px solid var(--theme-elevation-100)", textAlign: "left", verticalAlign: "middle" } as const;
  const changedStyle = { background: "var(--theme-warning-100, #fff4d6)" };
  const input = { width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--theme-elevation-150)", background: "var(--theme-input-bg)", color: "var(--theme-text)" } as const;

  return (
    <div style={{ paddingBottom: 64 }}>
      <h1 style={{ margin: "24px 0 8px" }}>Pricing</h1>
      <p style={{ margin: "0 0 20px", maxWidth: 720, color: "var(--theme-elevation-600)" }}>
        Every price on the site: rooms’ rates, locations’ prices, the joining fee and money variables. Edit them here, or download a CSV, update it in Excel and upload it. Changes are highlighted and
        only saved when you press Save; cards, pages and sentences using a price follow it. To add or remove a price, open its room or location.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <input type="search" placeholder="Filter, e.g. studio or working" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...input, width: 280 }} />
        <Button buttonStyle="secondary" size="small" margin={false} onClick={download} disabled={!rows?.length}>
          Download CSV
        </Button>
        <Button buttonStyle="secondary" size="small" margin={false} onClick={() => file.current?.click()} disabled={!rows?.length}>
          Upload CSV
        </Button>
        <input ref={file} type="file" accept=".csv,text/csv" onChange={upload} hidden />
        <span style={{ flex: 1 }} />
        {pending.length > 0 && (
          <>
            <span>
              {pending.length} change{pending.length === 1 ? "" : "s"} waiting
            </span>
            <Button buttonStyle="secondary" size="small" margin={false} onClick={() => setEdits({})} disabled={saving}>
              Discard
            </Button>
            <Button size="small" margin={false} onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        )}
      </div>
      {message && <p style={{ margin: "0 0 16px", padding: "10px 14px", borderRadius: 6, background: "var(--theme-elevation-50)" }}>{message}</p>}

      {rows === undefined ? (
        <p>Loading prices…</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              {["Item", "Option", "Price", "Per", "VAT", "Small print", ""].map((h) => (
                <th key={h} style={{ ...cell, color: "var(--theme-elevation-500)", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((saved, i) => {
              const row = current(saved);
              // A heading above the first row of each group
              const header = row.group !== shown[i - 1]?.group;
              const editable = saved.vat !== undefined;
              return [
                header && (
                  <tr key={`${row.group}-heading`}>
                    <th colSpan={7} style={{ ...cell, paddingTop: 24, fontSize: 16 }}>
                      {row.group}
                    </th>
                  </tr>
                ),
                <tr key={row.key}>
                  <td style={cell}>{row.item}</td>
                  <td style={{ ...cell, color: "var(--theme-elevation-600)" }}>{row.option}</td>
                  <td style={{ ...cell, width: 130, ...(changed(saved, "amount") && changedStyle) }}>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--theme-elevation-500)" }}>£</span>
                      <input
                        inputMode="decimal"
                        defaultValue={pounds(row.amount)}
                        key={`${row.key}-${row.amount}`}
                        onBlur={(e) => {
                          const amount = toPence(e.target.value);
                          if (amount !== undefined) edit(saved, { amount });
                        }}
                        style={{ ...input, paddingLeft: 20 }}
                      />
                    </div>
                  </td>
                  <td style={{ ...cell, width: 130, ...(changed(saved, "per") && changedStyle) }}>
                    {editable ? (
                      <select value={row.per} onChange={(e) => edit(saved, { per: e.target.value as PricingRow["per"] })} style={input}>
                        {Object.entries(PER).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.per && PER[row.per]
                    )}
                  </td>
                  <td style={{ ...cell, width: 130, ...(changed(saved, "vat") && changedStyle) }}>
                    {editable ? (
                      <select value={row.vat} onChange={(e) => edit(saved, { vat: e.target.value as PricingRow["vat"] })} style={input}>
                        {Object.entries(VAT).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ ...cell, ...(changed(saved, "note") && changedStyle) }}>
                    {editable ? <input defaultValue={row.note} key={`${row.key}-${row.note}`} onBlur={(e) => edit(saved, { note: e.target.value.trim() })} style={input} /> : "—"}
                  </td>
                  <td style={{ ...cell, width: 60 }}>
                    <Link href={row.href}>Open</Link>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** The sidebar's link to the Pricing page, under the collections and globals. */
export function PricingNavLink() {
  return (
    <Link href="/admin/pricing" className="nav__link" style={{ display: "block", marginTop: 16 }}>
      <span className="nav__link-label">Pricing</span>
    </Link>
  );
}
