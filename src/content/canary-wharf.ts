import {
  Basin, Bed, Bill, CalendarCheck, Cinema, Cocktail, Crowd, Desk, Dumbbell, Hob, Library, Lounge, MeetingTable, Oven, Pool, Restaurant, Router, Sofa, SprayBottle, TapeMeasure, TeamChat, WashingMachine,
} from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import type { FaqItem } from "@/components/sections/Faq";
import { directionsUrl, mapEmbedUrl } from "@/content/directions";
import { oldOakPromos } from "@/content/old-oak";
import type { CircleImage, GalleryImage, PromoCard, Room, RoomDetails, RoomPrice, TravelMode } from "@/lib/types";

// The Collective Canary Wharf: opening soon on this site, so every button joins the waitlist. Facts
// (rooms, sizes, prices, amenities) are from the archived 2019–20 location page and the opening
// press release; layout and tone from the 2019 rebrand design.
// TODO: the photos are low-res (about 1200px; the gym and library 806px): swap in high-res
// originals when there are some, plus photos of the spa and cinema.

export const canaryWharfWaitlist = "/waitlist?location=canary-wharf";
export const canaryWharfAddress = "20 Crossharbour Plaza, London E14 9YF";
export const canaryWharfMapEmbed = mapEmbedUrl(canaryWharfAddress);

const img = "/images/canary-wharf";
const gallery = `${img}/gallery`;
const thumbs = `${gallery}/thumbs`;
const rooms = `${img}/rooms`;
const events = `${img}/events`;

export const canaryWharfTower: CircleImage = {
  src: "/images/co-living/canary-wharf.jpg",
  alt: "The Collective Canary Wharf tower at dusk",
};

const space = (file: string, alt: string): GalleryImage => ({ src: `${gallery}/${file}.jpg`, thumb: `${thumbs}/${file}.jpg`, alt });

export const canaryWharfGallery: GalleryImage[] = [
  space("01-lobby", "Lobby"),
  space("02-sky-lounge", "Sky lounge and bar"),
  space("03-pool", "Rooftop pool"),
  space("04-pool-lounge", "Pool lounge"),
  space("05-shared-kitchen-and-dining", "Shared kitchen"),
  space("06-gym", "Gym"),
  space("07-library", "Library"),
];

/** The cultural programme's Munch, Mix and Jam evenings. */
export const canaryWharfEventsImages: { main: CircleImage; top: CircleImage; bottom: CircleImage } = {
  main: { src: `${events}/jam.jpg`, alt: "Members dancing at a live music night" },
  top: { src: `${events}/mix.jpg`, alt: "A member at a cocktail-making evening" },
  bottom: { src: `${events}/munch.jpg`, alt: "Members sharing pizza at a supper club" },
};

export const canaryWharfOffers: PromoCard[] = [
  {
    heading: "Stay with us: up to 30% off when we open",
    image: { src: `${gallery}/01-lobby.jpg`, alt: "The lobby at Canary Wharf" },
    cta: { label: "Join the waitlist", href: canaryWharfWaitlist },
  },
  {
    heading: "Live with us: your first two weeks free",
    image: { src: `${rooms}/big/01-bed.jpg`, alt: "A Big studio with a queen-size bed" },
    cta: { label: "Join the waitlist", href: canaryWharfWaitlist },
  },
];

/** The closing cards: Old Oak's, with "Like what you see?" joining the waitlist instead of applying. */
export const canaryWharfPromos: PromoCard[] = oldOakPromos.map((card) =>
  card.cta.enquiry ? { ...card, cta: { label: "Join the waitlist", href: canaryWharfWaitlist } } : card,
);

const shared = (size: string) => [
  `Every studio comes with a Simba Hybrid mattress, a 32 inch smart TV, a laptop safe and a clean every two weeks. ${size}, thoughtfully designed and all yours.`,
  "Rent, bills, wifi and every shared space, from the rooftop pool to the cinema, are packaged into one convenient fee.",
];
const nightsAndMonths = "Stay for a night or move in for a while: book a short stay of 1 to 89 nights, or take a membership of 4 to 12 months.";

