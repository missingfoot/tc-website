import type { Payload, PayloadRequest } from "payload";
import type { Building, Media } from "@/payload-types";
import type { PlaceKind } from "./fields/place";

/**
 * A place with a card and a page of its own, whichever kind: a building's co-living, working space
 * or serviced living (a tab of the building, going by its name), or a venue room. Its `id` is its
 * building's, or the venue room's.
 */
export type Place = {
  id: number;
  kind: PlaceKind;
  name: string;
  slug: string;
  /** Its building: with its address and ways to get there, when read at depth 1 or more. */
  building: number | Building;
  comingSoon?: boolean | null;
  area: string;
  postcode: string;
  pill?: string | null;
  image: number | Media;
  features?: { label: string; icon: string }[] | null;
  intro: string;
  gallery?: { image: number | Media; name?: string | null }[] | null;
  prices?: { plan: string; amount?: number | null }[] | null;
  included?: { label?: string | null; items?: { label: string; icon: string }[] | null }[] | null;
  directionsIntro?: string | null;
  roomsIncluded?: { label: string; icon: string }[] | null;
  about?: { heading?: string | null; text?: string | null; poster?: number | Media | null; video?: string | null } | null;
  roomLengths?: { months: number }[] | null;
};

/** A building's offering as a place, if it has it. */
export function offeringOf(building: Building, kind: Exclude<PlaceKind, "venue">): Place | undefined {
  const offering = building[kind];
  if (!offering?.enabled) return undefined;
  return { ...(offering as Omit<Place, "id" | "kind" | "name" | "building">), id: building.id, kind, name: building.name, building };
}

/** Every place of a kind: buildings with that offering (by name), or venue rooms (in their admin order). */
export async function findPlaces(payload: Payload, kind: PlaceKind, depth = 1, req?: PayloadRequest): Promise<Place[]> {
  if (kind === "venue") {
    const { docs } = await payload.find({ collection: "venues", sort: "_order", pagination: false, depth, req });
    return docs.map((venue) => ({ ...venue, kind: "venue" }) as Place);
  }
  const { docs } = await payload.find({ collection: "buildings", where: { [`${kind}.enabled`]: { equals: true } }, sort: "name", pagination: false, depth, req });
  return docs.flatMap((building) => offeringOf(building, kind) ?? []);
}
