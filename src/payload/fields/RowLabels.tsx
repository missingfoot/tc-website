"use client";

import { Pill, useConfig, useRowLabel } from "@payloadcms/ui";
import { useEffect, useState } from "react";

type Row = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** A row's own name: the first of these fields it has filled in. */
const nameOf = (row: Row | undefined) =>
  text(row?.heading) ?? text(row?.title) ?? text(row?.name) ?? text(row?.label) ?? text(row?.publication) ?? text(row?.topic) ?? text(row?.question);

/** The names of what's in a list, comma-separated (e.g. a footer column's links). */
const namesIn = (items: unknown) =>
  Array.isArray(items)
    ? (items as Row[])
        .map(nameOf)
        .filter(Boolean)
        .join(", ")
    : undefined;

/**
 * What a row leads to, after its name: what's in it (a section's or column's links, a dropdown's or
 * a link's sub-links), what a desktop link opens, or its link's address.
 */
function detailOf(row: Row | undefined) {
  if (row?.opens === "menu") return "opens the menu's sections (More)";
  const inside = namesIn(row?.subLinks) || namesIn(row?.links) || namesIn(row?.items);
  if (row?.opens === "dropdown") return inside ? `▾ ${inside}` : "▾ (empty dropdown)";
  if (inside) return inside;
  return text(row?.href);
}

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

type MediaInfo = { url?: string; alt?: string };

// Each photo looked up once, however many rows show it
const mediaCache = new Map<number, Promise<MediaInfo>>();

/**
 * A row's photo (its image or photo field) for its header. In the form a photo field holds the
 * upload's id, so it's looked up through the API.
 */
function useRowPhoto(row: Row | undefined, api: string): MediaInfo | undefined {
  const value = row?.image ?? row?.photo;
  const id = typeof value === "number" ? value : typeof value === "object" && value ? (value as { id?: number }).id : undefined;
  const [media, setMedia] = useState<MediaInfo>();
  useEffect(() => {
    if (id == null) return;
    if (!mediaCache.has(id))
      mediaCache.set(
        id,
        fetch(`${api}/media/${id}?depth=0`, { credentials: "include" })
          .then((res) => (res.ok ? res.json() : {}))
          .catch(() => ({})),
      );
    let current = true;
    mediaCache.get(id)!.then((info) => current && setMedia(info));
    return () => {
      current = false;
    };
  }, [id, api]);
  return id == null ? undefined : media;
}

/**
 * Header of an item in a list (a card, a value, a quote, a person, a link): a thumbnail of its
 * photo, if it has one, then its name (or its photo's alt text), or "Card 03" until it has one,
 * then where it leads (a link's address) and whether it's hidden. The thumbnail comes small from
 * the site's image resizer, not the full-size upload.
 */
export function ItemLabel({ fallback, unnamed }: { fallback: string; unnamed?: string }) {
  const { data, rowNumber = 0 } = useRowLabel<Row>();
  const { config } = useConfig();
  const photo = useRowPhoto(data, `${config.serverURL}${config.routes.api}`);
  // Rows left unnamed on purpose (e.g. the menu's first section, which has no heading) say so
  const name = nameOf(data) ?? text(photo?.alt) ?? unnamed ?? `${fallback} ${String(rowNumber + 1).padStart(2, "0")}`;
  const detail = detailOf(data);
  const hidden = data?.show === false;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, opacity: hidden ? 0.5 : 1 }}>
      {photo?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/_next/image?url=${encodeURIComponent(photo.url)}&w=128&q=75`}
          alt=""
          width={64}
          height={48}
          style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
        />
      )}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      {detail && <span style={muted}>{detail}</span>}
      {hidden && <span style={muted}>(hidden)</span>}
    </span>
  );
}
