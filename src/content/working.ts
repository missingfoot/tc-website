import {
  BarKitchen, Bike, Bill, Calendar, Cctv, Cocktail, Community, Desk, DoorEntry, FruitBowl, Guard, Handshake, Lounge,
  MeetingTable, Membership, Microwave, Padlock, People, PrivateOffice, Restaurant, RestaurantsNearby, Roundel, Router,
  Shelves, Sofa, SprayBottle, SunCloud, Train, Workshop,
} from "@/components/icons";
import type { ChecklistItem } from "@/components/sections/Checklist";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import { directionsUrl, oldOakAddress, oldOakTravelModes } from "@/content/directions";
import type { CircleImage, GalleryImage, Price, Room, TravelMode } from "@/lib/types";

const img = "/images/working";

export const workingSpaces: GalleryImage[] = [
  ["01-meeting-rooms", "Private meeting rooms"],
  ["02-cafe-bar", "Café and bar"],
  ["03-hot-desks", "Hot desks"],
  ["04-lounge", "The lounge"],
  ["05-fixed-desks", "Fixed desks"],
  ["06-phone-booths", "Phone booths"],
  ["07-communal-tables", "Communal tables"],
  ["08-breakout-area", "Breakout areas"],
  ["09-event-space", "Event space"],
  ["10-gym", "Gym"],
  ["11-roof-terrace", "Roof terrace"],
].map(([file, caption]) => ({ src: `${img}/spaces/${file}.jpg`, thumb: `${img}/spaces/thumbs/${file}.jpg`, alt: caption }));

