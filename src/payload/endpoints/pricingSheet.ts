import type { Endpoint, PayloadRequest } from "payload";
import { locationPaths } from "../collections/Locations";
import type { Location, Room } from "@/payload-types";

/**
 * Every price on the site as one list, for the admin's Pricing page (fields/PricingSheet.tsx):
 * GET lists them, POST saves changes to them. Each row's key says where it lives, so a sheet
 * downloaded, edited in Excel and uploaded still lands on the right prices. Signed-in editors only.
 */

export type PricingRow = {
  key: string;
  group: string;
  item: string;
  option: string;
  /** In pence. */
  amount: number;
  /** A room rate's membership length. */
  months?: number;
  /** Only location prices have these to edit; the rest are fixed (rooms are weekly). */
  per?: "night" | "week" | "month" | "once";
  vat?: "included" | "excluded" | "none";
  note?: string;
  /** The admin page it comes from, to open it. */
  href: string;
};

/**
 * A change to a row: new values, or `remove`. A new rate or price has a key ending in ":new:<anything>"
 * after its room's or location's ("room:12:new:1") and carries all its values.
 */
export type PricingChange = {
  key: string;
  amount?: number;
  months?: number;
  /** A location price's name, e.g. "Hot Desk". */
  label?: string;
  per?: PricingRow["per"];
  vat?: PricingRow["vat"];
  note?: string;
  remove?: boolean;
};

/** A room or location that can have prices, so one with none yet can still get its first. */
export type PricingOwner = { prefix: string; kind: "room" | "location"; group: string; item: string; href: string };

/** Where a row lives: "room:12:<rate id>" → room 12, that rate; "room:12:new:1" → room 12, new. */
const parseKey = (key: string) => {
  const [kind, id, row, ...rest] = key.split(":");
  return { kind, id: Number(id), row, isNew: row === "new" && rest.length > 0 };
};

const groupNames: Record<keyof typeof locationPaths, string> = { working: "Working spaces", serviced: "Serviced living", venue: "Venues" };

async function sheet(req: PayloadRequest): Promise<{ rows: PricingRow[]; owners: PricingOwner[] }> {
  const { payload } = req;
  const [rooms, locations, rules, variables] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0, req }),
    payload.find({ collection: "locations", sort: "_order", pagination: false, depth: 0, req }),
    payload.findGlobal({ slug: "pricingRules", depth: 0, req }),
    payload.findGlobal({ slug: "variables", depth: 0, req }),
  ]);
  const list: PricingRow[] = [];
  const owners: PricingOwner[] = [];
  for (const room of rooms.docs) owners.push({ prefix: `room:${room.id}`, kind: "room", group: "Old Oak rooms", item: room.name, href: `/admin/collections/rooms/${room.id}` });
  // Venues are priced on request, so only working spaces and serviced living houses can have prices added
  for (const type of ["working", "serviced"] as const)
    for (const l of locations.docs.filter((l) => l.type === type))
      owners.push({ prefix: `location:${l.id}`, kind: "location", group: groupNames[type], item: l.name, href: `/admin/collections/locations/${l.id}` });
  for (const room of rooms.docs)
    for (const rate of room.rates ?? [])
      list.push({
        key: `room:${room.id}:${rate.id}`,
        group: "Old Oak rooms",
        item: room.name,
        option: `${rate.months} months`,
        months: rate.months,
        amount: rate.weekly,
        per: "week",
        href: `/admin/collections/rooms/${room.id}`,
      });
  for (const type of Object.keys(groupNames) as (keyof typeof groupNames)[])
    for (const location of locations.docs.filter((l) => l.type === type))
      for (const price of location.prices ?? [])
        list.push({
          key: `location:${location.id}:${price.id}`,
          group: groupNames[type],
          item: location.name,
          option: price.label,
          amount: price.amount,
          per: price.per,
          vat: price.vat,
          note: price.note ?? "",
          href: `/admin/collections/locations/${location.id}`,
        });
  if (rules.joiningFee != null)
    list.push({ key: "rules:joiningFee", group: "Pricing rules", item: "Joining fee", option: "Room applications", amount: rules.joiningFee, href: "/admin/globals/pricingRules" });
  for (const v of variables.entries ?? [])
    if (v.kind !== "text") list.push({ key: `variable:${v.id}`, group: "Variables", item: `{${v.name}}`, option: v.about ?? "", amount: v.amount ?? 0, href: "/admin/globals/variables" });
  return { rows: list, owners };
}

