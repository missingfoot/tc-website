// The account's Good to know tab: house info members look up now and then. Taken from the FAQ
// (src/content/faq.ts), so keep the two in step.

export type HouseInfo = {
  title: string;
  body: string;
  icon: "desk" | "cleaning" | "guests" | "quiet" | "repairs" | "decorating" | "parking" | "pets";
  /** A link for doing something about it, e.g. reporting a repair. */
  link?: { href: string; label: string };
};

export const houseInfo: HouseInfo[] = [
  { title: "Front desk", body: "Open 24/7 in the lobby. The team signs for parcels while you’re out, so collect them when you’re back.", icon: "desk" },
  { title: "Cleaning and linen", body: "Your room is cleaned and your linen changed every two weeks, and the shared spaces every day.", icon: "cleaning" },
  { title: "Guests", body: "Friends can stay in your room, and for longer visits we have guest rooms at £60 a night.", icon: "guests" },
  { title: "Quiet hours", body: "From 10pm Sunday to Thursday, and from midnight on Friday and Saturday.", icon: "quiet" },
  {
    title: "Repairs",
    body: "Our maintenance team fixes anything from a lightbulb to a chair leg.",
    icon: "repairs",
    link: { href: "/account/support/new/maintenance", label: "Report a repair" },
  },
  { title: "Decorating", body: "Make yourself at home, but please don’t hammer anything into the walls. Damage comes out of your deposit.", icon: "decorating" },
  { title: "Parking", body: "There’s no parking on site, but members can rent Zipcars, with the first year’s subscription free.", icon: "parking" },
  { title: "Pets", body: "Unfortunately pets aren’t allowed.", icon: "pets" },
];