/** Membership lengths, longest (cheapest per week) first. */
const lengths = [12, 11, 10, 9, 8, 7, 6, 5, 4];
const periods = [...lengths.map((m) => `${m} months`), "A short stay"];

/** Prices by length from weekly rates (in `lengths` order); monthly is weekly × 52 ÷ 12, as on the archived page. */
const pricesFrom = (weekly: number[]): RoomPrice[] =>
  lengths.map((months, i) => ({ months, weekly: weekly[i], monthly: Math.round((weekly[i] * 52) / 12) }));

/** One entry per room type: its card on the location page and its own page. */
const roomTypes = [
  {
    slug: "cosy",
    name: "Cosy",
    prices: pricesFrom([330, 335, 340, 350, 355, 360, 380, 390, 410]),
    features: [
      { icon: Basin, label: "Ensuite Rain Shower" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "12 Square Metres" },
      { icon: Bed, label: "Queen-Size Bed" },
    ],
    about: [
      "Our cleverly designed Cosy studios have a comfortable queen-size bed, a private ensuite with a rain shower, and a kitchenette with a dining ledge.",
      ...shared("12 square metres"),
      nightsAndMonths,
    ],
    photos: [
      ["01-desk-and-bed", "Cosy studio with a dining ledge and the bed beyond"],
      ["02-bed-by-the-window", "Queen-size bed by the window"],
      ["03-bed", "The bed, with plants on the windowsill"],
      ["04-kitchenette", "Kitchenette with a sink and hob"],
    ],
    floorPlan: "Floor plan of a Cosy studio: the entrance and ensuite bathroom, the kitchen and wardrobe along one wall, and the bed by the window",
  },
  {
    slug: "standard",
    name: "Standard",
    prices: pricesFrom([350, 355, 360, 370, 375, 380, 400, 410, 430]),
    features: [
      { icon: Basin, label: "Ensuite Rain Shower" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "16 Square Metres" },
      { icon: Bed, label: "Double Bed" },
    ],
    about: [
      "A little more room to spread out: a double bed by the window, a kitchenette with a breakfast bar, a mirrored wardrobe and open shelving, plus a private ensuite with a rain shower.",
      ...shared("16 square metres"),
      nightsAndMonths,
    ],
    photos: [
      ["01-kitchenette-and-bed", "Standard studio with a kitchenette, breakfast bar and double bed"],
      ["02-bed-and-table", "Double bed and a round table"],
      ["03-bed-by-the-window", "Double bed by the window"],
      ["04-kitchenette", "Kitchenette with a breakfast bar"],
      ["05-sink", "The kitchen sink"],
      ["06-wardrobe", "Mirrored wardrobe beside the bed"],
      ["07-shelves", "Open shelving with glasses and books"],
    ],
    floorPlan: "Floor plan of a Standard studio: the entrance and ensuite bathroom, the kitchen, and the bed by the window",
  },
  {
    slug: "comfy",
    name: "Comfy",
    prices: pricesFrom([380, 385, 390, 400, 405, 410, 430, 440, 460]),
    features: [
      { icon: Basin, label: "Ensuite Walk-in Shower" },
      { icon: Hob, label: "Private Kitchen" },
      { icon: TapeMeasure, label: "18–25 Square Metres" },
      { icon: Bed, label: "Double Bed" },
    ],
    about: [
      "Room for a dining table and an armchair: a double bed, a kitchen with a hob, microwave and plenty of worktop, and an ensuite with a walk-in shower.",
      ...shared("Between 18 and 25 square metres"),
      nightsAndMonths,
    ],
    photos: [
      ["01-bed-and-table", "Comfy studio with a double bed and a dining table"],
      ["02-bed-and-kitchen", "Double bed with the kitchen along the wall"],
      ["03-kitchen", "Kitchen with a tiled splashback"],
      ["04-kitchen-counter", "Kitchen worktop with chopping boards"],
      ["05-shelves", "Shelving and a reading light"],
      ["06-bathroom", "Ensuite bathroom"],
      ["07-shower", "Walk-in shower"],
    ],
    floorPlan: "Floor plan of a Comfy studio: the entrance, kitchen and ensuite bathroom, with the bed and a dining table by the windows",
  },
  {
    slug: "big",
    name: "Big",
    prices: pricesFrom([440, 445, 450, 460, 465, 470, 490, 500, 520]),
    features: [
      { icon: Sofa, label: "Separate Living Area" },
      { icon: Hob, label: "Private Kitchen" },
      { icon: TapeMeasure, label: "30 Square Metres" },
      { icon: Bed, label: "Queen-Size Bed" },
    ],
    about: [
      "Our biggest studios: a queen-size bed, a separate living area with an armchair by the window, a full kitchen, and an ensuite bathroom. Some have views of the river and The O2.",
      ...shared("30 square metres"),
      nightsAndMonths,
    ],
    photos: [
      ["01-bed", "Big studio with a queen-size bed and tall shelving"],
      ["02-living-area", "Living area with a dining table and armchair"],
      ["03-kitchen-and-living-area", "Kitchen and living area"],
      ["04-kitchen", "Kitchen with a hob and microwave"],
      ["05-kitchen-counter", "Kitchen worktop"],
      ["06-armchair-by-the-window", "Armchair by the window"],
      ["07-bed-and-shelves", "Bed and shelves"],
      ["08-shelves", "Shelves with books and plants"],
      ["09-bedside", "Bedside lamp"],
      ["10-bathroom", "Ensuite bathroom"],
      ["11-basin", "Basin in the ensuite"],
    ],
    floorPlan: "Floor plan of a Big studio: the entrance and kitchen, the ensuite bathroom, and the bed and living area along the windows",
  },
];

