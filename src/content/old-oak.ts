import type { CircleImage, GalleryImage, PromoCard, Room, Testimonial } from "@/lib/types";

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
  { src: `${gallery}/10-coworking.jpg`, thumb: `${thumbs}/10-coworking.jpg`, alt: "Co-working space" },
  { src: `${gallery}/11-spa.jpg`, thumb: `${thumbs}/11-spa.jpg`, alt: "Spa" },
];

const benefits = "/images/old-oak/benefits";

export const oldOakBenefitsImages: { main: CircleImage; top: CircleImage; bottom: CircleImage } = {
  main: { src: `${benefits}/live-music.jpg`, alt: "A resident playing guitar in the lounge", position: "38% 50%" },
  top: { src: `${benefits}/yoga.jpg`, alt: "A resident doing yoga", position: "42% 50%" },
  bottom: { src: `${benefits}/shared-dinner.jpg`, alt: "Residents sharing dinner around a long table" },
};

const community = "/images/old-oak/community";

// TODO: link targets
export const oldOakCommunityCards: PromoCard[] = [
  {
    heading: "Unforgettable events",
    image: { src: `${community}/events-party.jpg`, alt: "Residents dancing at an Old Oak party" },
    cta: { label: "Join events", href: "#" },
  },
  {
    heading: "Meet your community hosts",
    image: { src: `${community}/community-hosts.jpg`, alt: "Four community hosts sitting together on a sofa", position: "bottom" },
    cta: { label: "Meet the team", href: "#" },
  },
];

const rooms = "/images/old-oak/rooms";

export const oldOakRooms: Room[] = [
  {
    name: "Ensuite",
    price: "£245 per week",
    image: { src: `${rooms}/ensuite.jpg`, alt: "Ensuite bedroom with a double bed and window" },
    features: [
      { icon: "bathroom", label: "Private Bathroom" },
      { icon: "kitchen", label: "Private Kitchenette" },
      { icon: "size", label: "11.6 Square Metres" },
      { icon: "room", label: "Single Room" },
    ],
    href: "#",
  },
  {
    name: "Studio",
    price: "£290 per week",
    image: { src: `${rooms}/studio.jpg`, alt: "Studio room with a bed by a large window" },
    features: [
      { icon: "bathroom", label: "Private Bathroom" },
      { icon: "kitchen", label: "Shared Kitchen" },
      { icon: "size", label: "12 Square Metres" },
      { icon: "room", label: "Double Room" },
    ],
    href: "#",
  },
  {
    name: "One Bed Flat",
    price: "£365 per week",
    image: { src: `${rooms}/one-bed-flat.jpg`, alt: "One bed flat with a kitchen and living space" },
    features: [
      { icon: "bathroom", label: "Private Bathroom" },
      { icon: "kitchen", label: "Private Kitchenette" },
      { icon: "size", label: "28 Square Metres" },
      { icon: "room", label: "Double Room" },
    ],
    href: "#",
  },
];

const residents = "/images/old-oak/residents";

// TODO: placeholder names (only "Alex" was in the design) and one shared video; replace with
// each resident's real name and their own video.
const residentVideo = "https://youtu.be/XkZbmXgOWOA";

export const oldOakTestimonials: Testimonial[] = [
  { name: "Alex", image: { src: `${residents}/resident-1.jpg`, alt: "Alex, an Old Oak resident" }, video: residentVideo },
  { name: "Sophie", image: { src: `${residents}/resident-2.jpg`, alt: "Sophie, an Old Oak resident" }, video: residentVideo },
  { name: "Jess", image: { src: `${residents}/resident-3.jpg`, alt: "Jess, an Old Oak resident" }, video: residentVideo },
  { name: "Amara", image: { src: `${residents}/resident-4.jpg`, alt: "Amara, an Old Oak resident" }, video: residentVideo },
  { name: "Tom", image: { src: `${residents}/resident-5.jpg`, alt: "Tom, an Old Oak resident" }, video: residentVideo },
];

// TODO: real profile links and the newsletter sign-up URL
export const socialLinks: import("@/components/sections/SocialLinks").SocialLink[] = [
  { platform: "youtube", label: "The Collective on YouTube", href: "#" },
  { platform: "twitter", label: "The Collective on Twitter", href: "#" },
  { platform: "facebook", label: "The Collective on Facebook", href: "#" },
  { platform: "instagram", label: "The Collective on Instagram", href: "#" },
  { platform: "email", label: "Email The Collective", href: "mailto:hello@example.com" },
];

const promos = "/images/old-oak/promos";

// TODO: link targets
export const oldOakPromos: PromoCard[] = [
  {
    heading: "Is Co-Living for me?",
    image: { src: `${promos}/friends-chatting.jpg`, alt: "Two residents laughing together in the lounge" },
    cta: { label: "Find out now", href: "#" },
  },
  {
    heading: "Like what you see?",
    image: { src: `${promos}/bar-night.jpg`, alt: "Residents chatting at the bar" },
    cta: { label: "Apply now", href: "#" },
  },
];
