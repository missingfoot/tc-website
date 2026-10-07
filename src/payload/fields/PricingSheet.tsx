"use client";

import { Button, useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { monthsLabel, type PricePlan } from "@/lib/pricing";
import type { LocationRow, PlanGrid, PricingData, PricingSave } from "../endpoints/pricingSheet";

// The admin's Pricing page: a tab per kind of price. Each kind's structure (rooms' membership
// lengths; working spaces' and serviced living's plans, with standard prices) sits above a grid of
// its places' prices, one column per length or plan, so each kind has only the columns it needs.
// Edits are highlighted and saved together; each tab downloads its grid as a CSV for Excel and
// takes one back (rows match by their ID, columns by their heading).

const PER = { night: "Per night", week: "Per week", month: "Per month", once: "One-off" } as const;
const VAT = { included: "VAT included", excluded: "+VAT", none: "No VAT" } as const;
type Tab = "rooms" | "working" | "serviced" | "rules";
const TABS: [Tab, string][] = [
  ["rooms", "Rooms"],
  ["working", "Working spaces"],
  ["serviced", "Serviced living"],
  ["rules", "Rules & variables"],
];

const pounds = (pence?: number | null) => (pence == null ? "" : (pence / 100).toFixed(2).replace(/\.00$/, ""));
const toPence = (text: string) => {
  const n = Number(text.replace(/[^\d.]/g, ""));
  return text.trim() === "" || Number.isNaN(n) ? undefined : Math.round(n * 100);
};
const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** One CSV cell, quoted when it needs to be. */
const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const csv = (lines: string[][]) => lines.map((l) => l.map(csvCell).join(",")).join("\n");

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
  return rows.filter((r) => r.some((x) => x.trim()));
}

function download(name: string, lines: string[][]) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv(lines)], { type: "text/csv" }));
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Shared styles, in the admin's theme
const cell: CSSProperties = { padding: "6px 10px", borderBottom: "1px solid var(--theme-elevation-100)", textAlign: "left", verticalAlign: "middle" };
const head: CSSProperties = { ...cell, color: "var(--theme-elevation-500)", fontWeight: 500 };
const changedBg: CSSProperties = { background: "var(--theme-warning-100, #fff4d6)" };
const input: CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid var(--theme-elevation-150)", background: "var(--theme-input-bg)", color: "var(--theme-text)" };
const linkButton: CSSProperties = { background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--theme-elevation-600)", textDecoration: "underline" };
const muted: CSSProperties = { color: "var(--theme-elevation-500)" };

/** A £ input that reports pence when it loses focus (empty: undefined). */
function Money({ value, onChange, placeholder, width = 110 }: { value?: number | null; onChange: (pence: number | undefined) => void; placeholder?: string; width?: number }) {
  return (
    <div style={{ position: "relative", width }}>
      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", ...muted }}>£</span>
      <input inputMode="decimal" defaultValue={pounds(value)} key={String(value)} placeholder={placeholder} onBlur={(e) => onChange(toPence(e.target.value))} style={{ ...input, paddingLeft: 20 }} />
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ margin: "0 0 4px" }}>{title}</h3>
      <p style={{ margin: "0 0 12px", maxWidth: 760, ...muted }}>{description}</p>
      {children}
    </section>
  );
}