/** A room type's photos and floor plan: the same set on its card and its page. */
const roomMedia = Object.fromEntries(
  roomTypes.map((room) => [
    room.slug,
    {
      photos: room.photos.map(([file, alt]): GalleryImage => ({ src: `${rooms}/${room.slug}/${file}.jpg`, thumb: `${rooms}/${room.slug}/thumbs/${file}.jpg`, alt })),
      floorPlan: { src: `${img}/floor-plans/${room.slug}.webp`, alt: room.floorPlan } as CircleImage,
    },
  ]),
);

export const canaryWharfRooms: Room[] = roomTypes.map((room) => {
  const { photos, floorPlan } = roomMedia[room.slug];
  return {
    name: room.name,
    price: `From £${room.prices[0].weekly} per week`,
    prices: room.prices,
    image: { src: photos[0].src!, alt: photos[0].alt },
    photos,
    floorPlan,
    features: room.features,
    href: `/locations/canary-wharf/rooms/${room.slug}`,
  };
});

export const canaryWharfRoomDetails: RoomDetails[] = roomTypes.map((room) => ({
  slug: room.slug,
  name: room.name,
  location: "Canary Wharf, Crossharbour",
  price: `£${room.prices[0].weekly}`,
  ...roomMedia[room.slug],
  features: room.features,
  about: room.about,
  booking: { moveIn: "Opening soon", periods },
}));

/** "What's included" on each Canary Wharf room page. */
export const canaryWharfRoomIncluded: RoomDetails["features"] = [
  { icon: Bill, label: "All inclusive bills" },
  { icon: SprayBottle, label: "Fortnightly cleaning" },
  { icon: Router, label: "Superfast broadband" },
  { icon: Pool, label: "Rooftop pool & spa" },
  { icon: Dumbbell, label: "Gym & fitness studio" },
  { icon: CalendarCheck, label: "Events programme" },
  { icon: TeamChat, label: "24/7 concierge" },
  { icon: Sofa, label: "Shared spaces" },
  { icon: Desk, label: "Co-working spaces" },
];

export const canaryWharfAbout = {
  heading: "About The Collective Canary Wharf",
  photos: canaryWharfGallery,
  text: [
    "705 studios over 21 floors, a short walk from Crossharbour DLR. Up on the 20th floor there’s a 14 metre pool, a spa with a sauna and steam room, and a restaurant and bar with views across London.",
    "Downstairs, a cinema, screening room, games room and golf simulator, plus a library, co-working space, gym and a big shared kitchen. And always something on, from supper clubs to live music.",
  ],
};

