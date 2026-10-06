"use client";

import { Pill, useRowLabel } from "@payloadcms/ui";

type Row = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** A row's own name: the first of these fields it has filled in. */
const nameOf = (row: Row | undefined) => text(row?.heading) ?? text(row?.title) ?? text(row?.name) ?? text(row?.publication);

/**
 * What a section is about, for its header: its heading or title, or, for a section without one
 * (e.g. promo cards), the names of the items in it.
 */
function summary(row: Row) {
  const own = nameOf(row);
  if (own) return own;
  const items = Object.values(row).find((value): value is Row[] => Array.isArray(value) && value.length > 0);
  return items
    ?.map(nameOf)
    .filter(Boolean)
    .join(", ");
}

const muted = { color: "var(--theme-elevation-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;

/**
 * Header of a page section in the admin: its number and type, as Payload draws them, then its
 * heading in place of Payload's "Untitled" (a name editors would have to type in).
 */
export function SectionLabel({ label }: { label: string }) {
  const { data, rowNumber = 0 } = useRowLabel<Row>();
  const about = summary(data ?? {});
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <span className="blocks-field__block-number">{String(rowNumber + 1).padStart(2, "0")}</span>
      <Pill className="blocks-field__block-pill" pillStyle="white" size="small">
        {label}
      </Pill>
      {about && <span style={muted}>{about}</span>}
    </span>
  );
}

/** Header of an item in a list (a card, a value, a quote, a person): its name, or "Card 03" until it has one. */
export function ItemLabel({ fallback }: { fallback: string }) {
  const { data, rowNumber = 0 } = useRowLabel<Row>();
  return <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nameOf(data) ?? `${fallback} ${String(rowNumber + 1).padStart(2, "0")}`}</span>;
}
