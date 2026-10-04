// TODO: placeholder icons where the design's aren't in the library yet (hot desking, bar &
// kitchen, private offices, breakout areas, restaurants) — swap when the SVGs arrive.
import {
  Bike, Bill, Cctv, Cocktail, Dining, DoorEntry, Guard, People, Roundel, Router, Shelves, Sofa, SprayBottle, Train,
} from "@/components/icons";
import type { ChecklistItem } from "@/components/sections/Checklist";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import type { GalleryImage, Room } from "@/lib/types";

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
    title: "Flexible Memberships",
    text: "An all-inclusive monthly bill covers everything: rent, utilities, council tax, cleaning and linen changes. No hidden costs, just life without the hassle.",
  },
  {
    title: "Workshops and learning",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
  {
    title: "Business support",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
  {
    title: "Connected community",
    text: "Community is at the heart of what we do. We share meals, dreams, ideas and lessons, making everyday extraordinary and make new friends.",
  },
  {
    title: "Events and activities",
    text: "Well-designed communal spaces to work, play and relax. Make new friends in beautiful interiors designed to bring people together.",
  },
  {
    title: "Inspiring spaces",
    text: "Whatever you need, whenever you need it, our onsite support team are here to help. We have a 24/7 concierge and maintenance teams always on standby.",
  },
];

// TODO: postcodes for Old Oak, Kings Cross and the Doughnut Factory (the design shows WC1B on all) and links
export const workingLocations: Room[] = [
  {
    name: "Bedford Square",
    subtitle: "WC1B",
    price: "From £150 per month",
    image: { src: `${img}/locations/bedford-square.jpg`, alt: "The lounge at Bedford Square" },
    features: [
      { icon: Roundel, label: "Central Line & Kings Cross" },
      { icon: Cocktail, label: "Bar & Kitchen" },
      { icon: Shelves, label: "Hot Desking" },
      { icon: DoorEntry, label: "Private Offices" },
    ],
    href: "#",
  },
  {
    name: "Old Oak",
    subtitle: "NW10",
    price: "From £150 per month",
    image: { src: `${img}/locations/old-oak.jpg`, alt: "The workspace at Old Oak" },
    features: [
      { icon: Train, label: "Overground & Underground" },
      { icon: Dining, label: "Restaurant & Bar" },
      { icon: Shelves, label: "Hot Desking" },
      { icon: Sofa, label: "Breakout Areas" },
    ],
    href: "/locations/old-oak",
  },
  {
    name: "Kings Cross",
    subtitle: "WC1B",
    price: "From £150 per month",
    image: { src: `${img}/locations/kings-cross.jpg`, alt: "Desks at Kings Cross" },
    features: [
      { icon: Roundel, label: "40m from Kings Cross" },
      { icon: Dining, label: "Restaurants Nearby" },
      { icon: Shelves, label: "Hot Desking" },
      { icon: Sofa, label: "Breakout Areas" },
    ],
    href: "#",
  },
  {
    name: "The Doughnut Factory",
    subtitle: "WC1B",
    price: "From £150 per month",
    image: { src: `${img}/locations/doughnut-factory.jpg`, alt: "The open-plan workspace at the Doughnut Factory" },
    features: [
      { icon: Roundel, label: "Piccadilly Line" },
      { icon: Cocktail, label: "Bar & Kitchen" },
      { icon: Shelves, label: "Hot Desking" },
      { icon: DoorEntry, label: "Private Offices" },
    ],
    href: "#",
  },
];

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
