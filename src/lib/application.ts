// Room application: costs, payment plans and form options. Everything is worked out from the
// room's weekly price; nothing here talks to a server.
// TODO: confirm the business rules (joining fee, bond lengths, monthly rounding) and the plan copy.

/** "£245" → 245 */
export const parsePrice = (price: string) => Number(price.replace(/[^\d.]/g, ""));

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

export const JOINING_FEE = 100;

export function roomCosts(weeklyPrice: number) {
  const monthly = Math.round((weeklyPrice * 52) / 12);
  return {
    weekly: weeklyPrice,
    monthly,
    /** One week's licence fee; it later becomes part of the security bond. */
    holdingDeposit: weeklyPrice,
    joiningFee: JOINING_FEE,
    /** Paid today, to apply. */
    dueToday: weeklyPrice + JOINING_FEE,
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

export function paymentPlans(weeklyPrice: number, months: number): PaymentPlan[] {
  const { monthly } = roomCosts(weeklyPrice);
  const bond = (weeks: number) => weeklyPrice * weeks;
  return [
    {
      id: "guarantor",
      name: "Option 1",
      headline: `Monthly licence fee ${formatMoney(monthly)}`,
      licenceFee: monthly,
      securityBond: bond(2),
      points: [
        `${formatMoney(bond(2))} security bond (2 weeks)`,
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
      securityBond: bond(5),
      points: [`${formatMoney(bond(5))} security bond (5 weeks)`, "Pay a single monthly bill", "No guarantor needed", "No affordability check"],
    },
    {
      id: "upfront",
      name: "Option 3",
      headline: `All up front ${formatMoney(monthly * months)}`,
      licenceFee: monthly * months,
      securityBond: bond(2),
      points: [`${formatMoney(bond(2))} security bond (2 weeks)`, "Pay the full licence fee up front", "No guarantor needed", "No affordability check"],
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
};
