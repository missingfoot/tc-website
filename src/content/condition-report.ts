// The move-in condition report: what the team recorded in the room at check-in.
// DEMO: the same report for every member. TODO: written per room by the team, with their photos.

export type ConditionArea = {
  area: string;
  condition: "Good" | "Fair";
  notes: string;
  photo?: { src: string; alt: string };
};

const studio = "/images/old-oak/rooms/studio";

export const conditionReport: ConditionArea[] = [
  {
    area: "Bed and mattress",
    condition: "Good",
    notes: "Double bed frame, mattress with protector, two pillows. No marks or damage.",
    photo: { src: `${studio}/01-bed-and-desk.jpg`, alt: "The bed and desk at check-in" },
  },
  {
    area: "Kitchenette",
    condition: "Good",
    notes: "Hob, fridge and microwave all working. Worktop clean, cupboards complete.",
    photo: { src: `${studio}/02-kitchenette-and-bedroom.jpg`, alt: "The kitchenette at check-in" },
  },
  {
    area: "Desk, chair and TV",
    condition: "Fair",
    notes: "Light scratch on the desk’s right-hand edge (about 3cm). TV and remote working.",
    photo: { src: `${studio}/03-desk-and-tv.jpg`, alt: "The desk and TV at check-in" },
  },
  { area: "Bathroom", condition: "Good", notes: "Shower, toilet and basin clean and working. Grout and sealant intact." },
  { area: "Walls, floor and ceiling", condition: "Good", notes: "Freshly painted. Floor clean, no stains." },
  { area: "Windows and blinds", condition: "Good", notes: "Window opens and locks. Blind works, no damage." },
];
