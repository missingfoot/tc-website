import {
  Basin, Bed, Bill, CalendarCheck, Desk, Dumbbell, Guard, Hob, Router, Sofa, SprayBottle, TapeMeasure, WashingMachine,
} from "@/components/icons";
import type { CircleImage, GalleryImage, PromoCard, Review, Room, RoomDetails, Testimonial } from "@/lib/types";
import { site } from "@/config/site";

const gallery = "/images/old-oak/gallery";
const thumbs = `${gallery}/thumbs`;

export const oldOakGallery: GalleryImage[] = [
  { src: `${gallery}/01-lobby.jpg`, thumb: `${thumbs}/01-lobby.jpg`, alt: "Lobby" },
  { src: `${gallery}/02-dining-room.jpg`, thumb: `${thumbs}/02-dining-room.jpg`, alt: "Dining room" },
  { src: `${gallery}/03-kitchen.jpg`, thumb: `${thumbs}/03-kitchen.jpg`, alt: "Kitchen" },
  { src: `${gallery}/04-roof-terrace.jpg`, thumb: `${thumbs}/04-roof-terrace.jpg`, alt: "Roof terrace" },
  { src: `${gallery}/05-reception.jpg`, thumb: `${thumbs}/05-reception.jpg`, alt: "Reception" },
  { src: `${gallery}/06-library.jpg`, thumb: `${thumbs}/06-library.jpg`, alt: "Library" },
  { src: `${gallery}/07-cinema.jpg`, thumb: `${thumbs}/07-cinema.jpg`, alt: "Cinema room" },
  { src: `${gallery}/08-gym.jpg`, thumb: `${thumbs}/08-gym.jpg`, alt: "Gym" },
  { src: `${gallery}/09-restaurant.jpg`, thumb: `${thumbs}/09-restaurant.jpg`, alt: "Restaurant" },
  { src: `${gallery}/10-coworking.jpg`, thumb: `${thumbs}/10-coworking.jpg`, alt: "Workspace" },
  { src: `${gallery}/11-spa.jpg`, thumb: `${thumbs}/11-spa.jpg`, alt: "Spa" },
];

const benefits = "/images/old-oak/benefits";

export const oldOakBenefitsImages: { main: CircleImage; top: CircleImage; bottom: CircleImage } = {
  main: { src: `${benefits}/live-music.jpg`, alt: "A resident playing guitar in the lounge", position: "38% 50%" },
  top: { src: `${benefits}/yoga.jpg`, alt: "A resident doing yoga", position: "42% 50%" },
  bottom: { src: `${benefits}/shared-dinner.jpg`, alt: "Residents sharing dinner around a long table" },
};

const community = "/images/old-oak/community";

export const oldOakCommunityCards: PromoCard[] = [
  {
    heading: "Unforgettable events",
    image: { src: `${community}/events-party.jpg`, alt: "Residents dancing at an Old Oak party" },
    cta: { label: "Join events", href: "/blog/category/community" },
  },
  {
    heading: "Meet your community hosts",
    image: { src: `${community}/community-hosts.jpg`, alt: "Four community hosts sitting together on a sofa", position: "bottom" },
    cta: { label: "Meet the team", href: "/blog/meet-ed-head-of-community-experience-at-the-collective" },
  },
];

const rooms = "/images/old-oak/rooms";

export const oldOakRooms: Room[] = [
  {
    name: "Ensuite",
    price: "£245 per week",
    image: { src: `${rooms}/ensuite.jpg`, alt: "Ensuite bedroom with a double bed and window" },
    features: [
      { icon: Basin, label: "Private Bathroom" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "11.6 Square Metres" },
      { icon: Bed, label: "Single Room" },
    ],
    href: `/locations/old-oak/rooms/ensuite`,
  },
  {
    name: "Studio",
    price: "£290 per week",
    image: { src: `${rooms}/studio.jpg`, alt: "Studio room with a bed by a large window" },
    features: [
      { icon: Basin, label: "Private Bathroom" },
      { icon: Hob, label: "Shared Kitchen" },
      { icon: TapeMeasure, label: "12 Square Metres" },
      { icon: Bed, label: "Double Room" },
    ],
    href: `/locations/old-oak/rooms/studio`,
  },
  {
    name: "One Bed Flat",
    price: "£365 per week",
    image: { src: `${rooms}/one-bed-flat.jpg`, alt: "One bed flat with a kitchen and living space" },
    features: [
      { icon: Basin, label: "Private Bathroom" },
      { icon: Hob, label: "Private Kitchenette" },
      { icon: TapeMeasure, label: "28 Square Metres" },
      { icon: Bed, label: "Double Room" },
    ],
    href: `/locations/old-oak/rooms/one-bed-flat`,
  },
];

