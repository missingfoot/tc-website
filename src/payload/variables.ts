import type { Payload } from "payload";
import { formatPence, lowest, resolvePrices } from "@/lib/pricing";
import { findPlaces } from "./places";

export type VariableInfo = { name: string; value: string; about: string };

/**
 * Every variable text can use, with its current value and what it is: lowest prices (of all rooms,
 * and of each room and location by name, for pages that aren't that place), the joining fee, and
 * the Variables global's own. `{lowest-price}` and `{name}` on their own aren't listed with a
 * value: they're the price and name of whichever room or location the text belongs to.
 */
export async function collectVariables(payload: Payload): Promise<VariableInfo[]> {
  const [rooms, rules, custom, structure, ...places] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0 }),
    payload.findGlobal({ slug: "pricingRules", depth: 0 }),
    payload.findGlobal({ slug: "variables", depth: 0 }),
    payload.findGlobal({ slug: "pricingStructure", depth: 0 }),
    ...(["coliving", "working", "serviced"] as const).map((kind) => findPlaces(payload, kind, 0)),
  ]);
  const list: VariableInfo[] = [];

  // A bedroom's home: its building's co-living (its page is under it)
  const homes = places.flat().filter((p) => p.kind === "coliving");
  const roomLows = rooms.docs.map((room) => ({
    room,
    building: homes.find((home) => home.id === room.building),
    low: lowest((room.rates ?? []).map((r) => ({ amount: r.weekly }))),
  }));
  const allRooms = lowest(roomLows.flatMap(({ low }) => (low ? [low] : [])));
  if (allRooms) list.push({ name: "lowest-price:rooms", value: formatPence(allRooms.amount), about: "The lowest weekly rate of any bedroom, in any building" });
  for (const { room, building, low } of roomLows) {
    if (!low || !building) continue;
    const full = `lowest-price:room:${building.slug}:${room.slug}`;
    list.push({ name: full, value: formatPence(low.amount), about: `${building.name}'s ${room.name}: its lowest weekly rate` });
    // The short name, without the building, while no other building has a room with its address
    if (roomLows.filter((r) => r.room.slug === room.slug).length === 1)
      list.push({ name: `lowest-price:room:${room.slug}`, value: formatPence(low.amount), about: `The same as {${full}}, while it's the only room called this` });
  }

  for (const place of places.flat()) {
    const plans = place.kind === "working" ? structure.working : place.kind === "serviced" ? structure.serviced : [];
    const low =
      place.kind === "coliving"
        ? lowest(roomLows.filter((r) => r.building?.id === place.id).flatMap(({ low }) => (low ? [{ ...low, per: "week" }] : [])))
        : lowest(resolvePrices(place.prices, plans));
    if (low) list.push({ name: `lowest-price:${place.kind}:${place.slug}`, value: formatPence(low.amount), about: `${place.name}'s lowest price (per ${low.per})` });
  }

  if (rules.joiningFee != null) list.push({ name: "joining-fee", value: formatPence(rules.joiningFee), about: "The room application's joining fee (Pricing rules)" });

  for (const v of custom.entries ?? [])
    list.push({ name: v.name, value: v.kind === "money" ? formatPence(v.amount ?? 0) : (v.text ?? ""), about: v.about || "Your own (this page)" });

  return list;
}