export function PricingSheet() {
  const { config } = useConfig();
  const api = `${config.serverURL}${config.routes.api}/pricing-sheet`;
  const [saved, setSaved] = useState<PricingData>();
  const [draft, setDraft] = useState<PricingData>();
  const [tab, setTab] = useState<Tab>("rooms");
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(api, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((data: PricingData | undefined) => {
        setSaved(data);
        setDraft(data && structuredClone(data));
      });
  }, [api]);

  if (!saved || !draft) return <p style={{ marginTop: 32 }}>Loading prices…</p>;

  const sections = ["rooms", "working", "serviced", "rules", "variables"] as const;
  const dirty = sections.filter((s) => !same(saved[s], draft[s]));
  const update = <K extends keyof PricingData>(key: K, value: PricingData[K]) => setDraft({ ...draft, [key]: value });

  async function save() {
    setSaving(true);
    const body: PricingSave = Object.fromEntries(dirty.map((s) => [s, draft![s]]));
    const res = await fetch(api, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) return setMessage("Couldn't save: try again, or check you're still signed in.");
    const fresh = (await res.json()) as PricingData;
    setSaved(fresh);
    setDraft(structuredClone(fresh));
    setMessage("Saved. Pages using these prices update now.");
  }

  // CSV for the open tab: its grid, rows by name and ID, columns by length or plan
  function downloadTab() {
    if (tab === "rooms") {
      const { lengths, rows } = draft!.rooms;
      return download("room-rates", [
        ["Room", "ID", ...lengths.map((m) => `${m} months`)],
        ...rows.map((r) => [r.name, String(r.id), ...lengths.map((m) => pounds(r.rates.find((x) => x.months === m)?.weekly))]),
      ]);
    }
    if (tab === "working" || tab === "serviced") {
      const { plans, rows } = draft![tab];
      return download(`${tab}-prices`, [
        ["Location", "ID", ...plans.map((p) => p.label)],
        ["Standard", "", ...plans.map((p) => pounds(p.amount))],
        ...rows.map((r) => [
          r.name,
          String(r.id),
          ...plans.map((p) => {
            const entry = r.prices.find((x) => x.plan === p.id);
            return !entry ? "" : entry.amount == null ? "standard" : pounds(entry.amount);
          }),
        ]),
      ]);
    }
    const { rules, variables } = draft!;
    return download("pricing-rules", [
      ["Setting", "Value"],
      ["Joining fee (£)", pounds(rules.joiningFee)],
      ["Holding deposit (weeks)", String(rules.holdingDepositWeeks)],
      ["Bond with guarantor (weeks)", String(rules.bondWeeks.guarantor)],
      ["Bond without guarantor (weeks)", String(rules.bondWeeks.noGuarantor)],
      ["Bond paying up front (weeks)", String(rules.bondWeeks.upfront)],
      ...variables.map((v) => [`{${v.name}} (£)`, pounds(v.amount)]),
    ]);
  }

  async function uploadTab(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const [header, ...lines] = parseCsv(await picked.text());
    const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
    const unknownColumns = new Set<string>();
    let changed = 0;
    const rowFor = <T extends { id: number; name: string }>(rows: T[], line: string[]) =>
      rows.find((r) => String(r.id) === (line[col("ID")] ?? "").trim()) ?? rows.find((r) => r.name.toLowerCase() === (line[0] ?? "").trim().toLowerCase());

    if (tab === "rooms") {
      const rooms = structuredClone(draft!.rooms);
      for (const h of header.slice(2)) if (!rooms.lengths.includes(Number.parseInt(h, 10))) unknownColumns.add(h);
      for (const line of lines) {
        const row = rowFor(rooms.rows, line);
        if (!row) continue;
        for (const months of rooms.lengths) {
          const i = col(`${months} months`);
          if (i < 0) continue;
          const weekly = toPence(line[i] ?? "");
          const rate = row.rates.find((r) => r.months === months);
          if (weekly === undefined && rate) row.rates = row.rates.filter((r) => r !== rate);
          else if (weekly !== undefined && rate?.weekly !== weekly) row.rates = [...row.rates.filter((r) => r !== rate), { months, weekly }];
          else continue;
          changed++;
        }
      }
      update("rooms", rooms);
    } else if (tab === "working" || tab === "serviced") {
      const grid = structuredClone(draft![tab]);
      for (const h of header.slice(2)) if (!grid.plans.some((p) => p.label.toLowerCase() === h.trim().toLowerCase())) unknownColumns.add(h);
      for (const line of lines) {
        if ((line[0] ?? "").trim().toLowerCase() === "standard") {
          for (const plan of grid.plans) {
            const i = col(plan.label);
            const amount = i < 0 ? undefined : (toPence(line[i] ?? "") ?? null);
            if (i >= 0 && amount !== plan.amount) {
              plan.amount = amount ?? null;
              changed++;
            }
          }
          continue;
        }
        const row = rowFor(grid.rows, line);
        if (!row) continue;
        for (const plan of grid.plans) {
          const i = col(plan.label);
          if (i < 0) continue;
          const text = (line[i] ?? "").trim();
          const next = text === "" ? undefined : text.toLowerCase() === "standard" ? null : toPence(text);
          const entry = row.prices.find((p) => p.plan === plan.id);
          const current = entry ? entry.amount : undefined;
          if (next === current) continue;
          row.prices = row.prices.filter((p) => p.plan !== plan.id);
          if (next !== undefined) row.prices.push({ plan: plan.id, amount: next });
          changed++;
        }
      }
      update(tab, grid);
    } else {
      const value = (label: string) => lines.find((l) => (l[0] ?? "").trim() === label)?.[1]?.trim();
      const rules = structuredClone(draft!.rules);
      const variables = structuredClone(draft!.variables);
      const fee = toPence(value("Joining fee (£)") ?? "");
      if (fee !== undefined && fee !== rules.joiningFee) {
        rules.joiningFee = fee;
        changed++;
      }
      const weeks = (label: string, set: (n: number) => void, current: number) => {
        const n = Number.parseInt(value(label) ?? "", 10);
        if (Number.isInteger(n) && n >= 0 && n !== current) {
          set(n);
          changed++;
        }
      };
      weeks("Holding deposit (weeks)", (n) => (rules.holdingDepositWeeks = n), rules.holdingDepositWeeks);
      weeks("Bond with guarantor (weeks)", (n) => (rules.bondWeeks.guarantor = n), rules.bondWeeks.guarantor);
      weeks("Bond without guarantor (weeks)", (n) => (rules.bondWeeks.noGuarantor = n), rules.bondWeeks.noGuarantor);
      weeks("Bond paying up front (weeks)", (n) => (rules.bondWeeks.upfront = n), rules.bondWeeks.upfront);
      for (const v of variables) {
        const amount = toPence(value(`{${v.name}} (£)`) ?? "");
        if (amount !== undefined && amount !== v.amount) {
          v.amount = amount;
          changed++;
        }
      }
      setDraft({ ...draft!, rules, variables });
    }
    setMessage(
      `${changed} change${changed === 1 ? "" : "s"} loaded from ${picked.name}: they're highlighted below. Nothing's saved until you press Save.` +
        (unknownColumns.size ? ` Columns not in the structure were skipped (${[...unknownColumns].join(", ")}): add them above first.` : ""),
    );
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      <h1 style={{ margin: "24px 0 8px" }}>Pricing</h1>
      <p style={{ margin: "0 0 16px", maxWidth: 760, ...muted }}>
        Each kind of price in its own tab: its structure (the lengths or plans offered, with standard prices) and each place’s prices in a grid. Changes are highlighted and only saved
        when you press Save; cards, pages and sentences using a price follow it. Each tab downloads as a CSV for Excel and takes one back.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 20, borderBottom: "1px solid var(--theme-elevation-100)" }}>
        {TABS.map(([key, label]) => {
          const edited = key === "rules" ? dirty.includes("rules") || dirty.includes("variables") : dirty.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                padding: "10px 14px",
                background: "none",
                border: 0,
                borderBottom: `2px solid ${tab === key ? "var(--theme-text)" : "transparent"}`,
                color: tab === key ? "var(--theme-text)" : "var(--theme-elevation-500)",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              {label}
              {edited && " •"}
            </button>
          );
        })}
        <span style={{ flex: 1 }} />
        <Button buttonStyle="secondary" size="small" margin={false} onClick={downloadTab}>
          Download CSV
        </Button>
        <Button buttonStyle="secondary" size="small" margin={false} onClick={() => file.current?.click()}>
          Upload CSV
        </Button>
        <input ref={file} type="file" accept=".csv,text/csv" onChange={uploadTab} hidden />
        {dirty.length > 0 && (
          <>
            <Button buttonStyle="secondary" size="small" margin={false} disabled={saving} onClick={() => setDraft(structuredClone(saved))}>
              Discard
            </Button>
            <Button size="small" margin={false} onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        )}
      </div>
      {message && <p style={{ margin: "0 0 16px", padding: "10px 14px", borderRadius: 6, background: "var(--theme-elevation-50)" }}>{message}</p>}

      {tab === "rooms" && <RoomsTab saved={saved.rooms} draft={draft.rooms} onChange={(rooms) => update("rooms", rooms)} />}
      {(tab === "working" || tab === "serviced") && (
        <PlansTab
          key={tab}
          kind={tab}
          saved={saved[tab]}
          draft={draft[tab]}
          onChange={(grid) => update(tab, grid)}
          places={tab === "working" ? "working space" : "house"}
          planWord={tab === "working" ? "plan" : "room type"}
        />
      )}
      {tab === "rules" && (
        <RulesTab
          saved={saved}
          draft={draft}
          onRules={(rules) => update("rules", rules)}
          onVariables={(variables) => update("variables", variables)}
        />
      )}
    </div>
  );
}

