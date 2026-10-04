import type { GalleryImage } from "@/lib/types";

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
