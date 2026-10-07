import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderTemplate } from "@/components/payload/RenderBlocks";
import { getBuildingRooms, getLocation, getLocations, getTemplate, locationDetails, locationIncluded, locationLowestPrice, roomCard } from "@/lib/payload";

// Co-living is in the CMS (/admin → Locations, type "Co-living", one per building), laid out by
// their template (/admin → Templates). One that's coming soon has no page yet: its card offers the waitlist.

export async function generateStaticParams() {
  return (await getLocations("coliving")).filter((b) => !b.comingSoon).map(({ slug }) => ({ building: slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findBuilding(slug: string) {
  const building = await getLocation("coliving", slug);
  if (!building || building.comingSoon) notFound();
  return building;
}

export async function generateMetadata({ params }: PageProps<"/locations/[building]">): Promise<Metadata> {
  const { building } = await params;
  return { title: (await findBuilding(building)).name };
}

export default async function Building({ params }: PageProps<"/locations/[building]">) {
  const { building: slug } = await params;
  const building = await findBuilding(slug);
  const template = await getTemplate("coliving");
  // Templates come from the seed: without one, there's no layout to show
  if (!template) notFound();
  const details = locationDetails(building);
  return (
    <RenderTemplate
      template={template}
      place={{
        details,
        gallery: details.gallery,
        included: locationIncluded(building),
        lowestPrice: locationLowestPrice(building),
        enquiry: "living",
        rooms: (await getBuildingRooms(slug)).map(roomCard),
      }}
    />
  );
}
