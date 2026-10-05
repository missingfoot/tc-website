import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import { servicedLocationIncluded, servicedLocationPages, servicedPromos } from "@/content/serviced-living";

export function generateStaticParams() {
  return servicedLocationPages.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findLocation(slug: string) {
  const location = servicedLocationPages.find((l) => l.slug === slug);
  if (!location) notFound();
  return location;
}

export async function generateMetadata({ params }: PageProps<"/serviced-living/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findLocation(slug).name} · Serviced Living` };
}

export default async function ServicedLivingLocation({ params }: PageProps<"/serviced-living/[slug]">) {
  const { slug } = await params;
  const location = findLocation(slug);
  return (
    <LocationDetail
      location={location}
      enquiry="serviced"
      included={{ intro: "Everything you need, all included in one weekly price.", groups: servicedLocationIncluded[location.slug] }}
      pricingIntro="Weekly prices with all bills, cleaning and linen changes included."
      promos={servicedPromos}
    />
  );
}
