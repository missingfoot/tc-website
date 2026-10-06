import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import { servicedPromos } from "@/content/serviced-living";
import { getLocation, getLocations, locationDetails, locationIncluded } from "@/lib/payload";

// Venues are in the CMS (/admin → Locations); what every venue's page shares is here.

export async function generateStaticParams() {
  return (await getLocations("venue")).map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findVenue(slug: string) {
  const venue = await getLocation("venue", slug);
  if (!venue) notFound();
  return venue;
}

export async function generateMetadata({ params }: PageProps<"/event-spaces/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${(await findVenue(slug)).name} · Event Spaces` };
}

export default async function EventVenue({ params }: PageProps<"/event-spaces/[slug]">) {
  const { slug } = await params;
  const venue = await findVenue(slug);
  return (
    <LocationDetail
      location={locationDetails(venue)}
      enquiry="events"
      included={{
        heading: "Capacity & facilities",
        intro: "Hire it as a blank canvas or styled to suit, with catering and bar service available.",
        groups: locationIncluded(venue),
      }}
      promos={servicedPromos}
    />
  );
}
