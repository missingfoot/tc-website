import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import * as icons from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import type { Location, Media, Page, Room as RoomDoc } from "@/payload-types";
import type { CircleImage, GalleryImage, LocationDetails, Room, RoomDetails, TravelMode } from "@/lib/types";
import { locationPaths, type LocationType } from "@/payload/collections/Locations";
import { roomsPath } from "@/payload/collections/Rooms";

/**
 * Reading Payload content on the server, through Payload's local API (no HTTP round trip: Payload
 * runs inside this Next app). Server only.
 */
const payload = () => getPayload({ config });

/** The Payload page with this slug, if there is one. */
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { docs } = await (await payload()).find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1, depth: 2 });
  return docs[0] ?? null;
});

/** Every Payload page's slug, for pre-building them. */
export async function getPageSlugs(): Promise<string[]> {
  const { docs } = await (await payload()).find({ collection: "pages", limit: 1000, depth: 0, select: { slug: true } });
  return docs.map((doc) => doc.slug);
}

/**
 * An uploaded image as the site's image shape. Its url is the file's public address in R2. A crop
 * is framed by the section's own position if it has one, otherwise by the focal point set on the
 * photo in the Media library.
 */
export function mediaImage(media: number | Media | null | undefined, position?: string | null): CircleImage {
  if (!media || typeof media === "number") return { src: "", alt: "" };
  const focalPoint = media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined;
  return { src: media.url ?? "", alt: media.alt, blur: media.blur ?? undefined, position: position ?? focalPoint };
}

/** Body text as paragraphs: editors separate them with a blank line. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** The locations of one type (working spaces, serviced living houses or venues), in their admin order. */
export const getLocations = cache(async (type: LocationType): Promise<Location[]> => {
  const { docs } = await (await payload()).find({ collection: "locations", where: { type: { equals: type } }, sort: "_order", limit: 1000, depth: 1 });
  return docs;
});

/** One location, by its type and slug. */
export const getLocation = cache(async (type: LocationType, slug: string): Promise<Location | null> => (await getLocations(type)).find((l) => l.slug === slug) ?? null);

const icon = (name: string) => icons[name as keyof typeof icons];
/** Icon-and-label items, with each icon's name swapped for its component. */
export const iconItems = (items?: { label: string; icon: string }[] | null) => (items ?? []).map((item) => ({ icon: icon(item.icon), label: item.label }));
const lines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * A gallery photo: the same upload serves the thumbnail and the full size, resized by next/image.
 * Its name (shown with it) is its own, or the upload's alt text.
 */
export function galleryImage(media: number | Media, name?: string | null): GalleryImage {
  const image = mediaImage(media);
  return { src: image.src, thumb: image.src, alt: name || image.alt, position: image.position, blur: image.blur };
}

/** A location as its card: on its type's page, linking to its own. */
export function locationCard(location: Location): Room {
  return {
    name: location.name,
    subtitle: `${location.area}, ${location.postcode}`,
    price: location.fromPrice,
    image: mediaImage(location.image),
    features: iconItems(location.features),
    href: `${locationPaths[location.type]}/${location.slug}`,
  };
}

/** A location as its own page's content. */
export function locationDetails(location: Location): LocationDetails {
  return {
    slug: location.slug,
    name: location.name,
    area: location.area,
    postcode: location.postcode,
    fromPrice: location.fromPrice,
    image: mediaImage(location.image),
    features: iconItems(location.features),
    intro: paragraphs(location.intro),
    gallery: (location.gallery ?? []).map((photo) => galleryImage(photo.image, photo.name)),
    prices: (location.prices ?? []).map(({ label, amount, period }) => ({ label, amount, period })),
    address: location.address ?? undefined,
    directionsIntro: location.directionsIntro,
    travelModes: travelModes(location.travelModes),
  };
}

/** A location's "What's included" groups (empty if it has none of its own). */
export const locationIncluded = (location: Location): FeatureGroup[] =>
  (location.included ?? []).map((group) => ({ label: group.label ?? undefined, items: iconItems(group.items) }));

/** Old Oak's rooms, in their admin order. */
export const getRooms = cache(async (): Promise<RoomDoc[]> => {
  const { docs } = await (await payload()).find({ collection: "rooms", sort: "_order", limit: 1000, depth: 1 });
  return docs;
});

/** One room, by its slug. */
export const getRoom = cache(async (slug: string): Promise<RoomDoc | null> => (await getRooms()).find((r) => r.slug === slug) ?? null);

/** Ways to get somewhere, with each one's steps (a line each) as a list. */
export const travelModes = (modes?: { label: string; icon: TravelMode["icon"]; steps: string; mapsUrl: string }[] | null): TravelMode[] =>
  (modes ?? []).map((mode) => ({ label: mode.label, icon: mode.icon, steps: lines(mode.steps), mapsUrl: mode.mapsUrl }));

/** A room as its card on Old Oak's page, linking to its own. */
export function roomCard(room: RoomDoc): Room {
  return { name: room.name, price: `${room.price} per week`, image: mediaImage(room.image), features: iconItems(room.features), href: `${roomsPath}/rooms/${room.slug}` };
}

/** A room as its own page's (and its booking's) content: its photo first in the gallery. */
export function roomDetails(room: RoomDoc): RoomDetails {
  const floorPlan = mediaImage(room.floorPlan);
  return {
    slug: room.slug,
    name: room.name,
    location: room.location,
    price: room.price,
    photos: [galleryImage(room.image), ...(room.photos ?? []).map((photo) => galleryImage(photo.image, photo.name))],
    features: iconItems(room.features),
    about: paragraphs(room.about),
    floorPlan: floorPlan.src ? floorPlan : undefined,
    booking: { moveIn: room.moveIn, floor: room.floor, periods: lines(room.periods) },
  };
}
