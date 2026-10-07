"use client";

import { Button, useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import type { PricingChange, PricingOwner, PricingRow } from "../endpoints/pricingSheet";

const PER = { night: "Per night", week: "Per week", month: "Per month", once: "One-off" } as const;
const VAT = { included: "Included", excluded: "+VAT", none: "Not charged" } as const;

const pounds = (pence?: number) => (pence == null ? "" : (pence / 100).toFixed(2).replace(/\.00$/, ""));
const toPence = (text: string) => {
  const n = Number(text.replace(/[^\d.]/g, ""));
  return text.trim() === "" || Number.isNaN(n) ? undefined : Math.round(n * 100);
};
const toMonths = (text: string) => {
  const n = Number.parseInt(text, 10);
  return Number.isInteger(n) && n >= 1 ? n : undefined;
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

const HEADERS = ["Key", "Group", "Item", "Option", "Months", "Price (£)", "Weeks", "Per", "VAT", "Small print"];

type Owner = PricingOwner;

/** A rate or price being added: its key is its owner's prefix + ":new:<n>". */
type Draft = PricingChange & { owner: Owner };

const prefixOf = (key: string) => key.split(":").slice(0, 2).join(":");

/**
 * The admin's Pricing page: every price on the site in one table. Rooms' rates (with their
 * membership lengths) and locations' prices (with their names) can be edited, added and removed
 * here; the joining fee and money variables edited. Changes are highlighted and saved together.
 * Download CSV gives the list for Excel; Upload CSV loads a sheet's edits, and its new rows (no
 * Key, an existing room or location in Item) as additions, for review before saving. Removing is
 * done in the table only, so a row lost from a spreadsheet never deletes a price.
 */
export function PricingSheet() {
  const { config } = useConfig();
  const api = `${config.serverURL}${config.routes.api}/pricing-sheet`;
  const [rows, setRows] = useState<PricingRow[]>();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [edits, setEdits] = useState<Record<string, PricingChange>>({});
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  useEffect(() => {
    fetch(api, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { rows: [], owners: [] }))
      .then((data: { rows: PricingRow[]; owners: Owner[] }) => {
        setRows(data.rows);
        setOwners(data.owners);
      })
      .catch(() => setRows([]));
  }, [api]);

  /** A saved row with its pending edit applied. */
  const current = (row: PricingRow) => ({ ...row, ...edits[row.key] }) as PricingRow & PricingChange;
  const isChanged = (row: PricingRow, field: "amount" | "months" | "weeks" | "label" | "per" | "vat" | "note") => {
    const edit = edits[row.key];
    if (!edit || edit[field] === undefined) return false;
    const saved = field === "label" ? row.option : row[field];
    return field === "note" ? (edit.note ?? "") !== (row.note ?? "") : edit[field] !== saved;
  };

  const edit = (row: PricingRow, change: Omit<PricingChange, "key">) =>
    setEdits((all) => {
      const next: PricingChange = { ...all[row.key], ...change, key: row.key };
      // Drop fields set back to what's saved, and the edit if nothing's left
      if (next.amount === row.amount) delete next.amount;
      if (next.months === row.months) delete next.months;
      if (next.weeks === row.weeks) delete next.weeks;
      if (next.label === row.option) delete next.label;
      if (next.per === row.per) delete next.per;
      if (next.vat === row.vat) delete next.vat;
      if (next.note !== undefined && next.note === (row.note ?? "")) delete next.note;
      if (!next.remove) delete next.remove;
      const rest = { ...all };
      delete rest[row.key];
      return Object.keys(next).length > 1 ? { ...rest, [row.key]: next } : rest;
    });

  const addDraft = (owner: Owner, values: Omit<PricingChange, "key"> = {}) => {
    counter.current += 1;
    const draft: Draft = { key: `${owner.prefix}:new:${counter.current}`, owner, ...(owner.kind === "location" && { per: "month", vat: "included" }), ...values };
    setDrafts((all) => [...all, draft]);
    return draft;
  };
  const editDraft = (key: string, change: Omit<PricingChange, "key">) => setDrafts((all) => all.map((d) => (d.key === key ? { ...d, ...change } : d)));
  const incomplete = drafts.filter((d) => d.amount == null || (d.owner.kind === "room" ? d.months == null : !d.label));

  const pending = Object.values(edits).length + drafts.length;

  /** The rooms and locations, in order, with their rows (filtered), and the other rows. */
  const sections = useMemo(() => {
    const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = (row: PricingRow) => words.every((w) => `${row.group} ${row.item} ${row.option}`.toLowerCase().includes(w));
    const list: { group: string; item: string; owner?: Owner; rows: PricingRow[] }[] = [];
    // Each room and location, with its prices (or none yet, to add the first)
    for (const owner of owners) {
      const own = (rows ?? []).filter((r) => prefixOf(r.key) === owner.prefix);
      const shown = own.filter(matches);
      if (shown.length || (!own.length && words.every((w) => `${owner.group} ${owner.item}`.toLowerCase().includes(w)))) list.push({ group: owner.group, item: owner.item, owner, rows: shown });
    }
    // Then the rest (the joining fee, variables), grouped as they come
    for (const row of (rows ?? []).filter((r) => !owners.some((o) => o.prefix === prefixOf(r.key)) && matches(r))) {
      const last = list.at(-1);
      if (last && !last.owner && last.group === row.group && last.item === row.item) last.rows.push(row);
      else list.push({ group: row.group, item: row.item, rows: [row] });
    }
    return list;
  }, [rows, owners, filter]);

  async function save() {
    if (incomplete.length) return setMessage("Some new rows are missing a price or a length (or a name): fill them in or remove them first.");
    setSaving(true);
    const changes: PricingChange[] = [...Object.values(edits), ...drafts.map((d) => ({ ...d, owner: undefined }))];
    const res = await fetch(api, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ changes }) });
    setSaving(false);
    if (!res.ok) return setMessage("Couldn't save: try again, or check you're still signed in.");
    const { saved, rows: fresh, owners: freshOwners } = (await res.json()) as { saved: number; rows: PricingRow[]; owners: Owner[] };
    setRows(fresh);
    setOwners(freshOwners);
    setEdits({});
    setDrafts([]);
    setMessage(`Saved ${saved} change${saved === 1 ? "" : "s"}. Pages using these prices update now.`);
  }

  function download() {
    const lines = [
      HEADERS,
      ...(rows ?? []).map((r) => [
        r.key,
        r.group,
        r.item,
        r.option,
        r.months?.toString() ?? "",
        r.weeks === undefined ? pounds(r.amount) : "",
        r.weeks?.toString() ?? "",
        r.per ? PER[r.per] : "",
        r.vat ? VAT[r.vat] : "",
        r.note ?? "",
      ]),
    ];
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
    const c = {
      key: col("Key"),
      group: col("Group"),
      item: col("Item"),
      option: col("Option"),
      months: col("Months"),
      price: col("Price (£)"),
      weeks: col("Weeks"),
      per: col("Per"),
      vat: col("VAT"),
      note: col("Small print"),
    };
    if (c.price < 0 || c.item < 0) return setMessage("That file needs Item and Price (£) columns: start from Download CSV.");
    const get = (line: string[], i: number) => (i >= 0 ? (line[i] ?? "").trim() : "");
    const fromLabel = <T extends string>(labels: Record<T, string>, text: string) => (Object.entries(labels) as [T, string][]).find(([, label]) => label === text)?.[0];
    const byKey = new Map(rows.map((r) => [r.key, r]));
    const ownersByName = new Map(owners.map((o) => [`${o.group}|${o.item}`.toLowerCase(), o]));
    let edited = 0;
    let added = 0;
    let skipped = 0;
    const nextEdits = { ...edits };
    for (const line of lines) {
      const values: Omit<PricingChange, "key"> = {};
      const amount = toPence(get(line, c.price));
      if (amount !== undefined) values.amount = amount;
      const months = toMonths(get(line, c.months) || get(line, c.option));
      const per = fromLabel(PER, get(line, c.per));
      const vat = fromLabel(VAT, get(line, c.vat));
      const row = byKey.get(get(line, c.key));
      if (row) {
        const change: PricingChange = { key: row.key };
        if (row.weeks !== undefined) {
          const weeks = Number.parseInt(get(line, c.weeks), 10);
          if (Number.isInteger(weeks) && weeks >= 0 && weeks !== row.weeks) change.weeks = weeks;
        } else if (values.amount !== undefined && values.amount !== row.amount) change.amount = values.amount;
        if (row.months !== undefined && months !== undefined && months !== row.months) change.months = months;
        if (row.vat !== undefined) {
          const label = get(line, c.option);
          if (label && label !== row.option) change.label = label;
          if (per && per !== row.per) change.per = per;
          if (vat && vat !== row.vat) change.vat = vat;
          if (c.note >= 0 && get(line, c.note) !== (row.note ?? "")) change.note = get(line, c.note);
        }
        if (Object.keys(change).length > 1) {
          nextEdits[row.key] = change;
          edited++;
        }
        continue;
      }
      // No matching key: a new rate or price, for the room or location named in Group and Item
      const owner = ownersByName.get(`${get(line, c.group)}|${get(line, c.item)}`.toLowerCase());
      if (!owner || values.amount === undefined) {
        skipped++;
        continue;
      }
      if (owner.kind === "room") {
        if (months === undefined) {
          skipped++;
          continue;
        }
        addDraft(owner, { amount: values.amount, months });
      } else {
        const label = get(line, c.option);
        if (!label) {
          skipped++;
          continue;
        }
        addDraft(owner, { amount: values.amount, label, ...(per && { per }), ...(vat && { vat }), ...(get(line, c.note) && { note: get(line, c.note) }) });
      }
      added++;
    }
    setEdits(nextEdits);
    setMessage(
      `From ${input.name}: ${edited} change${edited === 1 ? "" : "s"} and ${added} new row${added === 1 ? "" : "s"}, highlighted below. Nothing's saved until you press Save.` +
        (skipped ? ` ${skipped} row${skipped === 1 ? "" : "s"} couldn't be matched to a room or location (or had no price or length) and were skipped.` : ""),
    );
  }

  const cell: CSSProperties = { padding: "6px 10px", borderBottom: "1px solid var(--theme-elevation-100)", textAlign: "left", verticalAlign: "middle" };
  const changedBg: CSSProperties = { background: "var(--theme-warning-100, #fff4d6)" };
  const newBg: CSSProperties = { background: "var(--theme-success-100, #e3f6e8)" };
  const input: CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--theme-elevation-150)", background: "var(--theme-input-bg)", color: "var(--theme-text)" };
  const link: CSSProperties = { background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--theme-elevation-600)", textDecoration: "underline" };

  const priceInput = (value: number | undefined, onSet: (pence: number) => void, key: string) => (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--theme-elevation-500)" }}>£</span>
      <input
        inputMode="decimal"
        defaultValue={pounds(value)}
        key={key}
        onBlur={(e) => {
          const pence = toPence(e.target.value);
          if (pence !== undefined) onSet(pence);
        }}
        style={{ ...input, paddingLeft: 20 }}
      />
    </div>
  );
  const select = <T extends string>(labels: Record<T, string>, value: T | undefined, onSet: (v: T) => void) => (
    <select value={value} onChange={(e) => onSet(e.target.value as T)} style={input}>
      {(Object.entries(labels) as [T, string][]).map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );

  return (
    <div style={{ paddingBottom: 64 }}>
      <h1 style={{ margin: "24px 0 8px" }}>Pricing</h1>
      <p style={{ margin: "0 0 20px", maxWidth: 760, color: "var(--theme-elevation-600)" }}>
        Every price on the site, and the pricing rules (the joining fee, and the deposit and bonds in weeks of a room’s rate). Edit, add and remove rooms’ rates (each a membership length and weekly price) and locations’ prices here, or download a CSV, update it in Excel and upload it:
        edited rows change, and new rows naming an existing room or location (Group and Item, with no Key) are added. Changes are highlighted and only saved when you press Save; cards,
        pages and sentences using a price follow it.
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
        {pending > 0 && (
          <>
            <span>
              {pending} change{pending === 1 ? "" : "s"} waiting
            </span>
            <Button
              buttonStyle="secondary"
              size="small"
              margin={false}
              disabled={saving}
              onClick={() => {
                setEdits({});
                setDrafts([]);
              }}
            >
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
            {sections.map((section, i) => {
              const owner = section.owner;
              const ownDrafts = owner ? drafts.filter((d) => d.owner.prefix === owner.prefix) : [];
              return (
                <Fragment key={`${section.group}|${section.item}`}>
                  {section.group !== sections[i - 1]?.group && (
                    <tr>
                      <th colSpan={7} style={{ ...cell, paddingTop: 24, fontSize: 16 }}>
                        {section.group}
                      </th>
                    </tr>
                  )}
                  {section.rows.map((saved) => {
                    const row = current(saved);
                    const removed = Boolean(edits[saved.key]?.remove);
                    const isLocation = saved.vat !== undefined;
                    const isRoom = saved.months !== undefined;
                    return (
                      <tr key={saved.key} style={removed ? { opacity: 0.45, textDecoration: "line-through" } : undefined}>
                        <td style={cell}>{row.item}</td>
                        <td style={{ ...cell, width: 170, ...((isChanged(saved, "months") || isChanged(saved, "label")) && changedBg) }}>
                          {isRoom ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input
                                inputMode="numeric"
                                defaultValue={row.months}
                                key={`${saved.key}-m-${row.months}`}
                                onBlur={(e) => {
                                  const months = toMonths(e.target.value);
                                  if (months) edit(saved, { months });
                                }}
                                style={{ ...input, width: 64 }}
                              />
                              months
                            </div>
                          ) : isLocation ? (
                            <input defaultValue={row.label ?? row.option} key={`${saved.key}-l-${row.label}`} onBlur={(e) => e.target.value.trim() && edit(saved, { label: e.target.value.trim() })} style={input} />
                          ) : (
                            <span style={{ color: "var(--theme-elevation-600)" }}>{row.option}</span>
                          )}
                        </td>
                        <td style={{ ...cell, width: 130, ...((isChanged(saved, "amount") || isChanged(saved, "weeks")) && changedBg) }}>
                          {saved.weeks !== undefined ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input
                                inputMode="numeric"
                                defaultValue={row.weeks}
                                key={`${saved.key}-w-${row.weeks}`}
                                onBlur={(e) => {
                                  const weeks = Number.parseInt(e.target.value, 10);
                                  if (Number.isInteger(weeks) && weeks >= 0) edit(saved, { weeks });
                                }}
                                style={{ ...input, width: 64 }}
                              />
                              {row.weeks === 1 ? "week" : "weeks"}
                            </div>
                          ) : (
                            priceInput(row.amount, (amount) => edit(saved, { amount }), `${saved.key}-${row.amount}`)
                          )}
                        </td>
                        <td style={{ ...cell, width: 130, ...(isChanged(saved, "per") && changedBg) }}>{isLocation ? select(PER, row.per, (per) => edit(saved, { per })) : row.per && PER[row.per]}</td>
                        <td style={{ ...cell, width: 130, ...(isChanged(saved, "vat") && changedBg) }}>{isLocation ? select(VAT, row.vat, (vat) => edit(saved, { vat })) : "—"}</td>
                        <td style={{ ...cell, ...(isChanged(saved, "note") && changedBg) }}>
                          {isLocation ? <input defaultValue={row.note} key={`${saved.key}-n-${row.note}`} onBlur={(e) => edit(saved, { note: e.target.value.trim() })} style={input} /> : "—"}
                        </td>
                        <td style={{ ...cell, width: 120, whiteSpace: "nowrap", textDecoration: "none" }}>
                          {owner && (
                            <button type="button" style={{ ...link, marginRight: 12 }} onClick={() => edit(saved, { remove: !removed })}>
                              {removed ? "Undo" : "Remove"}
                            </button>
                          )}
                          {saved.href && <Link href={saved.href}>Open</Link>}
                        </td>
                      </tr>
                    );
                  })}
                  {ownDrafts.map((d) => (
                    <tr key={d.key} style={newBg}>
                      <td style={cell}>
                        {d.owner.item} <em style={{ color: "var(--theme-elevation-500)" }}>(new)</em>
                      </td>
                      <td style={{ ...cell, width: 170 }}>
                        {d.owner.kind === "room" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input inputMode="numeric" defaultValue={d.months} placeholder="9" onBlur={(e) => editDraft(d.key, { months: toMonths(e.target.value) })} style={{ ...input, width: 64 }} />
                            months
                          </div>
                        ) : (
                          <input defaultValue={d.label} placeholder="e.g. Dedicated Desk" onBlur={(e) => editDraft(d.key, { label: e.target.value.trim() })} style={input} />
                        )}
                      </td>
                      <td style={{ ...cell, width: 130 }}>{priceInput(d.amount, (amount) => editDraft(d.key, { amount }), `${d.key}-p`)}</td>
                      <td style={{ ...cell, width: 130 }}>{d.owner.kind === "location" ? select(PER, d.per, (per) => editDraft(d.key, { per })) : PER.week}</td>
                      <td style={{ ...cell, width: 130 }}>{d.owner.kind === "location" ? select(VAT, d.vat, (vat) => editDraft(d.key, { vat })) : "—"}</td>
                      <td style={cell}>
                        {d.owner.kind === "location" ? <input defaultValue={d.note} onBlur={(e) => editDraft(d.key, { note: e.target.value.trim() })} style={input} /> : "—"}
                      </td>
                      <td style={{ ...cell, width: 120 }}>
                        <button type="button" style={link} onClick={() => setDrafts((all) => all.filter((x) => x.key !== d.key))}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {owner && (
                    <tr>
                      <td colSpan={7} style={{ ...cell, paddingTop: 4, paddingBottom: 10 }}>
                        <button type="button" style={link} onClick={() => addDraft(owner)}>
                          + Add {owner.kind === "room" ? "rate" : "price"} for {section.item}
                        </button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
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