const buildingPhotos = [3, 2, 4, 8].map((i) => oldOakGallery[i - 1]);

// TODO: each room's own photos (for now its card photo, then shared building photos), about
// copy for the Studio and One Bed Flat (they reuse the Ensuite's), and real move-in dates,
// floors and membership periods.
const ensuiteAbout = [
  "Our ensuite rooms are fully equipped with a comfy queen-size bed, bedding and bed linen, desk and desk chair, 24 inch television, ample storage and of course, free wi-fi. Cosy, thoughtfully-designed and all yours.",
  "For the days you want to kick back and relax, the shared kitchenette offers the perfect place to rustle up a quick meal before curling up with a book or catching up on some netflix.",
];

const booking: RoomDetails["booking"] = {
  moveIn: "Available now",
  floor: "17–19",
  periods: ["12 months", "6 months", "3 months"],
};

export const oldOakRoomDetails: RoomDetails[] = oldOakRooms.map((room) => ({
  slug: room.href.split("/").pop()!,
  name: room.name,
  location: "Old Oak, Willesden Junction",
  price: room.price.replace(" per week", ""),
  // No separate thumbnail for the room photo yet: the full image doubles as one
  photos: [{ src: room.image.src, thumb: room.image.src, alt: room.image.alt }, ...buildingPhotos],
  features: room.features,
  about: [...ensuiteAbout, `Rooms start from ${room.price}.`],
  // TODO: each room's own plan; the labelled Ensuite plan stands in for all of them for now
  floorPlan: { src: "/images/old-oak/floor-plans/ensuite-labelled-2200.png", alt: "Floor plan showing your room, the shared bathroom and your neighbour’s room" },
  booking,
}));

/** "What's included" on each Old Oak room page. */
export const oldOakRoomIncluded: RoomDetails["features"] = [
  { icon: Bill, label: "All inclusive bills" },
  { icon: SprayBottle, label: "Bi-weekly cleaning" },
  { icon: WashingMachine, label: "Laundry facilities" },
  { icon: Dumbbell, label: "Onsite gym" },
  { icon: CalendarCheck, label: "Flexible membership" },
  { icon: Router, label: "Superfast broadband" },
  { icon: Guard, label: "24/7 concierge" },
  { icon: Sofa, label: "Communal spaces" },
  { icon: Desk, label: "Work spaces" },
];

// TODO: the room video (this is the residents' video)
export const oldOakAbout = {
  heading: "About The Old Oak Collective",
  video: "https://youtu.be/XkZbmXgOWOA",
  poster: { src: `${gallery}/03-kitchen.jpg`, alt: "A shared kitchen at Old Oak" } as CircleImage,
  text: [
    "At The Collective we believe that beautifully designed spaces bring people together. Whether you’re looking to mingle with new people, get creative in the kitchen or open yourself up to new experiences, The Old Oak Collective can give you all this and more.",
    "From the bar, communal kitchens and spa to the library and gym, your passion points will be catered for. Not to mention the occasional roof party!",
  ],
};

const residents = "/images/old-oak/residents";

// Names from the old site. Alex and TJ are confirmed by the design; Amna, Josie and Fab are
// matched to portraits by best guess. TODO: confirm, and add each resident's own video.
const residentVideo = "https://youtu.be/XkZbmXgOWOA";

export const oldOakTestimonials: Testimonial[] = [
  { name: "Alex", image: { src: `${residents}/resident-1.jpg`, alt: "Alex, an Old Oak resident" }, video: residentVideo },
  { name: "Fab", image: { src: `${residents}/resident-2.jpg`, alt: "Fab, an Old Oak resident" }, video: residentVideo },
  { name: "Josie", image: { src: `${residents}/resident-3.jpg`, alt: "Josie, an Old Oak resident" }, video: residentVideo },
  { name: "Amna", image: { src: `${residents}/resident-4.jpg`, alt: "Amna, an Old Oak resident" }, video: residentVideo },
  { name: "TJ", image: { src: `${residents}/resident-5.jpg`, alt: "TJ, an Old Oak resident" }, video: residentVideo },
];

