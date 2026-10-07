import type { Endpoint, PayloadRequest } from "payload";
import type { PricePlan } from "@/lib/pricing";
import type { Offering } from "../fields/place";
import { findPlaces, type Place } from "../places";

/**
 * The admin's Pricing page (fields/PricingSheet.tsx) reads and saves every price through these:
 * GET returns each kind's structure and grid, POST saves the sections it's sent. Signed-in only.
 *
 * - Bedrooms, per building with co-living: its membership lengths (the grid's columns) and each of its
 *   rooms' weekly rate per length.
 * - Working spaces and serviced living: the plans (columns, with optional standard prices) and
 *   each building's entries: its own price, the standard one (amount null), or not offered (none).
 * - Rules: the joining fee and the deposit and bonds in weeks. Variables: the money ones.
 */

export type RoomRow = { id: number; name: string; href: string; rates: { months: number; weekly: number }[] };
export type RoomBuilding = { id: number; name: string; href: string; lengths: number[]; rows: RoomRow[] };
export type LocationRow = { id: number; name: string; href: string; prices: { plan: string; amount: number | null }[] };
export type PlanGrid = { plans: (PricePlan & { id: string })[]; rows: LocationRow[] };
export type Rules = { joiningFee: number; holdingDepositWeeks: number; bondWeeks: { guarantor: number; noGuarantor: number; upfront: number } };
export type MoneyVariable = { id: string; name: string; about: string; amount: number };

export type PricingData = {
  rooms: RoomBuilding[];
  working: PlanGrid;
  serviced: PlanGrid;
  rules: Rules;
  variables: MoneyVariable[];
};

/** What a save sends: any of the sections, whole. */
export type PricingSave = Partial<PricingData>;

async function read(req: PayloadRequest): Promise<PricingData> {
  const { payload } = req;
  const [rooms, colivings, working, serviced, structure, rules, variables] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0, req }),
    findPlaces(payload, "coliving", 0, req),
    findPlaces(payload, "working", 0, req),
    findPlaces(payload, "serviced", 0, req),
    payload.findGlobal({ slug: "pricingStructure", depth: 0, req }),
    payload.findGlobal({ slug: "pricingRules", depth: 0, req }),
    payload.findGlobal({ slug: "variables", depth: 0, req }),
  ]);
  // A row's id is its building's
  const grid = (type: "working" | "serviced", places: Place[]): PlanGrid => ({
    plans: (structure[type] ?? []).map((p) => ({ id: p.id!, label: p.label, amount: p.amount ?? null, per: p.per, vat: p.vat, note: p.note ?? null })),
    rows: places.map((l) => ({ id: l.id, name: l.name, href: `/admin/collections/buildings/${l.id}`, prices: (l.prices ?? []).map((p) => ({ plan: p.plan, amount: p.amount ?? null })) })),
  });
  return {
    rooms: colivings.map((building) => ({
      id: building.id,
      name: building.name,
      href: `/admin/collections/buildings/${building.id}`,
      lengths: (building.roomLengths ?? []).map((l) => l.months),
      rows: rooms.docs
        .filter((r) => r.building === building.id)
        .map((r) => ({ id: r.id, name: r.name, href: `/admin/collections/rooms/${r.id}`, rates: (r.rates ?? []).map(({ months, weekly }) => ({ months, weekly })) })),
    })),
    working: grid("working", working),
    serviced: grid("serviced", serviced),
    rules: {
      joiningFee: rules.joiningFee ?? 0,
      holdingDepositWeeks: rules.holdingDepositWeeks ?? 0,
      bondWeeks: { guarantor: rules.bondWeeks?.guarantor ?? 0, noGuarantor: rules.bondWeeks?.noGuarantor ?? 0, upfront: rules.bondWeeks?.upfront ?? 0 },
    },
    variables: (variables.entries ?? []).filter((v) => v.kind !== "text").map((v) => ({ id: v.id!, name: v.name, about: v.about ?? "", amount: v.amount ?? 0 })),
  };
}

const pence = (n: unknown) => (typeof n === "number" && Number.isInteger(n) && n >= 0 ? n : undefined);
const count = (n: unknown) => (typeof n === "number" && Number.isInteger(n) && n >= 0 ? n : undefined);