/** Rooms: the membership lengths, then a grid of each room's weekly rate per length (empty: not offered). */
function RoomsTab({ saved, draft, onChange }: { saved: PricingData["rooms"]; draft: PricingData["rooms"]; onChange: (rooms: PricingData["rooms"]) => void }) {
  const [adding, setAdding] = useState("");
  const addLength = () => {
    const months = Number.parseInt(adding, 10);
    if (!Number.isInteger(months) || months < 1 || draft.lengths.includes(months)) return;
    onChange({ ...draft, lengths: [...draft.lengths, months].sort((a, b) => b - a) });
    setAdding("");
  };
  const setRate = (roomId: number, months: number, weekly: number | undefined) =>
    onChange({
      ...draft,
      rows: draft.rows.map((r) =>
        r.id !== roomId ? r : { ...r, rates: [...r.rates.filter((x) => x.months !== months), ...(weekly === undefined ? [] : [{ months, weekly }])] },
      ),
    });
  const savedRate = (roomId: number, months: number) => saved.rows.find((r) => r.id === roomId)?.rates.find((x) => x.months === months)?.weekly;

  return (
    <>
      <Section title="Membership lengths" description="The lengths people can choose when applying, longest first: each is a column below. Removing one removes its rates.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {draft.lengths.map((m) => (
            <span key={m} style={{ ...input, width: "auto", display: "inline-flex", gap: 8, alignItems: "center", ...(!saved.lengths.includes(m) && changedBg) }}>
              {monthsLabel(m)}
              <button type="button" aria-label={`Remove ${m} months`} style={linkButton} onClick={() => onChange({ ...draft, lengths: draft.lengths.filter((x) => x !== m) })}>
                ×
              </button>
            </span>
          ))}
          <input value={adding} onChange={(e) => setAdding(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLength()} placeholder="Months" inputMode="numeric" style={{ ...input, width: 90 }} />
          <button type="button" style={linkButton} onClick={addLength}>
            + Add length
          </button>
        </div>
      </Section>
      <Section title="Rates" description="Each room’s weekly rate for each length. Leave a cell empty if that length isn’t offered for the room.">
        <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={head}>Room</th>
              {draft.lengths.map((m) => (
                <th key={m} style={head}>
                  {m} months
                </th>
              ))}
              <th style={head} />
            </tr>
          </thead>
          <tbody>
            {draft.rows.map((room) => (
              <tr key={room.id}>
                <td style={cell}>{room.name}</td>
                {draft.lengths.map((m) => {
                  const weekly = room.rates.find((x) => x.months === m)?.weekly;
                  return (
                    <td key={m} style={{ ...cell, ...(weekly !== savedRate(room.id, m) && changedBg) }}>
                      <Money value={weekly} onChange={(pence) => setRate(room.id, m, pence)} placeholder="not offered" />
                    </td>
                  );
                })}
                <td style={cell}>
                  <Link href={room.href}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}

/** Working spaces or serviced living: the plans (with standard prices), then a grid of each place's prices per plan. */
function PlansTab({
  kind,
  saved,
  draft,
  onChange,
  places,
  planWord,
}: {
  kind: "working" | "serviced";
  saved: PlanGrid;
  draft: PlanGrid;
  onChange: (grid: PlanGrid) => void;
  places: string;
  planWord: string;
}) {
  const setPlan = (id: string, change: Partial<Omit<PricePlan, "id">>) => onChange({ ...draft, plans: draft.plans.map((p) => (p.id === id ? { ...p, ...change } : p)) });
  const savedPlan = (id: string) => saved.plans.find((p) => p.id === id);
  const setEntry = (row: LocationRow, plan: string, entry: { amount: number | null } | undefined) =>
    onChange({
      ...draft,
      rows: draft.rows.map((r) => (r.id !== row.id ? r : { ...r, prices: [...r.prices.filter((p) => p.plan !== plan), ...(entry ? [{ plan, ...entry }] : [])] })),
    });
  const savedEntry = (rowId: number, plan: string) => saved.rows.find((r) => r.id === rowId)?.prices.find((p) => p.plan === plan);

  return (
    <>
      <Section
        title={kind === "working" ? "Plans" : "Room types"}
        description={`What a ${places} can offer: each is a column below. A standard price is used by every ${places} that doesn’t set its own; leave it empty for none.`}
      >
        <table style={{ borderCollapse: "collapse", fontSize: 14, width: "100%" }}>
          <thead>
            <tr>
              {["Name", "Standard price", "Per", "VAT", "Small print", ""].map((h) => (
                <th key={h} style={head}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draft.plans.map((plan) => {
              const before = savedPlan(plan.id);
              const changed = (field: keyof PricePlan) => !before || before[field] !== plan[field];
              return (
                <tr key={plan.id}>
                  <td style={{ ...cell, ...(changed("label") && changedBg) }}>
                    <input defaultValue={plan.label} onBlur={(e) => setPlan(plan.id, { label: e.target.value.trim() })} placeholder={`e.g. ${kind === "working" ? "Hot Desk" : "Studio"}`} style={input} />
                  </td>
                  <td style={{ ...cell, ...(changed("amount") && changedBg) }}>
                    <Money value={plan.amount} onChange={(pence) => setPlan(plan.id, { amount: pence ?? null })} placeholder="none" />
                  </td>
                  <td style={{ ...cell, ...(changed("per") && changedBg) }}>
                    <select value={plan.per} onChange={(e) => setPlan(plan.id, { per: e.target.value as PricePlan["per"] })} style={input}>
                      {Object.entries(PER).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...cell, ...(changed("vat") && changedBg) }}>
                    <select value={plan.vat} onChange={(e) => setPlan(plan.id, { vat: e.target.value as PricePlan["vat"] })} style={input}>
                      {Object.entries(VAT).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...cell, ...(changed("note") && changedBg) }}>
                    <input defaultValue={plan.note ?? ""} onBlur={(e) => setPlan(plan.id, { note: e.target.value.trim() || null })} placeholder="e.g. all bills included" style={input} />
                  </td>
                  <td style={cell}>
                    <button type="button" style={linkButton} onClick={() => onChange({ ...draft, plans: draft.plans.filter((p) => p.id !== plan.id) })}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="button"
          style={{ ...linkButton, marginTop: 10 }}
          onClick={() => onChange({ ...draft, plans: [...draft.plans, { id: newId(), label: "", amount: null, per: kind === "working" ? "month" : "week", vat: kind === "working" ? "excluded" : "included", note: null } as PlanGrid["plans"][number]] })}
        >
          + Add {planWord}
        </button>
      </Section>

      <Section
        title="Prices"
        description={`Each ${places}’s price for each ${planWord}: empty uses the standard price (shown faintly). “Not offered” leaves it out; “Offer” brings it back.`}
      >
        <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={head}>{places === "house" ? "House" : "Working space"}</th>
              {draft.plans.map((p) => (
                <th key={p.id} style={head}>
                  {p.label || `New ${planWord}`}
                </th>
              ))}
              <th style={head} />
            </tr>
          </thead>
          <tbody>
            {draft.rows.map((row) => (
              <tr key={row.id}>
                <td style={cell}>{row.name}</td>
                {draft.plans.map((plan) => {
                  const entry = row.prices.find((p) => p.plan === plan.id);
                  const changed = !same(entry, savedEntry(row.id, plan.id));
                  return (
                    <td key={plan.id} style={{ ...cell, ...(changed && changedBg) }}>
                      {entry ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Money
                            value={entry.amount}
                            placeholder={plan.amount != null ? `${pounds(plan.amount)} standard` : "price"}
                            width={130}
                            onChange={(pence) => setEntry(row, plan.id, { amount: pence ?? null })}
                          />
                          <button type="button" title="Not offered" aria-label={`${plan.label} not offered at ${row.name}`} style={linkButton} onClick={() => setEntry(row, plan.id, undefined)}>
                            ×
                          </button>
                        </div>
                      ) : (
                        <span style={muted}>
                          Not offered ·{" "}
                          <button type="button" style={linkButton} onClick={() => setEntry(row, plan.id, { amount: null })}>
                            Offer
                          </button>
                        </span>
                      )}
                    </td>
                  );
                })}
                <td style={cell}>
                  <Link href={row.href}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}

/** The application's rules (joining fee; deposit and bonds in weeks of a room's rate) and the money variables. */
function RulesTab({
  saved,
  draft,
  onRules,
  onVariables,
}: {
  saved: PricingData;
  draft: PricingData;
  onRules: (rules: PricingData["rules"]) => void;
  onVariables: (variables: PricingData["variables"]) => void;
}) {
  const r = draft.rules;
  const weeks = (label: string, value: number, savedValue: number, set: (n: number) => void) => (
    <tr>
      <td style={cell}>{label}</td>
      <td style={{ ...cell, ...(value !== savedValue && changedBg) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            inputMode="numeric"
            defaultValue={value}
            key={value}
            onBlur={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              if (Number.isInteger(n) && n >= 0) set(n);
            }}
            style={{ ...input, width: 70 }}
          />
          {value === 1 ? "week" : "weeks"}
        </div>
      </td>
    </tr>
  );
  return (
    <>
      <Section title="Applying for a room" description="What applying for an Old Oak room costs, besides its rate. The deposit and bonds are in weeks of the room’s weekly rate.">
        <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            <tr>
              <td style={cell}>Joining fee</td>
              <td style={{ ...cell, ...(r.joiningFee !== saved.rules.joiningFee && changedBg) }}>
                <Money value={r.joiningFee} onChange={(pence) => pence !== undefined && onRules({ ...r, joiningFee: pence })} />
              </td>
            </tr>
            {weeks("Holding deposit (becomes part of the bond)", r.holdingDepositWeeks, saved.rules.holdingDepositWeeks, (n) => onRules({ ...r, holdingDepositWeeks: n }))}
            {weeks("Security bond: monthly, with a guarantor", r.bondWeeks.guarantor, saved.rules.bondWeeks.guarantor, (n) => onRules({ ...r, bondWeeks: { ...r.bondWeeks, guarantor: n } }))}
            {weeks("Security bond: monthly, no guarantor", r.bondWeeks.noGuarantor, saved.rules.bondWeeks.noGuarantor, (n) => onRules({ ...r, bondWeeks: { ...r.bondWeeks, noGuarantor: n } }))}
            {weeks("Security bond: all up front", r.bondWeeks.upfront, saved.rules.bondWeeks.upfront, (n) => onRules({ ...r, bondWeeks: { ...r.bondWeeks, upfront: n } }))}
          </tbody>
        </table>
      </Section>
      <Section title="Money variables" description="Amounts written into sentences as {name}. Add or rename them on the Variables page.">
        <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            {draft.variables.map((v) => (
              <tr key={v.id}>
                <td style={cell}>
                  <code>{`{${v.name}}`}</code> <span style={muted}>{v.about}</span>
                </td>
                <td style={{ ...cell, ...(v.amount !== saved.variables.find((x) => x.id === v.id)?.amount && changedBg) }}>
                  <Money value={v.amount} onChange={(pence) => pence !== undefined && onVariables(draft.variables.map((x) => (x.id === v.id ? { ...x, amount: pence } : x)))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
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