export const canaryWharfIncluded: FeatureGroup[] = [
  {
    label: "Services",
    items: [
      { icon: Bill, label: "All-inclusive bill" },
      { icon: TeamChat, label: "24/7 concierge" },
      { icon: SprayBottle, label: "Room cleaning" },
      { icon: Router, label: "Superfast broadband" },
      { icon: WashingMachine, label: "Washing machines & tumble dryers" },
    ],
  },
  {
    label: "Community",
    items: [
      { icon: CalendarCheck, label: "Cultural events programme" },
      { icon: Cocktail, label: "Supper clubs, cocktails & live music" },
      { icon: Desk, label: "Co-working spaces" },
      { icon: MeetingTable, label: "Meeting rooms" },
    ],
  },
  {
    label: "Space",
    items: [
      { icon: Pool, label: "Rooftop pool" },
      { icon: Lounge, label: "Spa with sauna & steam room" },
      { icon: Dumbbell, label: "Gym & fitness studio" },
      { icon: Cinema, label: "Cinema & screening room" },
      { icon: Library, label: "Library" },
      { icon: Oven, label: "Communal kitchen & dining room" },
      { icon: Restaurant, label: "Restaurant & bar" },
      { icon: Crowd, label: "Games room & golf simulator" },
    ],
  },
];

export const canaryWharfFaq: FaqItem[] = [
  {
    question: "When does Canary Wharf open?",
    answer: "Soon. Join the waitlist and we’ll let you know as soon as rooms are available, along with our opening offers.",
  },
  // From the archived 2019 page
  {
    question: "Temporary closures",
    answer: [
      "The spa, swimming pool and sauna are scheduled to open on Monday, 4th November.",
      "Mthr, the 20th floor restaurant and bar will open on Monday, 11th November.",
      "Dates are subject to change. For further information please contact the property at +44 (0) 20 3973 9000.",
    ],
  },
  {
    question: "How long can you stay?",
    answer: [
      "Have the flexibility to stay for a night, or longer. No matter how long you stay, we’re sure you’ll feel at home.",
      "As long as you like: a night, a week or a year. Stay with us for 1 to 89 nights, from £80 a night, with your room made up and ready when you arrive.",
      "Or live with us on a 4 to 12 month membership, from £330 a week, with rent, bills, wifi, cleaning and every shared space in one monthly payment.",
    ],
  },
  {
    question: "What can I expect?",
    answer: [
      "Amazing shared spaces, private rooms and an inspiring events programme to better yourself and to meet new people, no matter how short or long you stay.",
      "A private studio with an ensuite rain shower, a kitchenette, a comfy mattress and a smart TV, in a building made for meeting people.",
      "A 14 metre pool and spa on the 20th floor, a cinema, screening room, games room and golf simulator downstairs, plus a library, co-working space, gym and a big communal kitchen. Then there’s the events programme: supper clubs, cocktail making, live music, workshops and more.",
    ],
  },
  {
    question: "Where exactly is it?",
    answer: `${canaryWharfAddress}. Crossharbour DLR station is about a minute’s walk away, and Canary Wharf’s Jubilee and Elizabeth line stations are a short ride or a 10 minute walk.`,
  },
];

const directions = (mode: "transit" | "driving") => directionsUrl(canaryWharfAddress, mode);

export const canaryWharfTravelModes: TravelMode[] = [
  {
    label: "DLR",
    icon: "underground",
    steps: [
      "Take the DLR to Crossharbour (Bank or Stratford to Lewisham)",
      "From the Jubilee or Elizabeth line, change at Canary Wharf",
      "We’re about a minute’s walk from the station",
    ],
    mapsUrl: directions("transit"),
  },
  {
    label: "Bus",
    icon: "bus",
    steps: ["Take the 135, 277, D6 or D8", "Get off at Crossharbour Asda, on East Ferry Road", "We’re a short walk away, next to Crossharbour DLR"],
    mapsUrl: directions("transit"),
  },
  {
    label: "Car",
    icon: "car",
    steps: [`Head for ${canaryWharfAddress}`, "Limited paid parking in our underground car park", "Let us know before you arrive"],
    mapsUrl: directions("driving"),
  },
];
