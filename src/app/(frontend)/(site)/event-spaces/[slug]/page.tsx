import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderTemplate } from "@/components/payload/RenderBlocks";
import { getLocation, getLocations, getTemplate, locationDetails, locationIncluded } from "@/lib/payload";

// Venues are in the CMS (/admin → Locations), and laid out by their template (/admin → Templates).

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
  const template = await getTemplate("venue");
  // Templates come from the seed: without one, there's no layout to show
  if (!template) notFound();
  const details = locationDetails(venue);
  return (
    <RenderTemplate
      template={template}
      place={{ details, gallery: details.gallery, included: locationIncluded(venue), enquiry: "events", venue: venue.slug }}
    />
  );
}
