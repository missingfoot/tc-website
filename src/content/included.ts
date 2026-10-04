import {
  Bed, Bike, Bill, CalendarCheck, Cctv, Chef, Cocktail, Dining, DoorEntry, Dumbbell, Groceries, Guard,
  HandsHeart, Outdoor, Oven, People, Plane, Router, Shelves, Sofa, SprayBottle, TeamChat,
  WashingMachine, Wrench,
} from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";

export const oldOakIncluded: FeatureGroup[] = [
  {
    label: "Services",
    items: [
      { icon: Bill, label: "All-inclusive bill" },
      { icon: Wrench, label: "On-site maintenance" },
      { icon: Bed, label: "Linen change" },
      { icon: SprayBottle, label: "Bi-weekly room clean" },
      { icon: Router, label: "Ultra Fast Wifi" },
    ],
  },
  {
    label: "Community",
    items: [
      { icon: Plane, label: "Community outings" },
      { icon: HandsHeart, label: "Community clubs" },
      { icon: People, label: "Networking" },
      { icon: CalendarCheck, label: "Access to events" },
      { icon: TeamChat, label: "Community team 24/7" },
    ],
  },
  {
    label: "Space",
    items: [
      { icon: Shelves, label: "Furnished personal space" },
      { icon: Sofa, label: "Furnished communal spaces" },
      { icon: WashingMachine, label: "Laundry facilities" },
      { icon: Dining, label: "Private dining room" },
      { icon: Oven, label: "Shared kitchen" },
      { icon: Outdoor, label: "Outdoor space" },
      { icon: Cocktail, label: "Private event spaces" },
      { icon: Groceries, label: "Grocery store" },
      { icon: Chef, label: "Restaurant" },
      { icon: Dumbbell, label: "Gym" },
    ],
  },
  {
    label: "Safety & Security",
    items: [
      { icon: DoorEntry, label: "Secured door entry" },
      { icon: Bike, label: "Secured bike storage" },
      { icon: Guard, label: "Security guards 24/7" },
      { icon: Cctv, label: "Building wide CCTV" },
    ],
  },
];
