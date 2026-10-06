import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import { venues } from "@/content/events";
import { servicedPromos } from "@/content/serviced-living";

export function generateStaticParams() {
  return venues.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findVenue(slug: string) {
  const venue = venues.find((v) => v.slug === slug);
  if (!venue) notFound();
  return venue;
}

export async function generateMetadata({ params }: PageProps<"/event-spaces/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findVenue(slug).name} · Event Spaces` };
}

export default async function EventVenue({ params }: PageProps<"/event-spaces/[slug]">) {
  const { slug } = await params;
  const venue = findVenue(slug);
  return (
    <LocationDetail
      location={venue}
      enquiry="events"
      included={{
        heading: "Capacity & facilities",
        intro: "Hire it as a blank canvas or styled to suit, with catering and bar service available.",
        groups: venue.venueFacilities,
      }}
      promos={servicedPromos}
    />
  );
}
