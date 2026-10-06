import { jobs } from "@/content/careers";
import { blogCategories, postSlugs } from "@/lib/blog";
import { cache } from "react";
import { oldOakRoomDetails } from "@/content/old-oak";
import { getLocations } from "@/lib/payload";

/**
 * Short page titles shown in the middle of the mobile top bar, by path. Detail pages take
 * theirs from the same data that builds them (the CMS's Locations for working spaces, serviced
 * living and venues), so new rooms, venues, locations and jobs get one automatically. Server only
 * (it reads the content): Nav passes it down to PageTitle.
 */
export const getPageTitles = cache(async (): Promise<Record<string, string>> => {
  const [working, serviced, venues] = await Promise.all([getLocations("working"), getLocations("serviced"), getLocations("venue")]);
  return {
    "/": "The Collective",
    "/locations/old-oak": "Old Oak",
    ...Object.fromEntries(oldOakRoomDetails.map((room) => [`/locations/old-oak/rooms/${room.slug}`, room.name])),
    "/co-living": "Co-Living",
    "/working": "Working",
    ...Object.fromEntries(working.map((place) => [`/working/${place.slug}`, place.name])),
    "/serviced-living": "Serviced Living",
    ...Object.fromEntries(serviced.map((place) => [`/serviced-living/${place.slug}`, place.name])),
    "/event-spaces": "Event Spaces",
    ...Object.fromEntries(venues.map((venue) => [`/event-spaces/${venue.slug}`, venue.name])),
    // Shorter than the venue's name, which doesn't fit the bar
    "/event-spaces/the-private-dining-room": "Private Dining Room",
    "/mission": "Mission",
    "/faq": "FAQ",
    "/careers": "Careers",
    ...Object.fromEntries(jobs.map((job) => [`/careers/${job.slug}`, job.title])),
    "/press": "Press",
    "/refer-a-friend": "Refer a friend",
    "/refer-a-friend/terms": "Referral terms",
    "/foundation": "Foundation",
    "/labs": "Labs",
    "/blog": "Blog",
    ...Object.fromEntries(Object.entries(blogCategories).map(([slug, label]) => [`/blog/category/${slug}`, label])),
    // Post titles are too long for the bar
    ...Object.fromEntries(postSlugs().map((slug) => [`/blog/${slug}`, "Blog"])),
    "/privacy": "Privacy",
    "/terms": "Terms",
    "/cookies": "Cookies",
  };
});
