import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationDetail from "@/components/sections/LocationDetail";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import { workingLocationIncluded, workingLocationPages } from "@/content/working";
import { oldOakPromos } from "@/content/old-oak";

export function generateStaticParams() {
  return workingLocationPages.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findLocation(slug: string) {
  const location = workingLocationPages.find((l) => l.slug === slug);
  if (!location) notFound();
  return location;
}

export async function generateMetadata({ params }: PageProps<"/working/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findLocation(slug).name };
}

// TODO: link target for the 3D tour
export default async function WorkingLocation({ params }: PageProps<"/working/[slug]">) {
  const { slug } = await params;
  return (
    <LocationDetail
      location={findLocation(slug)}
      enquiry="working"
      included={{
        intro: "All of our locations come with these features as standard, as well as all of their own unique offerings.",
        groups: workingLocationIncluded,
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
