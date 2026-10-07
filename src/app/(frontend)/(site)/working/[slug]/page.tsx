import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderTemplate } from "@/components/payload/RenderBlocks";
import { getLocation, getLocations, getTemplate, locationDetails, locationIncluded, locationLowestPrice } from "@/lib/payload";

// Working spaces are in the CMS (/admin → Locations), and laid out by their template (/admin → Templates).

export async function generateStaticParams() {
  return (await getLocations("working")).map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findLocation(slug: string) {
  const location = await getLocation("working", slug);
  if (!location) notFound();
  return location;
}

export async function generateMetadata({ params }: PageProps<"/working/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: (await findLocation(slug)).name };
}

export default async function WorkingLocation({ params }: PageProps<"/working/[slug]">) {
  const { slug } = await params;
  const location = await findLocation(slug);
  const template = await getTemplate("working");
  // Templates come from the seed: without one, there's no layout to show
  if (!template) notFound();
  const details = locationDetails(location);
  return (
    <RenderTemplate
      template={template}
      place={{ details, gallery: details.gallery, included: locationIncluded(location), lowestPrice: locationLowestPrice(location), enquiry: "working" }}
    />
  );
}
