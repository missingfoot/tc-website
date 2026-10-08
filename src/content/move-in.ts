// Getting ready to move in: what the account's move-in page shows new members.
// TODO: confirm the real check-in times, lists and app links with the team.

/** Arrival slots on check-in day. */
export const arrivalSlots = ["14:00 – 16:00", "16:00 – 18:00", "18:00 – 20:00"];

/** Things to do before arriving that only the member can tick off (others tick themselves, e.g. the Direct Debit). */
export const manualChecklist = [
  { id: "app", title: "Get The Collective app", body: "For laundry, printing, booking spaces and letting guests in once you’re here." },
  { id: "address", title: "Update your address", body: "Give your new postal address to your bank, employer and anyone who sends you post." },
  { id: "insurance", title: "Sort contents insurance", body: "Your belongings aren’t covered by our insurance, so we recommend your own." },
];

/** App store links. */
export const appLinks = [
  { label: "App Store", href: "#" },
  { label: "Google Play", href: "#" },
];

export const provided = [
  "A furnished room with a double bed and mattress",
  "Bed linen and towels, with regular linen changes",
  "A fully equipped kitchen to share",
  "Wi-Fi, bills and council tax",
  "Room cleaning every two weeks",
];

export const toBring = [
  "Photo ID (passport or driving licence) to collect your keys",
  "Your phone, with the app installed",
  "Plug adaptors, if you’re coming from abroad",
  "Anything that makes it feel like home",
];
