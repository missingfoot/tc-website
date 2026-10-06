import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import { getLocation, getLocationPages, getLocations, locationDetails, locationIncluded } from "@/lib/payload";

// Working spaces are in the CMS (/admin → Locations); what every working space's page shares is too (/admin → Location pages).

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
  const { working: shared } = await getLocationPages();
  const own = locationIncluded(location);
  return (
    <LocationDetail
      location={locationDetails(location)}
      enquiry="working"
      included={{
        intro: shared.includedIntro,
        // A working space without its own list shows the standard one
        groups: own.length ? own : shared.included,
      }}
      pricing={shared.pricing}
      promos={shared.promos}
      galleryFooter={
        shared.tour && (
          <Button href={shared.tour.href} variant="dark">
            <Icon360 />
            {shared.tour.label}
          </Button>
        )
      }
    />
  );
}
