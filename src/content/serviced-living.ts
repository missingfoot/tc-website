import { Basin, Bed, Bill, Car, Hob, Oven, Outdoor, Play, Roundel, Router, Shelves, Sofa, SprayBottle, WashingMachine, Guard, DoorEntry } from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import { simpleTravelModes } from "@/content/directions";
import type { GalleryImage, LocationDetails, PromoCard } from "@/lib/types";

const img = "/images/serviced-living";

const gallery = (folder: string, photos: [string, string][]): GalleryImage[] =>
  photos.map(([file, alt]) => ({ src: `${img}/${folder}/${file}.jpg`, thumb: `${img}/${folder}/thumbs/${file}.jpg`, alt }));

const actonGallery = gallery("acton", [
  ["01-studio", "Studio"],
  ["02-bedroom", "Ensuite bedroom"],
  ["03-loft-bedroom", "Loft bedroom"],
  ["04-studio-desk", "Studio with a desk"],
  ["05-shared-kitchen", "Shared kitchen"],
  ["06-studio-kitchenette", "Studio kitchenette"],
  ["07-studio-window", "Studio"],
  ["08-desk", "Desk"],
  ["09-ensuite-bedroom", "Ensuite bedroom"],
]);

const nottingHillGallery = gallery("notting-hill", [
  ["01-studio", "Studio"],
  ["02-studio-kitchen", "Studio kitchen"],
  ["03-mezzanine-studio", "Mezzanine studio"],
  ["04-mezzanine-kitchen", "Mezzanine studio kitchen"],
  ["05-loft-bed", "Loft bed"],
  ["06-studio-bedroom", "Studio"],
  ["07-studio-lounge", "Studio"],
  ["08-studio-kitchenette", "Studio kitchenette"],
]);

/** "Look inside" on the Serviced Living page: the best of both houses. */
export const servicedGallery: GalleryImage[] = [nottingHillGallery[0], actonGallery[0], nottingHillGallery[2], actonGallery[4], nottingHillGallery[1], actonGallery[1], nottingHillGallery[6], actonGallery[5]];

// TODO: check prices (the old site shows different figures in different places: Acton studios
// £280 or £250, Notting Hill studios £370 or £285; Notting Hill's ensuite rooms were hidden)
export const servicedLocationPages: LocationDetails[] = [
  {
    slug: "acton",
    name: "Acton",
    area: "Gunnersbury Lane",
    postcode: "W3 8HQ",
    fromPrice: "From £250 per week",
    image: { src: `${img}/acton/01-studio.jpg`, alt: "A furnished studio at Acton" },
    features: [
      { icon: Roundel, label: "10 minutes from Acton Town" },
      { icon: Oven, label: "Shared Kitchen" },
      { icon: Outdoor, label: "Garden & BBQ" },
      { icon: Car, label: "Car Parking" },
    ],
    intro: [
      "Experience all that London’s melting pot has to offer. From Greek cafés, Polish fishmongers and Lebanese restaurants, you can find a little bit of everything in Acton, and our serviced living house reflects this perfectly.",
      "With 10 studios and 10 ensuite rooms with shared kitchens, the house has become a tight-knit network of young people living together under one roof. Add a communal lounge and an outside area with a BBQ, and you’ve got the perfect mix of privacy and community.",
      "Oxford Circus is less than 30 minutes from your door, and Heathrow just 25 minutes away.",
    ],
    gallery: actonGallery,
    prices: [
      { label: "Ensuite room", amount: "£250", period: "Per week, all bills included" },
      { label: "Studio", amount: "£280", period: "Per week, all bills included" },
    ],
    address: "Gunnersbury Lane, London W3 8HQ",
    directionsIntro: "Pubs, Gunnersbury Park and independent restaurants on the doorstep, with Acton Town station 10 minutes’ walk away.",
    travelModes: simpleTravelModes("Gunnersbury Lane, London W3 8HQ", "Acton Town"),
  },
  {
    slug: "notting-hill",
    name: "Notting Hill",
    area: "Clanricarde Gardens",
    postcode: "W2 4JW",
    fromPrice: "From £370 per week",
    image: { src: `${img}/notting-hill/01-studio.jpg`, alt: "A bright studio at Notting Hill with a dining table by the window" },
    features: [
      { icon: Roundel, label: "3 minutes from Notting Hill Gate" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: Basin, label: "Ensuite Bathroom" },
      { icon: Bed, label: "Double Bed" },
    ],
    intro: [
      "It shouldn’t need an introduction: one of West London’s most desirable places to live. Our Notting Hill community is made up of high-quality studios with ensuite bathrooms, compact kitchenettes and comfy double beds.",
      "Every studio is fully furnished and comes with our hassle-free living service: one all-inclusive bill (rent, broadband, utilities and council tax), plus regular cleaning and linen changes.",
      "Notting Hill Gate and its three Underground lines are less than 3 minutes away, with Hyde Park and Portobello Market a short stroll from the door.",
    ],
    gallery: nottingHillGallery,
    prices: [{ label: "Studio", amount: "£370", period: "Per week, all bills included" }],
    address: "34 Clanricarde Gardens, London W2 4JW",
    directionsIntro: "Portobello Market, cobbled streets, cafés and Hyde Park all close by, with Notting Hill Gate station just around the corner.",
    travelModes: simpleTravelModes("34 Clanricarde Gardens, London W2 4JW", "Notting Hill Gate"),
  },
];

