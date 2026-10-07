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
  /** Only location prices have these to edit; the rest are fixed (rooms are weekly). */
  per?: "night" | "week" | "month" | "once";
  vat?: "included" | "excluded" | "none";
  note?: string;
  /** The admin page it comes from, to open it. */
  href: string;
};

export type PricingChange = { key: string; amount?: number; per?: PricingRow["per"]; vat?: PricingRow["vat"]; note?: string };

const groupNames: Record<keyof typeof locationPaths, string> = { working: "Working spaces", serviced: "Serviced living", venue: "Venues" };

async function rows(req: PayloadRequest): Promise<PricingRow[]> {
  const { payload } = req;
  const [rooms, locations, rules, variables] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0, req }),
    payload.find({ collection: "locations", sort: "_order", pagination: false, depth: 0, req }),
    payload.findGlobal({ slug: "pricingRules", depth: 0, req }),
    payload.findGlobal({ slug: "variables", depth: 0, req }),
  ]);
  const list: PricingRow[] = [];
  for (const room of rooms.docs)
    for (const rate of room.rates ?? [])
      list.push({ key: `room:${room.id}:${rate.id}`, group: "Old Oak rooms", item: room.name, option: `${rate.months} months`, amount: rate.weekly, per: "week", href: `/admin/collections/rooms/${room.id}` });
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
  return list;
}

/** Applies changes, one save per document (so each refreshes its pages once). Returns how many prices changed. */
async function save(req: PayloadRequest, changes: PricingChange[]) {
  const { payload } = req;
  const byKey = new Map(changes.map((c) => [c.key, c]));
  const pick = (prefix: string) => changes.filter((c) => c.key.startsWith(prefix));
  let count = 0;

  const roomIds = new Set(pick("room:").map((c) => Number(c.key.split(":")[1])));
  for (const id of roomIds) {
    const room: Room = await payload.findByID({ collection: "rooms", id, depth: 0, req });
    const rates = (room.rates ?? []).map((rate) => {
      const change = byKey.get(`room:${id}:${rate.id}`);
      if (change?.amount == null) return rate;
      count++;
      return { ...rate, weekly: change.amount };
    });
    await payload.update({ collection: "rooms", id, data: { rates }, req });
  }

  const locationIds = new Set(pick("location:").map((c) => Number(c.key.split(":")[1])));
  for (const id of locationIds) {
    const location: Location = await payload.findByID({ collection: "locations", id, depth: 0, req });
    const prices = (location.prices ?? []).map((price) => {
      const change = byKey.get(`location:${id}:${price.id}`);
      if (!change) return price;
      count++;
      return { ...price, ...(change.amount != null && { amount: change.amount }), ...(change.per && { per: change.per }), ...(change.vat && { vat: change.vat }), ...(change.note !== undefined && { note: change.note || null }) };
    });
    await payload.update({ collection: "locations", id, data: { prices }, req });
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
      return Response.json(await rows(req));
    },
  },
  {
    path: "/pricing-sheet",
    method: "post",
    handler: async (req) => {
      if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
      const body = (await req.json?.()) as { changes?: PricingChange[] } | undefined;
      const changes = (body?.changes ?? []).filter((c) => typeof c?.key === "string" && (c.amount == null || (Number.isInteger(c.amount) && c.amount >= 0)));
      const saved = await save(req, changes);
      return Response.json({ saved, rows: await rows(req) });
    },
  },
];