/** Applies changes, one save per document (so each refreshes its pages once). Returns how many prices changed. */
async function save(req: PayloadRequest, changes: PricingChange[]) {
  const { payload } = req;
  const byKey = new Map(changes.map((c) => [c.key, c]));
  const pick = (prefix: string) => changes.filter((c) => c.key.startsWith(prefix));
  let count = 0;

  const roomIds = new Set(pick("room:").map((c) => parseKey(c.key).id));
  for (const id of roomIds) {
    const room: Room = await payload.findByID({ collection: "rooms", id, depth: 0, req });
    const kept = (room.rates ?? []).flatMap((rate) => {
      const change = byKey.get(`room:${id}:${rate.id}`);
      if (!change) return [rate];
      count++;
      if (change.remove) return [];
      return [{ ...rate, ...(change.amount != null && { weekly: change.amount }), ...(change.months != null && { months: change.months }) }];
    });
    const added = pick(`room:${id}:new:`)
      .filter((c) => !c.remove && c.amount != null && c.months != null)
      .map((c) => ({ months: c.months!, weekly: c.amount! }));
    count += added.length;
    // Longest first: the booking picker starts on the first
    const rates = [...kept, ...added].sort((a, b) => b.months - a.months);
    await payload.update({ collection: "rooms", id, data: { rates }, req });
  }

  const locationIds = new Set(pick("location:").map((c) => parseKey(c.key).id));
  for (const id of locationIds) {
    const location: Location = await payload.findByID({ collection: "locations", id, depth: 0, req });
    const kept = (location.prices ?? []).flatMap((price) => {
      const change = byKey.get(`location:${id}:${price.id}`);
      if (!change) return [price];
      count++;
      if (change.remove) return [];
      return [
        {
          ...price,
          ...(change.amount != null && { amount: change.amount }),
          ...(change.label && { label: change.label }),
          ...(change.per && { per: change.per }),
          ...(change.vat && { vat: change.vat }),
          ...(change.note !== undefined && { note: change.note || null }),
        },
      ];
    });
    const added = pick(`location:${id}:new:`)
      .filter((c) => !c.remove && c.amount != null && c.label)
      .map((c) => ({ label: c.label!, amount: c.amount!, per: c.per ?? "month", vat: c.vat ?? "included", note: c.note || null }));
    count += added.length;
    await payload.update({ collection: "locations", id, data: { prices: [...kept, ...added] }, req });
  }

  const fee = byKey.get("rules:joiningFee");
  if (fee?.amount != null) {
    const rules = await payload.findGlobal({ slug: "pricingRules", depth: 0, req });
    await payload.updateGlobal({ slug: "pricingRules", data: { ...rules, joiningFee: fee.amount }, req });
    count++;
  }

  const variableChanges = pick("variable:");
  if (variableChanges.length) {
    const variables = await payload.findGlobal({ slug: "variables", depth: 0, req });
    const entries = (variables.entries ?? []).map((v) => {
      const change = byKey.get(`variable:${v.id}`);
      if (change?.amount == null) return v;
      count++;
      return { ...v, amount: change.amount };
    });
    await payload.updateGlobal({ slug: "variables", data: { entries }, req });
  }
  return count;
}

export const pricingSheet: Endpoint[] = [
  {
    path: "/pricing-sheet",
    method: "get",
    handler: async (req) => {
      if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
      return Response.json(await sheet(req));
    },
  },
  {
    path: "/pricing-sheet",
    method: "post",
    handler: async (req) => {
      if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
      const body = (await req.json?.()) as { changes?: PricingChange[] } | undefined;
      const changes = (body?.changes ?? []).filter(
        (c) =>
          typeof c?.key === "string" &&
          (c.amount == null || (Number.isInteger(c.amount) && c.amount >= 0)) &&
          (c.months == null || (Number.isInteger(c.months) && c.months >= 1)),
      );
      const saved = await save(req, changes);
      return Response.json({ saved, ...(await sheet(req)) });
    },
  },
];