// TODO: copy is as in the design, where several items repeat placeholder text
export const workingHowItWorks: ChecklistItem[] = [
  {
    icon: Membership,
    title: "Flexible Memberships",
    text: "An all-inclusive monthly bill covers everything: rent, utilities, council tax, cleaning and linen changes. No hidden costs, just life without the hassle.",
  },
  {
    icon: Workshop,
    title: "Workshops and learning",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
  {
    icon: Handshake,
    title: "Business support",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
  {
    icon: Community,
    title: "Connected community",
    text: "Community is at the heart of what we do. We share meals, dreams, ideas and lessons, making everyday extraordinary and make new friends.",
  },
  {
    icon: Calendar,
    title: "Events and activities",
    text: "Well-designed communal spaces to work, play and relax. Make new friends in beautiful interiors designed to bring people together.",
  },
  {
    icon: Lounge,
    title: "Inspiring spaces",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
];

/** A working space: its card on the Working page and its own page at /working/[slug]. */
export type WorkingLocation = {
  slug: string;
  name: string;
  /** Neighbourhood, shown before the postcode: "Bloomsbury, WC1B". */
  area: string;
  postcode: string;
  /** Card price, e.g. "From £150 per month". */
  fromPrice: string;
  image: CircleImage;
  /** Transport and key facilities: the card's tiles and the page header's rows. */
  features: Room["features"];
  /** Intro paragraphs on the location page. */
  intro: string[];
  gallery: GalleryImage[];
  prices: Price[];
  /** Full address: drives the map and the "open in Maps" links. */
  address: string;
  /** Intro under "Well connected". */
  directionsIntro: string;
  travelModes: TravelMode[];
};

// TODO: copy, photos and prices for each location. The design only has Bedford Square, so the
// others reuse its intro, the Working page's gallery and its prices (incl. Private Office where
// the location doesn't list offices). Postcodes for Old Oak, Kings Cross and the Doughnut
// Factory (the design shows WC1B on all), and the Doughnut Factory's area.
const denIntro = [
  "When we built The Den we wanted to make the perfect environment for the next generation of creators to turn their ideas into reality.",
  "Our aim is to help every person that enters our space succeed, by providing the space, services, community and support needed to let them focus on the work they love.",
];

// TODO: real directions for Bedford Square, Kings Cross and the Doughnut Factory (and check
// those addresses: only Bedford Square's is from the site config).
const placeholderTravelModes = (address: string, station: string): TravelMode[] => [
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

const deskPrices: Price[] = [
  { label: "Hot Desk", amount: "£150", period: "Per month +VAT" },
  { label: "Private Office", amount: "£650", period: "Per month +VAT" },
];

export const workingLocationPages: WorkingLocation[] = [
  {
    slug: "bedford-square",
    name: "Bedford Square",
    area: "Bloomsbury",
    postcode: "WC1B",
    fromPrice: "From £150 per month",
    image: { src: `${img}/locations/bedford-square.jpg`, alt: "The lounge at Bedford Square" },
    features: [
      { icon: Roundel, label: "Central Line & Kings Cross" },
      { icon: BarKitchen, label: "Bar & Kitchen" },
      { icon: Desk, label: "Hot Desking" },
      { icon: PrivateOffice, label: "Private Offices" },
    ],
    intro: denIntro,
    gallery: workingSpaces,
    prices: deskPrices,
    address: "The Collective, 14 Bedford Square, London WC1B 3JA",
    directionsIntro:
      "Tucked away on one of Bloomsbury’s finest Georgian squares, Bedford Square is minutes from Tottenham Court Road and Kings Cross.",
    travelModes: placeholderTravelModes("The Collective, 14 Bedford Square, London WC1B 3JA", "Tottenham Court Road"),
  },
  {
    slug: "old-oak",
    name: "Old Oak",
    area: "Willesden Junction",
    postcode: "NW10",
    fromPrice: "From £150 per month",
    image: { src: `${img}/locations/old-oak.jpg`, alt: "The workspace at Old Oak" },
    features: [
      { icon: Train, label: "Overground & Underground" },
      { icon: Restaurant, label: "Restaurant & Bar" },
      { icon: Desk, label: "Hot Desking" },
      { icon: Sofa, label: "Breakout Areas" },
    ],
    intro: denIntro,
    gallery: workingSpaces,
    prices: deskPrices,
    address: oldOakAddress,
    directionsIntro:
      "Situated on the banks of the canal in Willesden Junction, Old Oak is perfectly positioned to access London, with both tube and rail connections close by.",
    travelModes: oldOakTravelModes,
  },
  {
    slug: "kings-cross",
    name: "Kings Cross",
    area: "Kings Cross",
    postcode: "WC1B",
    fromPrice: "From £150 per month",
    image: { src: `${img}/locations/kings-cross.jpg`, alt: "Desks at Kings Cross" },
    features: [
      { icon: Roundel, label: "40m from Kings Cross" },
      { icon: RestaurantsNearby, label: "Restaurants Nearby" },
      { icon: Desk, label: "Hot Desking" },
      { icon: Sofa, label: "Breakout Areas" },
    ],
    intro: denIntro,
    gallery: workingSpaces,
    prices: deskPrices,
    address: "The Collective Kings Cross, London",
    directionsIntro:
      "Just 40m from Kings Cross station, with the Underground, national rail and Eurostar on the doorstep.",
    travelModes: placeholderTravelModes("The Collective Kings Cross, London", "Kings Cross St Pancras"),
  },
  {
    slug: "doughnut-factory",
    name: "The Doughnut Factory",
    area: "London",
    postcode: "WC1B",
    fromPrice: "From £150 per month",
    image: { src: `${img}/locations/doughnut-factory.jpg`, alt: "The open-plan workspace at the Doughnut Factory" },
    features: [
      { icon: Roundel, label: "Piccadilly Line" },
      { icon: BarKitchen, label: "Bar & Kitchen" },
      { icon: Desk, label: "Hot Desking" },
      { icon: PrivateOffice, label: "Private Offices" },
    ],
    intro: denIntro,
    gallery: workingSpaces,
    prices: deskPrices,
    address: "The Doughnut Factory, London",
    directionsIntro:
      "On the Piccadilly line, the Doughnut Factory is easy to reach from across London.",
    travelModes: placeholderTravelModes("The Doughnut Factory, London", "the nearest Piccadilly line station"),
  },
];

/** The Working page's location cards, linking to each location's page. */
export const workingLocations: Room[] = workingLocationPages.map((location) => ({
  name: location.name,
  subtitle: `${location.area}, ${location.postcode}`,
  price: location.fromPrice,
  image: location.image,
  features: location.features,
  href: `/working/${location.slug}`,
}));

/** "What's included" on the Working page. */
export const workingIncluded: FeatureGroup[] = [
  {
    items: [
      { icon: Bill, label: "All-inclusive bill" },
      { icon: Shelves, label: "Furnished work spaces" },
      { icon: Router, label: "Ultra fast wifi" },
      { icon: Bike, label: "Secured bike storage" },
      { icon: SprayBottle, label: "Cleaning" },
      { icon: People, label: "Networking opportunities" },
      { icon: DoorEntry, label: "Secured door entry" },
      { icon: Guard, label: "24/7 concierge & security" },
      { icon: Cctv, label: "Building wide CCTV" },
    ],
  },
];

/** "What's included" on each location page. */
export const workingLocationIncluded: FeatureGroup[] = [
  {
    items: [
      { icon: Bill, label: "All-inclusive bill" },
      { icon: Shelves, label: "Furnished work spaces" },
      { icon: Router, label: "Ultra fast wifi" },
      { icon: MeetingTable, label: "Meeting rooms" },
      { icon: DoorEntry, label: "24 hour access" },
      { icon: Bike, label: "Secured bike storage" },
      { icon: Sofa, label: "Breakout areas" },
      { icon: SunCloud, label: "Roof terrace" },
      { icon: Padlock, label: "Lockers" },
      { icon: Microwave, label: "Kitchen" },
      { icon: BarKitchen, label: "Coffee & tea" },
      { icon: Cocktail, label: "Bar" },
      { icon: FruitBowl, label: "Fruits & snacks" },
      { icon: SprayBottle, label: "Cleaning" },
      { icon: People, label: "Networking opportunities" },
      { icon: DoorEntry, label: "Secured door entry" },
      { icon: Guard, label: "24/7 concierge & security" },
      { icon: Cctv, label: "Building wide CCTV" },
    ],
  },
];
