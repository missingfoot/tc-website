import type { Payload } from "payload";
import { formatPence, lowest } from "@/lib/pricing";

export type VariableInfo = { name: string; value: string; about: string };

/**
 * Every variable text can use, with its current value and what it is: lowest prices (of all rooms,
 * and of each room and location by name, for pages that aren't that place), the joining fee, and
 * the Variables global's own. `{lowest-price}` on its own isn't listed with a value: it's the price
 * of whichever room or location the text belongs to.
 */
export async function collectVariables(payload: Payload): Promise<VariableInfo[]> {
  const [rooms, locations, rules, custom] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0 }),
    payload.find({ collection: "locations", sort: "_order", pagination: false, depth: 0 }),
    payload.findGlobal({ slug: "pricingRules", depth: 0 }),
    payload.findGlobal({ slug: "variables", depth: 0 }),
  ]);
  const list: VariableInfo[] = [];

  const roomLows = rooms.docs.map((room) => ({ room, low: lowest((room.rates ?? []).map((r) => ({ amount: r.weekly }))) }));
  const allRooms = lowest(roomLows.flatMap(({ low }) => (low ? [low] : [])));
  if (allRooms) list.push({ name: "lowest-price:rooms", value: formatPence(allRooms.amount), about: "The lowest weekly rate of any Old Oak room" });
  for (const { room, low } of roomLows)
    if (low) list.push({ name: `lowest-price:room:${room.slug}`, value: formatPence(low.amount), about: `The ${room.name}'s lowest weekly rate` });

  for (const location of locations.docs) {
    const low = lowest(location.prices ?? []);
    if (low) list.push({ name: `lowest-price:${location.type}:${location.slug}`, value: formatPence(low.amount), about: `${location.name}'s lowest price (per ${low.per})` });
  }

  if (rules.joiningFee != null) list.push({ name: "joining-fee", value: formatPence(rules.joiningFee), about: "The room application's joining fee (Pricing rules)" });

  for (const v of custom.entries ?? [])
    list.push({ name: v.name, value: v.kind === "money" ? formatPence(v.amount ?? 0) : (v.text ?? ""), about: v.about || "Your own (this page)" });

  return list;
}
