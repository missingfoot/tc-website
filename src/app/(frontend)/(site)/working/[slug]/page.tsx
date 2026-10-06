import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import { workingLocationIncluded } from "@/content/working";
import { oldOakPromos } from "@/content/old-oak";
import { getLocation, getLocations, locationDetails, locationIncluded } from "@/lib/payload";

// Working spaces are in the CMS (/admin → Locations); what every working space's page shares is here.

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

// TODO: link target for the 3D tour
export default async function WorkingLocation({ params }: PageProps<"/working/[slug]">) {
  const { slug } = await params;
  const location = await findLocation(slug);
  const own = locationIncluded(location);
  return (
    <LocationDetail
      location={locationDetails(location)}
      enquiry="working"
      included={{
        intro: "All of our locations come with these features as standard, as well as all of their own unique offerings.",
        // A working space without its own list shows the standard one
        groups: own.length ? own : workingLocationIncluded,
      }}
      pricingIntro="Simple monthly memberships, with everything above included."
      promos={oldOakPromos}
      galleryFooter={
        <Button href="#" variant="dark">
          <Icon360 />
          View 3D Tour
        </Button>
      }
    />
  );
}
