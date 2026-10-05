import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import LocationIntro from "@/components/sections/LocationIntro";
import Gallery from "@/components/sections/Gallery";
import FeatureGroups from "@/components/sections/FeatureGroups";
import Pricing from "@/components/sections/Pricing";
import Directions from "@/components/sections/Directions";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import Button from "@/components/ui/Button";
import FloatingButton from "@/components/ui/FloatingButton";
import { Icon360 } from "@/components/icons";
import { mapEmbedUrl } from "@/content/directions";
import { workingLocationIncluded, workingLocationPages } from "@/content/working";
import { oldOakPromos, socialLinks } from "@/content/old-oak";

// Only the locations in the content exist; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return workingLocationPages.map(({ slug }) => ({ slug }));
}

function findLocation(slug: string) {
  const location = workingLocationPages.find((l) => l.slug === slug);
  if (!location) notFound();
  return location;
}

export async function generateMetadata({ params }: PageProps<"/working/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findLocation(slug).name };
}

// TODO: link targets ("Read more", 3D tour, enquiries)
export default async function WorkingLocation({ params }: PageProps<"/working/[slug]">) {
  const { slug } = await params;
  const location = findLocation(slug);

  return (
    <>
      <Hero image={location.image.src} imageAlt={location.image.alt} />

      <LocationIntro
        raised
        name={location.name}
        subtitle={`${location.area}, ${location.postcode}`}
        features={location.features}
        cta={{ label: "Read more", href: "#" }}
      >
        {location.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </LocationIntro>

      <Gallery
        images={location.gallery}
        footer={
          <Button href="#" variant="dark">
            <Icon360 />
            View 3D Tour
          </Button>
        }
      />

      <FeatureGroups
        heading="What’s included"
        intro="All of our locations come with these features as standard, as well as all of their own unique offerings."
        groups={workingLocationIncluded}
      />

      <Pricing
        heading="Pricing"
        intro="Simple monthly memberships, with everything above included."
        prices={location.prices}
        cta={{ label: "Enquire now", href: "#" }}
      />

      <Directions
        heading="Well connected"
        intro={location.directionsIntro}
        modes={location.travelModes}
        mapEmbedUrl={mapEmbedUrl(location.address)}
      />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <PromoCards cards={oldOakPromos} />

      <FloatingButton cta={{ label: "Enquire now", href: "#" }} />
    </>
  );
}
