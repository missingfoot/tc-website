import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import * as icons from "@/components/icons";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import { footerNav, mainNav, mobileNav, type MobileNavGroup, type NavLink } from "@/config/navigation";
import { site } from "@/config/site";
import type { SocialLink } from "@/components/sections/SocialLinks";
import { socialLinks } from "@/content/old-oak";
import { locationPagesDefaults, type PricingSettings } from "@/content/location-pages";
import type { Location, Media, Page, Room as RoomDoc, Template } from "@/payload-types";
import type { CircleImage, Cta, GalleryImage, LocationDetails, PromoCard, Room, RoomDetails, TravelMode } from "@/lib/types";
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

type Shown = { show?: boolean | null };
const shown = <T extends Shown>(items?: T[] | null) => (items ?? []).filter((item) => item.show !== false);
const navLinks = (items?: ({ label: string; href: string } & Shown)[] | null) => shown(items).map(({ label, href }) => ({ label, href }));

/**
 * The site's navigation from the CMS (/admin → Navigation): the menu (mobile, and the More
 * dropdown), the desktop bar and the footer, without hidden links. Each falls back to the one in
 * config/navigation.ts while it's empty in the CMS, so the site always has a menu.
 */
export const getNavigation = cache(async (): Promise<{ menu: MobileNavGroup[]; desktop: NavLink[]; footer: MobileNavGroup[] }> => {
  const nav = await (await payload()).findGlobal({ slug: "navigation", depth: 0 });
  const menu: MobileNavGroup[] = (nav.menu ?? []).map((section) => ({
    label: section.heading ?? undefined,
    items: shown(section.items).map((item) => {
      const children = navLinks(item.subLinks);
      return { label: item.label, href: item.href ?? "#", ...(children.length && { children }) };
    }),
  }));
  const desktop: NavLink[] = shown(nav.desktop).map((item) => {
    if (item.opens === "menu") return { label: item.label, href: "#", menu: menu.filter((section) => section.label) };
    if (item.opens === "dropdown") return { label: item.label, href: "#", menu: [{ items: navLinks(item.subLinks) }] };
    return { label: item.label, href: item.href ?? "#" };
  });
  const footer: MobileNavGroup[] = shown(nav.footer).map((column) => ({ label: column.heading, items: navLinks(column.links) }));
  return {
    menu: menu.length ? menu : mobileNav,
    desktop: desktop.length ? desktop : mainNav,
    footer: footer.length ? footer : footerNav,
  };
});

/** A phone number as shown ("+44 (0) 207 183 5478") as a tel: link: international, without the "(0)". */
export const telLink = (phone: string) => `tel:${phone.replace("(0)", "").replace(/[^\d+]/g, "")}`;

/**
 * The company's contact details from the CMS (/admin → Contact details), falling back to
 * config/site.ts while they're not set.
 */
export const getContact = cache(async () => {
  const contact = await (await payload()).findGlobal({ slug: "contactDetails", depth: 0 });
  const phone = contact.phone || site.phone;
  return {
    phone,
    phoneLink: telLink(phone),
    email: contact.email || site.email,
    address: contact.address ? lines(contact.address) : site.address,
  };
});

/**
 * The social accounts and button for "Connect with us" (/admin → Social links), without hidden
 * accounts; email goes to the Contact details address. Falls back to the ones in
 * content/old-oak.ts while it's not set up.
 */
export const getSocialLinks = cache(async (): Promise<{ links: SocialLink[]; button?: Cta }> => {
  const [social, contact] = await Promise.all([(await payload()).findGlobal({ slug: "socialLinks", depth: 0 }), getContact()]);
  const accounts = shown(social.accounts);
  const links: SocialLink[] = accounts.length
    ? accounts.map((a) => ({ platform: a.platform, label: a.label, href: a.platform === "email" ? `mailto:${contact.email}` : (a.href ?? "#") }))
    : socialLinks.map((l) => (l.platform === "email" ? { ...l, href: `mailto:${contact.email}` } : l));
  const button = accounts.length
    ? social.newsletter?.label && social.newsletter.href
      ? { label: social.newsletter.label, href: social.newsletter.href }
      : undefined
    : { label: "Sign up for a newsletter", href: "#" };
  return { links, button };
});

