import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import { getLocation, getLocationPages, getLocations, locationDetails, locationIncluded } from "@/lib/payload";

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
  const { serviced: shared } = await getLocationPages();
  return (
    <LocationDetail
      location={locationDetails(location)}
      enquiry="serviced"
      included={{ intro: shared.includedIntro, groups: locationIncluded(location) }}
      pricingIntro={shared.pricingIntro}
      promos={shared.promos}
    />
  );
}
