import {
  Basin, CalendarCheck, Cocktail, Dining, DoorEntry, Hob, MeetingTable, Outdoor, Oven, People, Play, Router, Shelves, Sofa, TapeMeasure,
  TeamChat,
} from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import { bedfordSquareAddress, bedfordSquareTravelModes, oldOakAddress, oldOakTravelModes } from "@/content/directions";
import type { GalleryImage, LocationDetails, Room } from "@/lib/types";

// Figures and copy from the 2018 events brochure (TC_Events_Brochure.pdf), which is more complete
// than the old site. TODO: confirm they're still current, and pricing (on request for now).

const img = "/images/event-spaces";

const gallery = (venue: string, photos: [string, string][]): GalleryImage[] =>
  photos.map(([file, alt]) => ({ src: `${img}/${venue}/${file}.jpg`, thumb: `${img}/${venue}/thumbs/${file}.jpg`, alt }));

type Capacity = { standing?: number; seated: number; theatre?: number; classroom?: number; boardroom?: number; uShaped?: number };

// TODO: placeholder icons until the design's arrive: ceiling height (shelves), late licence
// (calendar), lift / step-free access (door), screen and projector (play), air conditioning (router),
// and the seating layouts (sofa, team chat, meeting table)
/** A venue's facilities, by key, so each venue lists only what it has. */
const facilities = {
  wifi: { icon: Router, label: "Wifi" },
  toilets: { icon: Basin, label: "Toilets" },
  kitchen: { icon: Oven, label: "Kitchen access" },
  galley: { icon: Hob, label: "Galley kitchen" },
  smoking: { icon: Outdoor, label: "Outside smoking area" },
  late: { icon: CalendarCheck, label: "Late licence" },
  bar: { icon: Cocktail, label: "Bar" },
  food: { icon: Dining, label: "Food offering" },
  lift: { icon: DoorEntry, label: "Lift access" },
  accessible: { icon: DoorEntry, label: "Step-free access" },
  screen: { icon: Play, label: "TV screen" },
  projector: { icon: Play, label: "Projector & screen" },
  aircon: { icon: Router, label: "Air conditioning" },
};
type FacilityKey = keyof typeof facilities;

/** Area and ceiling, then every layout the venue offers. */
function capacityGroups(area: number, ceiling: string, c: Capacity, have: FacilityKey[]): FeatureGroup[] {
  const layouts: [number | undefined, string][] = [
    [c.standing, "standing"],
    [c.seated, "seated"],
    [c.theatre, "theatre style"],
    [c.classroom, "classroom"],
    [c.boardroom, "boardroom"],
    [c.uShaped, "U-shaped"],
  ];
  return [
    {
      label: "Space & capacity",
      items: [
        { icon: TapeMeasure, label: `${area} m² floor area` },
        { icon: Shelves, label: `${ceiling} ceilings` },
        ...layouts.filter(([n]) => n).map(([n, layout]) => ({ icon: layout === "standing" ? People : layout === "seated" ? Sofa : layout === "boardroom" || layout === "U-shaped" ? MeetingTable : TeamChat, label: `${n} ${layout}` })),
      ],
    },
    { label: "Facilities", items: have.map((key) => facilities[key]) },
  ];
}

/** The card and page header's key facts. */
const keyFacts = (c: Capacity, area: number, ceiling: string): Room["features"] => [
  c.standing ? { icon: People, label: `${c.standing} Standing` } : { icon: MeetingTable, label: `${c.boardroom} Boardroom` },
  { icon: Sofa, label: `${c.seated} Seated` },
  { icon: TapeMeasure, label: `${area} m²` },
  { icon: Shelves, label: `${ceiling} Ceilings` },
];


type VenueInput = {
  slug: string;
  name: string;
  building: "bedford" | "old-oak";
  image: [string, string];
  intro: string[];
  photos: [string, string][];
  area: number;
  ceiling: string;
  capacity: Capacity;
  facilities: FacilityKey[];
};

