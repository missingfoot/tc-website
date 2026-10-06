import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import { RenderTemplate } from "@/components/payload/RenderBlocks";
import { getLocation, getLocationPages, getLocations, getTemplate, locationDetails, locationIncluded } from "@/lib/payload";

// Serviced living houses are in the CMS (/admin → Locations); what every house's page shares is too (/admin → Location pages).

export async function generateStaticParams() {
  return (await getLocations("serviced")).map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findLocation(slug: string) {
  const location = await getLocation("serviced", slug);
  if (!location) notFound();
  return location;
}

export async function generateMetadata({ params }: PageProps<"/serviced-living/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${(await findLocation(slug)).name} · Serviced Living` };
}

export default async function ServicedLivingLocation({ params }: PageProps<"/serviced-living/[slug]">) {
  const { slug } = await params;
  const location = await findLocation(slug);
  const details = locationDetails(location);
  // Laid out by its template (/admin → Templates); the fixed layout below until that's made
  const template = await getTemplate("serviced");
  if (template)
    return <RenderTemplate template={template} place={{ details, gallery: details.gallery, included: locationIncluded(location), enquiry: "serviced" }} />;
  const { serviced: shared } = await getLocationPages();
  return (
    <LocationDetail
      location={details}
      enquiry="serviced"
      included={{ intro: shared.includedIntro, groups: locationIncluded(location) }}
      pricing={shared.pricing}
      promos={shared.promos}
    />
  );
}
