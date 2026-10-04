import type { TravelMode } from "@/lib/types";

const destination = encodeURIComponent("The Collective Old Oak, Old Oak Lane, London NW10 6FF");
const directions = (mode: "transit" | "driving") =>
  `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${mode}`;

export const oldOakMapEmbed = `https://www.google.com/maps?q=${destination}&output=embed`;

export const oldOakTravelModes: TravelMode[] = [
  {
    label: "Underground",
    icon: "underground",
    steps: [
      "Leave the station toward Old Oak Lane",
      "Turn left at the Sandflames Grill",
      "Continue walking down Old Oak Lane until you reach the second, larger roundabout",
      "We’re the big glass building on the other side!",
    ],
    mapsUrl: directions("transit"),
  },
  // TODO: placeholder directions — the design only shows the Underground steps
  {
    label: "Overground",
    icon: "overground",
    steps: ["Get off at Willesden Junction", "Head south down Old Oak Lane", "We’re the big glass building by the canal"],
    mapsUrl: directions("transit"),
  },
  {
    label: "Bus",
    icon: "bus",
    steps: ["Take a bus to Old Oak Lane", "Walk south toward the canal", "We’re the big glass building by the canal"],
    mapsUrl: directions("transit"),
  },
  {
    label: "Car",
    icon: "car",
    steps: ["Head for Old Oak Lane, NW10 6FF", "Follow signs for the canal-side entrance", "Parking is limited, so let us know before you arrive"],
    mapsUrl: directions("driving"),
  },
];