/** Changes some of a building's offering's fields (its tab), keeping the rest. */
async function updateOffering(req: PayloadRequest, id: number, kind: Offering, change: Record<string, unknown>) {
  const building = await req.payload.findByID({ collection: "buildings", id, depth: 0, req });
  await req.payload.update({ collection: "buildings", id, data: { [kind]: { ...building[kind], ...change } }, req });
}

/** Saves the sections sent: structure first (so places' entries can name new plans), then places, rules, variables. */
async function save(req: PayloadRequest, data: PricingSave) {
  const { payload } = req;
  const structure = await payload.findGlobal({ slug: "pricingStructure", depth: 0, req });
  const plans = (grid?: PlanGrid) =>
    grid?.plans
      .filter((p) => p.label?.trim())
      .map((p) => ({ id: p.id, label: p.label.trim(), amount: pence(p.amount) ?? null, per: p.per, vat: p.vat, note: p.note?.trim() || null }));
  if (data.working || data.serviced)
    await payload.updateGlobal({
      slug: "pricingStructure",
      data: { working: plans(data.working) ?? structure.working, serviced: plans(data.serviced) ?? structure.serviced },
      req,
    });

  // Rooms, per building: its lengths, then a rate for each of them its rooms offer, longest first
  // (the booking picker starts on the first)
  for (const building of data.rooms ?? []) {
    const lengths = [...new Set(building.lengths.filter((m) => Number.isInteger(m) && m >= 1))].sort((a, b) => b - a);
    await updateOffering(req, building.id, "coliving", { roomLengths: lengths.map((months) => ({ months })) });
    for (const row of building.rows) {
      const rates = row.rates
        .filter((r) => lengths.includes(r.months) && pence(r.weekly) !== undefined)
        .sort((a, b) => b.months - a.months)
        .map(({ months, weekly }) => ({ months, weekly }));
      await payload.update({ collection: "rooms", id: row.id, data: { rates }, req });
    }
  }

  // Working spaces and serviced living: entries for plans that exist, each its own price or the standard one (null)
  for (const [kind, grid] of [["working", data.working], ["serviced", data.serviced]] as const) {
    if (!grid) continue;
    const planIds = new Set(grid.plans.map((p) => p.id));
    for (const row of grid.rows) {
      const prices = row.prices.filter((p) => planIds.has(p.plan)).map((p) => ({ plan: p.plan, amount: pence(p.amount) ?? null }));
      await updateOffering(req, row.id, kind, { prices });
    }
  }

  if (data.rules) {
    const r = data.rules;
    const current = await payload.findGlobal({ slug: "pricingRules", depth: 0, req });
    await payload.updateGlobal({
      slug: "pricingRules",
      data: {
        joiningFee: pence(r.joiningFee) ?? current.joiningFee,
        holdingDepositWeeks: count(r.holdingDepositWeeks) ?? current.holdingDepositWeeks,
        bondWeeks: {
          guarantor: count(r.bondWeeks?.guarantor) ?? current.bondWeeks?.guarantor,
          noGuarantor: count(r.bondWeeks?.noGuarantor) ?? current.bondWeeks?.noGuarantor,
          upfront: count(r.bondWeeks?.upfront) ?? current.bondWeeks?.upfront,
        },
      },
      req,
    });
  }

  if (data.variables) {
    const current = await payload.findGlobal({ slug: "variables", depth: 0, req });
    const amounts = new Map(data.variables.map((v) => [v.id, pence(v.amount)]));
    const entries = (current.entries ?? []).map((v) => (amounts.get(v.id!) !== undefined ? { ...v, amount: amounts.get(v.id!) } : v));
    await payload.updateGlobal({ slug: "variables", data: { entries }, req });
  }
}

export const pricingSheet: Endpoint[] = [
  {
    path: "/pricing-sheet",
    method: "get",
    handler: async (req) => {
      if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
      return Response.json(await read(req));
    },
  },
  {
    path: "/pricing-sheet",
    method: "post",
    handler: async (req) => {
      if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
      const data = ((await req.json?.()) ?? {}) as PricingSave;
      await save(req, data);
      return Response.json(await read(req));
    },
  },
];