type PromoCardData = { heading: string; image: number | Media; position?: string | null; ctaLabel: string; ctaHref: string; enquiry?: PromoCard["cta"]["enquiry"] | null };

/** Promo cards from the CMS as the section's cards. */
export const promoCards = (cards?: PromoCardData[] | null): PromoCard[] =>
  (cards ?? []).map((card) => ({ heading: card.heading, image: mediaImage(card.image, card.position), cta: { label: card.ctaLabel, href: card.ctaHref, enquiry: card.enquiry ?? undefined } }));

type PricingData = {
  heading: string;
  intro?: string | null;
  note?: string | null;
  button?: { opens?: PricingSettings["button"]["opens"] | null; href?: string | null; label?: string | null };
};

/** A location page's pricing words and button from the CMS. */
const pricingSettings = (pricing: PricingData): PricingSettings => ({
  heading: pricing.heading,
  intro: pricing.intro ?? undefined,
  note: pricing.note ?? undefined,
  button: { opens: pricing.button?.opens ?? "enquiry", href: pricing.button?.href ?? undefined, label: pricing.button?.label ?? undefined },
});

/**
 * What every page of a type shares (/admin → Location pages): working spaces, serviced living,
 * venues and Old Oak rooms. Each tab falls back to content/location-pages.ts while it's not set up.
 */
export const getLocationPages = cache(async () => {
  const shared = await (await payload()).findGlobal({ slug: "locationPages", depth: 1 });
  const d = locationPagesDefaults;
  const { working, serviced, venues, rooms } = shared;
  return {
    working: working?.includedIntro
      ? {
          includedIntro: working.includedIntro,
          // The standard list is one list, shown as a single group
          included: [{ items: iconItems(working.standard) }],
          pricing: pricingSettings(working.pricing),
          tour: working.tour?.label && working.tour.href ? { label: working.tour.label, href: working.tour.href } : undefined,
          promos: promoCards(working.promos),
        }
      : d.working,
    serviced: serviced?.includedIntro ? { includedIntro: serviced.includedIntro, pricing: pricingSettings(serviced.pricing), promos: promoCards(serviced.promos) } : d.serviced,
    venues: venues?.includedIntro ? { includedHeading: venues.includedHeading, includedIntro: venues.includedIntro, pricing: pricingSettings(venues.pricing), promos: promoCards(venues.promos) } : d.venues,
    rooms: rooms?.about?.heading
      ? {
          included: iconItems(rooms.included),
          about: { heading: rooms.about.heading, text: paragraphs(rooms.about.text), poster: mediaImage(rooms.about.poster), video: rooms.about.video },
          coLivingAbout: paragraphs(rooms.coLivingAbout),
          promos: promoCards(rooms.promos),
        }
      : d.rooms,
  };
});

/** The template for a kind of place (/admin → Templates), if it's been made. */
export const getTemplate = cache(async (type: Template["type"]): Promise<Template | null> => {
  const { docs } = await (await payload()).find({ collection: "templates", where: { type: { equals: type } }, limit: 1, depth: 2 });
  return docs[0] ?? null;
});

/** A room template's main-column content (what's included, about the building, about co-living), if it has it. */
export function roomColumn(template: Template | null) {
  const column = template?.roomColumn;
  if (!column?.about?.heading) return null;
  return {
    included: iconItems(column.included),
    about: { heading: column.about.heading, text: paragraphs(column.about.text ?? ""), poster: mediaImage(column.about.poster), video: column.about.video ?? "" },
    coLivingAbout: paragraphs(column.coLivingAbout ?? ""),
  };
}
