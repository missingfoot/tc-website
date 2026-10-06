import type { Endpoint } from "payload";
import { jobs } from "@/content/careers";
import { blogCategories } from "@/lib/blog";
import { pagePath } from "../collections/Pages";
import { locationPaths, type LocationType } from "../collections/Locations";
import { roomsPath } from "../collections/Rooms";

type Link = { label: string; value: string };

/** Pages still written in code, for linking to. */
const codePages: Link[] = [
  { label: "Blog", value: "/blog" },
  ...Object.entries(blogCategories).map(([slug, label]) => ({ label: `Blog: ${label}`, value: `/blog/category/${slug}` })),
  { label: "Labs", value: "/labs" },
  { label: "Refer a friend", value: "/refer-a-friend" },
  { label: "Referral terms", value: "/refer-a-friend/terms" },
  ...jobs.map((job) => ({ label: `Job: ${job.title}`, value: `/careers/${job.slug}` })),
  { label: "Apply (co-living)", value: "/apply" },
  { label: "Book a viewing (serviced living)", value: "/book-a-viewing" },
  { label: "Free day trial (working)", value: "/free-trial" },
  { label: "Event enquiry", value: "/event-enquiry" },
  { label: "Waitlist", value: "/waitlist" },
  { label: "Privacy", value: "/privacy" },
  { label: "Terms", value: "/terms" },
  { label: "Cookies", value: "/cookies" },
];

const locationTypes: Record<LocationType, string> = { working: "Working", serviced: "Serviced living", venue: "Venue" };

/**
 * GET /api/site-links: every page on the site, grouped, for the admin's link picker
 * (fields/LinkPicker.tsx). Signed-in editors only.
 */
export const siteLinks: Endpoint = {
  path: "/site-links",
  method: "get",
  handler: async (req) => {
    if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
    const [pages, locations, rooms] = await Promise.all([
      req.payload.find({ collection: "pages", pagination: false, depth: 0, sort: "title", select: { title: true, slug: true } }),
      req.payload.find({ collection: "locations", pagination: false, depth: 0, sort: "_order", select: { name: true, slug: true, type: true } }),
      req.payload.find({ collection: "rooms", pagination: false, depth: 0, sort: "_order", select: { name: true, slug: true } }),
    ]);
    return Response.json([
      { label: "Page", options: pages.docs.map((page) => ({ label: page.title, value: pagePath(page.slug) })) },
      {
        label: "Location",
        options: locations.docs.map((l) => ({ label: `${locationTypes[l.type]}: ${l.name}`, value: `${locationPaths[l.type]}/${l.slug}` })),
      },
      { label: "Room", options: rooms.docs.map((room) => ({ label: room.name, value: `${roomsPath}/rooms/${room.slug}` })) },
      { label: "Other page", options: codePages },
    ]);
  },
};