const buildings = {
  bedford: {
    area: "Bedford Square",
    postcode: "WC1B",
    address: bedfordSquareAddress,
    directionsIntro: "In the heart of Bloomsbury, a short walk from Tottenham Court Road and Goodge Street.",
    travelModes: bedfordSquareTravelModes,
  },
  "old-oak": {
    area: "Old Oak",
    postcode: "NW10",
    address: oldOakAddress,
    directionsIntro: "On the canal at Willesden Junction, with Overground and Underground connections close by.",
    travelModes: oldOakTravelModes,
  },
};

const venue = (v: VenueInput): LocationDetails & { venueFacilities: FeatureGroup[] } => ({
  slug: v.slug,
  name: v.name,
  ...buildings[v.building],
  fromPrice: v.capacity.standing ? `Up to ${v.capacity.standing} guests` : `Seats ${v.capacity.seated}`,
  image: { src: `${img}/${v.slug}/${v.image[0]}.jpg`, alt: v.image[1] },
  features: keyFacts(v.capacity, v.area, v.ceiling),
  intro: v.intro,
  gallery: gallery(v.slug, v.photos),
  prices: [],
  venueFacilities: capacityGroups(v.area, v.ceiling, v.capacity, v.facilities),
});

export const venues = [
  venue({
    slug: "the-den",
    name: "The Den",
    building: "bedford",
    image: ["01-bar", "The Den, with its bar, festoon lighting and hexagon-tiled floor"],
    intro: [
      "A creative venue in the heart of central London, for away days, ideas meetings, parties and corporate events. Designed for community, flexibility and inspiration, it’s as good for big thinkers as it is for a big night.",
      "Ideal for photo shoots, panel discussions, networking, birthdays, supper clubs, conferences and film screenings. Hire it as a shell or have it styled to suit, with a bar, in-house sound system, patio areas and catering.",
    ],
    photos: [
      ["01-bar", "The Den"],
      ["02-lounge", "Lounge area"],
      ["03-room", "The room"],
      ["04-bar-seating", "Bar seating"],
    ],
    area: 142,
    ceiling: "2.5m",
    capacity: { standing: 225, seated: 100, theatre: 90, classroom: 50, boardroom: 30, uShaped: 40 },
    facilities: ["wifi", "toilets", "kitchen", "smoking", "late", "bar", "food", "lift"],
  }),
  venue({
    slug: "the-terrace",
    name: "The Terrace",
    building: "bedford",
    image: ["01-room", "The Terrace, a bright room with festoon lights opening onto the terrace"],
    intro: [
      "A light, bright and creative space for meetings, away days, parties and special occasions, opening out onto its own terrace.",
      "Ideal for photo shoots, panel discussions and networking, or birthdays, BBQs, supper clubs, conferences and film screenings. DJ decks, speakers, a screen and microphones are available as extras.",
    ],
    photos: [
      ["01-room", "The Terrace"],
      ["02-terrace", "The terrace outside"],
      ["03-lounge", "Lounge seating"],
      ["04-from-above", "The terrace from above"],
    ],
    area: 30,
    ceiling: "3m",
    capacity: { standing: 35, seated: 25, classroom: 35, boardroom: 15, uShaped: 20 },
    facilities: ["wifi", "toilets", "kitchen", "smoking", "late", "bar", "food", "screen", "aircon"],
  }),
  venue({
    slug: "the-boardroom",
    name: "The Boardroom",
    building: "bedford",
    image: ["01-dinner", "The Boardroom laid for dinner"],
    intro: [
      "Elegant and ideal for executive and creative meetings alike, the Boardroom comfortably seats 14 around its table in a spacious, characterful room.",
      "A screen and Apple TV are available, along with complimentary drinks and high-speed internet throughout the building.",
    ],
    photos: [
      ["01-dinner", "Laid for dinner"],
      ["02-room", "The Boardroom"],
      ["03-table", "The table"],
    ],
    area: 43,
    ceiling: "3m",
    capacity: { standing: 35, seated: 25, classroom: 35, boardroom: 14, uShaped: 20 },
    facilities: ["wifi", "toilets", "kitchen", "smoking", "late", "bar", "food", "screen"],
  }),
  venue({
    slug: "the-blackroom",
    name: "The Blackroom",
    building: "bedford",
    image: ["01-room", "The Blackroom, with its meeting table and patterned floor"],
    intro: [
      "Despite its name, the Blackroom is bright and vibrant: a creative meeting room seating up to 8 around a boardroom table.",
      "A screen and Apple TV are available, along with complimentary drinks and high-speed internet throughout the building.",
    ],
    photos: [
      ["01-room", "The Blackroom"],
      ["02-table", "The meeting table"],
      ["03-lounge", "Lounge corner"],
    ],
    area: 31,
    ceiling: "3m",
    capacity: { seated: 8, boardroom: 8 },
    facilities: ["wifi", "toilets", "kitchen", "smoking", "bar", "food", "lift", "screen"],
  }),
  venue({
    slug: "the-exchange",
    name: "The Exchange",
    building: "old-oak",
    image: ["01-lounge", "The Exchange, with sofas, plants and a stage lit for an event"],
    intro: [
      "At the heart of our Old Oak building, The Exchange is a versatile space designed for sharing ideas and experiences. Bohemian accents, lush greenery and a raw industrial edge make it a venue guests remember.",
      "Ideal for photo shoots, parties and networking, with a Funktion-One sound system and club-standard DJ booth, programmable lighting, stage options, projection, and a fully stocked bar licensed until 4am.",
    ],
    photos: [
      ["01-lounge", "The Exchange"],
      ["02-bar", "The bar"],
      ["03-tables", "Tables in The Exchange"],
      ["04-dining", "Dining tables"],
    ],
    area: 182,
    ceiling: "6m",
    capacity: { standing: 200, seated: 100, theatre: 100, classroom: 50, boardroom: 30, uShaped: 60 },
    facilities: ["wifi", "toilets", "accessible", "smoking", "late", "bar", "food", "projector"],
  }),
  venue({
    slug: "the-gallery",
    name: "The Gallery",
    building: "old-oak",
    image: ["01-dinner", "The Gallery laid for dinner beside its tall windows"],
    intro: [
      "Beautifully furnished, with 4m floor-to-ceiling windows, The Gallery is a light and bright venue for everything from screenings and lectures to networking, away days and private parties.",
      "Its small kitchen can be closed off, creating an intimate, comfortable space for guests to relax in.",
    ],
    photos: [
      ["01-dinner", "Laid for dinner"],
      ["02-screening", "Set up for a screening"],
      ["03-lounge", "The lounge"],
      ["04-windows", "The windows"],
    ],
    area: 83,
    ceiling: "6m",
    capacity: { standing: 80, seated: 60, theatre: 60, classroom: 50, uShaped: 40 },
    facilities: ["wifi", "toilets", "accessible", "galley", "smoking", "late", "bar", "food", "projector"],
  }),
  venue({
    slug: "the-private-dining-room",
    name: "The Private Dining Room",
    building: "old-oak",
    image: ["01-dinner", "The Private Dining Room’s long walnut table laid for dinner"],
    intro: [
      "With a dramatic walnut table inlaid with copper, the Private Dining Room is the place for impressive meetings, dinners and working days, with a small kitchen for preparing food and drinks.",
      "A screen and Apple TV are available, along with complimentary drinks and high-speed internet throughout the building.",
    ],
    photos: [
      ["01-dinner", "Laid for dinner"],
      ["02-meeting", "A meeting around the table"],
      ["03-room", "The room"],
    ],
    area: 43,
    ceiling: "3m",
    capacity: { seated: 14, boardroom: 14 },
    facilities: ["wifi", "toilets", "galley", "smoking", "late", "bar", "food", "screen"],
  }),
];

/** Venue cards, by building, linking to each venue's page. */
const cards = (building: "bedford" | "old-oak"): Room[] =>
  venues
    .filter((v) => v.area === buildings[building].area)
    .map((v) => ({ name: v.name, subtitle: `${v.area}, ${v.postcode}`, price: v.fromPrice, image: v.image, features: v.features, href: `/event-spaces/${v.slug}` }));
export const bedfordVenues = cards("bedford");
export const oldOakVenues = cards("old-oak");

/** "Look inside" on the Event Spaces page: one photo from each venue. */
export const eventsGallery: GalleryImage[] = venues.map((v) => ({ ...v.gallery[0], alt: v.name }));

/** Venue names for the enquiry form's picker. */
export const venueOptions = venues.map((v) => ({ value: v.slug, label: `${v.name} (${v.area})` }));
