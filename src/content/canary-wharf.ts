import {
  Basin, Bed, Bill, CalendarCheck, Cocktail, Crowd, Desk, Dumbbell, Hob, Lounge, MeetingTable, Oven, Play,
  Pool, Restaurant, Router, Shelves, Sofa, SprayBottle, TapeMeasure, TeamChat, WashingMachine,
} from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import type { FaqItem } from "@/components/sections/Faq";
import { directionsUrl, mapEmbedUrl } from "@/content/directions";
import type { CircleImage, GalleryImage, PromoCard, Room, TravelMode } from "@/lib/types";

// The Collective Canary Wharf: opening soon on this site, so every button joins the waitlist. Facts
// (rooms, sizes, prices, amenities) are from the archived 2019–20 location page and the opening
// press release; layout and tone from the 2019 rebrand design.
// TODO: the photos are low-res stand-ins (about 1200px) from the design files: swap in high-res
// originals, plus photos of the pool, spa, cinema and kitchen.

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

export const canaryWharfGallery: GalleryImage[] = [
  { src: `${gallery}/01-lounge.jpg`, thumb: `${thumbs}/01-lounge.jpg`, alt: "Lounge" },
  { src: `${gallery}/02-library.jpg`, thumb: `${thumbs}/02-library.jpg`, alt: "Library" },
  { src: `${rooms}/cosy.jpg`, thumb: `${thumbs}/03-cosy.jpg`, alt: "Cosy studio" },
  { src: `${rooms}/standard.jpg`, thumb: `${thumbs}/04-standard.jpg`, alt: "Standard studio" },
  { src: `${rooms}/comfy.jpg`, thumb: `${thumbs}/05-comfy.jpg`, alt: "Comfy studio" },
  { src: `${rooms}/big.jpg`, thumb: `${thumbs}/06-big.jpg`, alt: "Big studio" },
  { src: canaryWharfTower.src, thumb: `${thumbs}/07-tower.jpg`, alt: "The tower", position: "center 30%" },
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
    image: { src: `${gallery}/01-lounge.jpg`, alt: "The lounge at Canary Wharf" },
    cta: { label: "Join the waitlist", href: canaryWharfWaitlist },
  },
  {
    heading: "Live with us: your first two weeks free",
    image: { src: `${rooms}/big.jpg`, alt: "A Big studio with a queen-size bed" },
    cta: { label: "Join the waitlist", href: canaryWharfWaitlist },
  },
];

export const canaryWharfRooms: Room[] = [
  {
    name: "Cosy",
    price: "From £330 per week",
    image: { src: `${rooms}/cosy.jpg`, alt: "Cosy studio with a kitchenette and a queen-size bed" },
    features: [
      { icon: Basin, label: "Ensuite Rain Shower" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "12 Square Metres" },
      { icon: Bed, label: "Queen-Size Bed" },
    ],
    href: canaryWharfWaitlist,
  },
  {
    name: "Standard",
    price: "From £350 per week",
    image: { src: `${rooms}/standard.jpg`, alt: "Standard studio with a kitchenette and dining bar" },
    features: [
      { icon: Basin, label: "Ensuite Rain Shower" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "16 Square Metres" },
      { icon: Bed, label: "Double Bed" },
    ],
    href: canaryWharfWaitlist,
  },
  {
    name: "Comfy",
    price: "From £400 per week",
    image: { src: `${rooms}/comfy.jpg`, alt: "Comfy studio with a double bed and a dining table" },
    features: [
      { icon: Basin, label: "Ensuite Rain Shower" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "18–25 Square Metres" },
      { icon: Bed, label: "Double Bed" },
    ],
    href: canaryWharfWaitlist,
  },
  {
    name: "Big",
    price: "From £2,817 per month",
    image: { src: `${rooms}/big.jpg`, alt: "Big studio with a queen-size bed and tall shelving" },
    features: [
      { icon: Sofa, label: "Separate Living Area" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "30 Square Metres" },
      { icon: Bed, label: "Queen-Size Bed" },
    ],
    href: canaryWharfWaitlist,
  },
];

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
      { icon: Play, label: "Cinema & screening room" },
      { icon: Shelves, label: "Library" },
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
  {
    question: "How long can I stay?",
    answer: [
      "As long as you like: a night, a week or a year. Stay with us for 1 to 89 nights, from £80 a night, with your room made up and ready when you arrive.",
      "Or live with us on a 3 to 12 month membership, from £330 a week, with rent, bills, wifi, cleaning and every shared space in one monthly payment.",
    ],
  },
  {
    question: "What can I expect?",
    answer: [
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