/** What comes with every room, on the Serviced Living page. */
export const servicedIncluded: FeatureGroup[] = [
  {
    items: [
      { icon: Bill, label: "All-inclusive bills" },
      { icon: SprayBottle, label: "Weekly cleaning" },
      { icon: Bed, label: "Linen changes" },
      { icon: Guard, label: "Concierge service" },
      { icon: Router, label: "Superfast wifi" },
      { icon: Shelves, label: "Fully furnished" },
      { icon: Sofa, label: "Communal spaces" },
      { icon: DoorEntry, label: "Secure entry" },
    ],
  },
];

// TODO: placeholder icons until the design's arrive: flat screen TV (play button), wardrobe
// (shelves) and bedding & linen (bed, shared with double bed)
/** Each house's own amenities, on its page. */
export const servicedLocationIncluded: Record<string, FeatureGroup[]> = {
  acton: [
    {
      items: [
        { icon: Bill, label: "All-inclusive bills" },
        { icon: Router, label: "Wifi" },
        { icon: SprayBottle, label: "Room cleaning" },
        { icon: Bed, label: "Linen change" },
        { icon: Oven, label: "Shared kitchen" },
        { icon: Sofa, label: "Communal lounge" },
        { icon: Basin, label: "Ensuite" },
        { icon: Play, label: "Flat screen TV" },
        { icon: Shelves, label: "Wardrobe" },
        { icon: Bed, label: "Double bed" },
        { icon: Outdoor, label: "Outdoor space" },
        { icon: Car, label: "Car parking" },
      ],
    },
  ],
  "notting-hill": [
    {
      items: [
        { icon: Bill, label: "All-inclusive bills" },
        { icon: Router, label: "Wifi" },
        { icon: SprayBottle, label: "Room cleaning" },
        { icon: Bed, label: "Linen change" },
        { icon: WashingMachine, label: "Laundry facilities" },
        { icon: Hob, label: "Kitchenette" },
        { icon: Basin, label: "Ensuite" },
        { icon: Play, label: "Flat screen TV" },
        { icon: Shelves, label: "Wardrobe" },
        { icon: Bed, label: "Double bed" },
      ],
    },
  ],
};

/** Bottom of the Serviced Living pages: the other ways to live and work with us. */
export const servicedPromos: PromoCard[] = [
  {
    heading: "Live with us",
    image: { src: "/images/co-living/old-oak-exterior.jpg", alt: "The Collective Old Oak building" },
    cta: { label: "Explore co-living", href: "/co-living" },
  },
  {
    heading: "Work with us",
    image: { src: "/images/working/hero.jpg", alt: "Members working at long tables in The Den" },
    cta: { label: "Explore working", href: "/working" },
  },
];
