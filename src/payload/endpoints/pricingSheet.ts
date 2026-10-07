import type { Endpoint, PayloadRequest } from "payload";
import type { PricePlan } from "@/lib/pricing";

/**
 * The admin's Pricing page (fields/PricingSheet.tsx) reads and saves every price through these:
 * GET returns each kind's structure and grid, POST saves the sections it's sent. Signed-in only.
 *
 * - Rooms: the membership lengths (the grid's columns) and each room's weekly rate per length.
 * - Working spaces and serviced living: the plans (columns, with optional standard prices) and
 *   each place's entries: its own price, the standard one (amount null), or not offered (none).
 * - Rules: the joining fee and the deposit and bonds in weeks. Variables: the money ones.
 */

export type RoomRow = { id: number; name: string; href: string; rates: { months: number; weekly: number }[] };
export type LocationRow = { id: number; name: string; href: string; prices: { plan: string; amount: number | null }[] };
export type PlanGrid = { plans: (PricePlan & { id: string })[]; rows: LocationRow[] };
export type Rules = { joiningFee: number; holdingDepositWeeks: number; bondWeeks: { guarantor: number; noGuarantor: number; upfront: number } };
export type MoneyVariable = { id: string; name: string; about: string; amount: number };

export type PricingData = {
  rooms: { lengths: number[]; rows: RoomRow[] };
  working: PlanGrid;
  serviced: PlanGrid;
  rules: Rules;
  variables: MoneyVariable[];
};

/** What a save sends: any of the sections, whole. */
export type PricingSave = Partial<PricingData>;

async function read(req: PayloadRequest): Promise<PricingData> {
  const { payload } = req;
  const [rooms, locations, structure, rules, variables] = await Promise.all([
    payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0, req }),
    payload.find({ collection: "locations", sort: "_order", pagination: false, depth: 0, req }),
    payload.findGlobal({ slug: "pricingStructure", depth: 0, req }),
    payload.findGlobal({ slug: "pricingRules", depth: 0, req }),
    payload.findGlobal({ slug: "variables", depth: 0, req }),
  ]);
  const grid = (type: "working" | "serviced"): PlanGrid => ({
    plans: (structure[type] ?? []).map((p) => ({ id: p.id!, label: p.label, amount: p.amount ?? null, per: p.per, vat: p.vat, note: p.note ?? null })),
    rows: locations.docs
      .filter((l) => l.type === type)
      .map((l) => ({ id: l.id, name: l.name, href: `/admin/collections/locations/${l.id}`, prices: (l.prices ?? []).map((p) => ({ plan: p.plan, amount: p.amount ?? null })) })),
  });
  return {
    rooms: {
      lengths: (structure.roomLengths ?? []).map((l) => l.months),
      rows: rooms.docs.map((r) => ({ id: r.id, name: r.name, href: `/admin/collections/rooms/${r.id}`, rates: (r.rates ?? []).map(({ months, weekly }) => ({ months, weekly })) })),
    },
    working: grid("working"),
    serviced: grid("serviced"),
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

/** Saves the sections sent: structure first (so places' entries can name new plans), then places, rules, variables. */
async function save(req: PayloadRequest, data: PricingSave) {
  const { payload } = req;
  const structure = await payload.findGlobal({ slug: "pricingStructure", depth: 0, req });
  const plans = (grid?: PlanGrid) =>
    grid?.plans
      .filter((p) => p.label?.trim())
      .map((p) => ({ id: p.id, label: p.label.trim(), amount: pence(p.amount) ?? null, per: p.per, vat: p.vat, note: p.note?.trim() || null }));
  const lengths = data.rooms?.lengths.filter((m) => Number.isInteger(m) && m >= 1);
  if (lengths || data.working || data.serviced)
    await payload.updateGlobal({
      slug: "pricingStructure",
      data: {
        roomLengths: lengths ? [...new Set(lengths)].sort((a, b) => b - a).map((months) => ({ months })) : structure.roomLengths,
        working: plans(data.working) ?? structure.working,
        serviced: plans(data.serviced) ?? structure.serviced,
      },
      req,
    });

  // Rooms: a rate for each length offered, longest first (the booking picker starts on the first)
  for (const row of data.rooms?.rows ?? []) {
    const rates = row.rates
      .filter((r) => (lengths ?? [r.months]).includes(r.months) && pence(r.weekly) !== undefined)
      .sort((a, b) => b.months - a.months)
      .map(({ months, weekly }) => ({ months, weekly }));
    await payload.update({ collection: "rooms", id: row.id, data: { rates }, req });
  }

  // Locations: entries for plans that exist, each its own price or the standard one (null)
  for (const grid of [data.working, data.serviced]) {
    if (!grid) continue;
    const planIds = new Set(grid.plans.map((p) => p.id));
    for (const row of grid.rows) {
      const prices = row.prices.filter((p) => planIds.has(p.plan)).map((p) => ({ plan: p.plan, amount: pence(p.amount) ?? null }));
      await payload.update({ collection: "locations", id: row.id, data: { prices }, req });
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
