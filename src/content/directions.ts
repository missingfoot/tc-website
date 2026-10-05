import type { TravelMode } from "@/lib/types";

/** Google Maps embed for the Directions map panel. */
export const mapEmbedUrl = (address: string) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

/** Google Maps directions to an address, for a travel mode's "open in Maps" link. */
export const directionsUrl = (address: string, mode: "transit" | "driving") =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=${mode}`;

// Map addresses are plain street addresses: Google treats them as a search, and a business name
// ("The Collective …") can pin the wrong place or list lots of results.

/** Bedford Square (working space and four event venues), with directions from the events brochure. */
export const bedfordSquareAddress = "14 Bedford Square, London WC1B 3JA";
export const bedfordSquareTravelModes: TravelMode[] = [
  {
    label: "Underground",
    icon: "underground",
    steps: ["Tottenham Court Road (Central and Northern lines) or Goodge Street (Northern line)", "Head to Bedford Square, a short walk from either", "We’re at number 14"],
    mapsUrl: directionsUrl(bedfordSquareAddress, "transit"),
  },
  {
    label: "Bus",
    icon: "bus",
    steps: ["Stop at Great Russell Street or Tottenham Court Road", "Routes 14, 24, 29, 134, 390 and 73 stop nearby", "Night buses: N5, N20, N29, N73, N253 and N279"],
    mapsUrl: directionsUrl(bedfordSquareAddress, "transit"),
  },
  {
    label: "Car",
    icon: "car",
    steps: ["There’s no parking outside, but the square can be used for loading", "The nearest car park is on the corner of Great Russell Street and Adeline Place"],
    mapsUrl: directionsUrl(bedfordSquareAddress, "driving"),
  },
];

export const oldOakAddress = "The Collective Old Oak, Old Oak Lane, London NW10 6FF";
const directions = (mode: "transit" | "driving") => directionsUrl(oldOakAddress, mode);

export const oldOakMapEmbed = mapEmbedUrl(oldOakAddress);

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

/**
 * Generic Underground / Bus / Car directions to an address, for locations without their own yet.
 * TODO: replace with real step-by-step directions per location.
 */
export const simpleTravelModes = (address: string, station: string): TravelMode[] => [
  {
    label: "Underground",
    icon: "underground",
    steps: [`Get off at ${station}`, "Follow the signs for the main exit", "We’re a short walk from the station"],
    mapsUrl: directionsUrl(address, "transit"),
  },
  {
    label: "Bus",
    icon: "bus",
    steps: ["Plenty of bus routes stop nearby", "Check the map for the closest stop", "We’re a short walk from the stop"],
    mapsUrl: directionsUrl(address, "transit"),
  },
  {
    label: "Car",
    icon: "car",
    steps: [`Head for ${address}`, "Parking nearby is limited", "Let us know before you arrive"],
    mapsUrl: directionsUrl(address, "driving"),
  },
];
