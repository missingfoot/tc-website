// Room application: costs, payment plans and form options. Everything is worked out from the
// room's weekly rate for the length picked and the pricing rules (/admin → Pricing rules); nothing
// here talks to a server. Amounts are in pounds here (the rate is converted from pence once).
// TODO: confirm the monthly rounding and the plan copy.

/** 1234.5 → "£1,234.50" (pence only when there are any, unless `pence` is set). */
export function formatMoney(amount: number, pence = false) {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence || amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/** "12 months" → 12 */
export const periodMonths = (period: string) => Number.parseInt(period, 10) || 12;

/** The rules for a room application's costs (/admin → Pricing rules). Fee in pounds; the rest in weeks of the rate. */
export type PricingRules = {
  joiningFee: number;
  holdingDepositWeeks: number;
  bondWeeks: { guarantor: number; noGuarantor: number; upfront: number };
};

/** The rules as they were in code: the fallback while Pricing rules isn't set up. */
export const defaultPricingRules: PricingRules = { joiningFee: 100, holdingDepositWeeks: 1, bondWeeks: { guarantor: 2, noGuarantor: 5, upfront: 2 } };

export function roomCosts(weeklyPrice: number, rules: PricingRules) {
  const monthly = Math.round((weeklyPrice * 52) / 12);
  return {
    weekly: weeklyPrice,
    monthly,
    /** Some weeks' licence fee; it later becomes part of the security bond. */
    holdingDeposit: weeklyPrice * rules.holdingDepositWeeks,
    joiningFee: rules.joiningFee,
    /** Paid today, to apply. */
    dueToday: weeklyPrice * rules.holdingDepositWeeks + rules.joiningFee,
  };
}

export type PaymentPlan = {
  id: "guarantor" | "no-guarantor" | "upfront";
  name: string;
  /** The plan's headline price, e.g. "Monthly licence fee £1,062". */
  headline: string;
  /** First licence fee payment: one month, or the whole membership up front. */
  licenceFee: number;
  securityBond: number;
  points: string[];
};

export function paymentPlans(weeklyPrice: number, months: number, rules: PricingRules): PaymentPlan[] {
  const { monthly } = roomCosts(weeklyPrice, rules);
  const { guarantor, noGuarantor, upfront } = rules.bondWeeks;
  const bond = (n: number) => weeklyPrice * n;
  const weeks = (n: number) => `${n} week${n === 1 ? "" : "s"}`;
  return [
    {
      id: "guarantor",
      name: "Option 1",
      headline: `Monthly licence fee ${formatMoney(monthly)}`,
      licenceFee: monthly,
      securityBond: bond(guarantor),
      points: [
        `${formatMoney(bond(guarantor))} security bond (${weeks(guarantor)})`,
        "Pay a single monthly bill",
        "Qualified UK-based guarantor needed",
        "Affordability check",
      ],
    },
    {
      id: "no-guarantor",
      name: "Option 2",
      headline: `Monthly licence fee ${formatMoney(monthly)}`,
      licenceFee: monthly,
      securityBond: bond(noGuarantor),
      points: [`${formatMoney(bond(noGuarantor))} security bond (${weeks(noGuarantor)})`, "Pay a single monthly bill", "No guarantor needed", "No affordability check"],
    },
    {
      id: "upfront",
      name: "Option 3",
      headline: `All up front ${formatMoney(monthly * months)}`,
      licenceFee: monthly * months,
      securityBond: bond(upfront),
      points: [`${formatMoney(bond(upfront))} security bond (${weeks(upfront)})`, "Pay the full licence fee up front", "No guarantor needed", "No affordability check"],
    },
  ];
}

/** Phone country codes for the mobile number field (most common first). */
export const dialCodes = [
  { value: "+44", label: "+44 UK" },
  { value: "+353", label: "+353 Ireland" },
  { value: "+1", label: "+1 US/Canada" },
  { value: "+33", label: "+33 France" },
  { value: "+49", label: "+49 Germany" },
  { value: "+34", label: "+34 Spain" },
  { value: "+39", label: "+39 Italy" },
  { value: "+31", label: "+31 Netherlands" },
  { value: "+351", label: "+351 Portugal" },
  { value: "+48", label: "+48 Poland" },
  { value: "+91", label: "+91 India" },
  { value: "+86", label: "+86 China" },
  { value: "+61", label: "+61 Australia" },
];

// ISO 3166-1 alpha-2 codes; names come from the browser/Node (Intl), so they're always spelled right
const regionCodes =
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

const regionNames = new Intl.DisplayNames(["en-GB"], { type: "region" });

/** Countries for the nationality picker: the UK first, then A–Z. */
export const nationalities = [
  "United Kingdom",
  ...regionCodes
    .filter((code) => code !== "GB")
    .map((code) => regionNames.of(code) ?? code)
    .sort((a, b) => a.localeCompare(b, "en-GB")),
];

/** What the application page needs to know about the room being applied for. */
export type ApplicationRoom = {
  slug: string;
  name: string;
  location: string;
  floor: string;
  photo: { src: string; alt: string };
  weeklyPrice: number;
  moveIn: string;
  /** Membership period picked on the room page, e.g. "12 months". */
  period: string;
  rules: PricingRules;
};