// Profiles from the old site. TODO: the newsletter sign-up URL
export const socialLinks: import("@/components/sections/SocialLinks").SocialLink[] = [
  { platform: "youtube", label: "The Collective on YouTube", href: "https://www.youtube.com/thecollectiveliving" },
  { platform: "twitter", label: "The Collective on Twitter", href: "https://twitter.com/collective_llp" },
  { platform: "facebook", label: "The Collective on Facebook", href: "https://www.facebook.com/thecollectiveliving" },
  { platform: "instagram", label: "The Collective on Instagram", href: "https://www.instagram.com/thecollective_living" },
  { platform: "email", label: "Email The Collective", href: `mailto:${site.email}` },
];

const promos = "/images/old-oak/promos";

export const oldOakPromos: PromoCard[] = [
  {
    heading: "Is Co-Living for me?",
    image: { src: `${promos}/friends-chatting.jpg`, alt: "Two residents laughing together in the lounge" },
    cta: { label: "Find out now", href: "/co-living" },
  },
  {
    heading: "Like what you see?",
    image: { src: `${promos}/bar-night.jpg`, alt: "Residents chatting at the bar" },
    cta: { label: "Apply now", href: "/apply", enquiry: "living" },
  },
];

const reviewers = "/images/old-oak/reviews";

/** Reviews of The Collective Old Oak, word for word (typos included: they're people's own words). */
export const oldOakReviews: Review[] = [
  {
    name: "Joe Guimaraes",
    photo: `${reviewers}/joe-guimaraes.jpg`,
    rating: 5,
    text: [
      "I couldn't have asked for more!",
      "I am a student here in London looking to make new friends and grasp exciting opportunities in the business world - I am happy to say that I nailed my decision to base my self at the Old Oak.",
      "The communal areas provided me the opportunity to network with other undergrads, but mainly post grads and young professionals, who would tell me the ins and outs of their stat-up stories - what to do, and what not to do. What a time.",
    ],
  },
  {
    name: "Jennine Fox",
    photo: `${reviewers}/jennine-fox.jpg`,
    rating: 5,
    text: [
      "I stayed as a guest for the night, it was ideal and good value for money- much prefer this than paying for an overpriced hotel! The room was very clean and had everything I needed for a night in London (shampoo, shower gel, soap, hair dryer and a towel were all included).",
      "I was on the 8th floor and the view was quite decent too.",
      "The service from reception was good, the food and coffee in the bar was good!",
      "Two of my friends are residents here and showed me round the building and I was impressed with the different amenities the residents have access too!",
      "I would definitely book this again.",
    ],
  },
  {
    name: "Carly Lipman",
    photo: `${reviewers}/carly-lipman.jpg`,
    rating: 5,
    text: [
      "Truly inspiring company and culture. What they are creating for young working professionals is something different, innovative and exciting. The company ethos and the vision I have no doubt will create huge success and communities in a way we have not seen before.",
      "Connecting individuals through working and living, this is a lifestyle everyone will want to be part of!",
    ],
  },
  {
    name: "Karen Ren",
    photo: `${reviewers}/karen-ren.jpg`,
    rating: 5,
    text: [
      "Honestly this is one of my best renting experience in London. The studio is sooo amazing, providing me with excellent living condition and opportunities to meet others from all over the world. I love it and will definitely recommend it to my friends who will be in London.",
    ],
  },
  {
    name: "Dan Pavel",
    photo: `${reviewers}/dan-pavel.jpg`,
    rating: 5,
    text: [
      "I stayed in The Collective for a few nights as a guest and absolutely loved it! As an architect, I was intrigued by the clever use of space in order to comfortably accommodate as many people as possible. I loved the community, the different events that take place there and the staff.",
    ],
  },
  {
    name: "Frank Xie",
    photo: `${reviewers}/frank-xie.jpg`,
    rating: 5,
    text: [
      'Well I shared the place with my friend in one of your studios last week. So honestly I am not 100% qualified to make this review as a tenant. But the place really amazed me. The room is not that large but it is comfortable enough to feel at home. I love the design and the atmosphere there, not to mention the concept "co-living". Having experience with school accommodations, shared flats and personal studio, I\'ve got to say it s easier said than done to get ppl live together, share lifestyle and actually make friends. But the Collective has got it right. Ace!',
    ],
  },
  {
    name: "Mixalis Galen",
    photo: `${reviewers}/mixalis-galen.jpg`,
    rating: 5,
    text: [
      "The studio I am living at is lovely. It's very bright and whenever I have a question the customer service always responds promptly and gently. I have friends moving to London and I will definitely recommend to stay in one of their properties. I've seen pics of a new building the've created in west London so that should be a great experience and a great opportunity for them to meet new people",
    ],
  },
];
