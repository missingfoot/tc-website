import type { Endpoint } from "payload";
import { jobs } from "@/content/careers";
import { blogCategories } from "@/lib/blog";
import { pagePath } from "../collections/Pages";
import { placePaths, type PlaceKind } from "../fields/place";
import { findPlaces } from "../places";
import { roomPath } from "../collections/Rooms";

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

const kindLabels: Record<PlaceKind, string> = { coliving: "Co-living", working: "Working", serviced: "Serviced living", venue: "Venue" };

/**
 * GET /api/site-links: every page on the site, grouped, for the admin's link picker
 * (fields/LinkPicker.tsx). Signed-in editors only.
 */
export const siteLinks: Endpoint = {
  path: "/site-links",
  method: "get",
  handler: async (req) => {
    if (!req.user) return Response.json({ error: "Sign in first" }, { status: 401 });
    const [pages, rooms, ...places] = await Promise.all([
      req.payload.find({ collection: "pages", pagination: false, depth: 0, sort: "title", select: { title: true, slug: true } }),
      req.payload.find({ collection: "rooms", pagination: false, depth: 0, sort: "_order", select: { name: true, slug: true, building: true } }),
      ...(Object.keys(placePaths) as PlaceKind[]).map((kind) => findPlaces(req.payload, kind, 0, req)),
    ]);
    const all = places.flat();
    const colivings = all.filter((p) => p.kind === "coliving");
    return Response.json([
      { label: "Page", options: pages.docs.map((page) => ({ label: page.title, value: pagePath(page.slug) })) },
      {
        label: "Place",
        // Co-living that's coming soon has no page yet
        options: all.filter((p) => !p.comingSoon).map((p) => ({ label: `${kindLabels[p.kind]}: ${p.name}`, value: `${placePaths[p.kind]}/${p.slug}` })),
      },
      {
        label: "Room",
        // Under its building's co-living page
        options: rooms.docs.flatMap((room) => {
          const home = colivings.find((c) => c.id === room.building);
          return home ? [{ label: `${home.name}: ${room.name}`, value: roomPath(home.slug, room.slug) }] : [];
        }),
      },
      { label: "Other page", options: codePages },
    ]);
  },
};
