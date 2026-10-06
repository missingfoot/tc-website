import type { ReactNode } from "react";
import type { EnquiryKind, LocationDetails, PromoCard } from "@/lib/types";
import Hero from "@/components/sections/Hero";
import LocationIntro from "@/components/sections/LocationIntro";
import Gallery from "@/components/sections/Gallery";
import FeatureGroups, { type FeatureGroup } from "@/components/sections/FeatureGroups";
import Pricing from "@/components/sections/Pricing";
import Directions from "@/components/sections/Directions";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import FloatingButton from "@/components/ui/FloatingButton";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import Button from "@/components/ui/Button";
import type { PricingSettings } from "@/content/location-pages";
import { mapEmbedUrl } from "@/content/directions";

type LocationDetailProps = {
  location: LocationDetails;
  /** Which enquiry form every call to action opens. */
  enquiry: EnquiryKind;
  included: { heading?: string; intro: string; groups: FeatureGroup[] };
  /** The pricing section's words and button (the section is left out when the location has no prices). */
  pricing: PricingSettings;
  promos: PromoCard[];
  /** Under the gallery, e.g. a 3D tour button. */
  galleryFooter?: ReactNode;
};

/**
 * A location's own page (a working space, a serviced living house or an event venue): photo hero, name and
 * features with the intro, gallery, what's included, pricing, directions, social links and promos,
 * with the enquiry button in the intro, under the prices and floating.
 */
export default function LocationDetail({ location, enquiry, included, pricing, promos, galleryFooter }: LocationDetailProps) {
  // Event enquiries pre-select the venue being viewed
  const venue = enquiry === "events" ? location.slug : undefined;
  return (
    <>
      <Hero image={location.image.src} imageAlt={location.image.alt} />

      <LocationIntro
        raised
        name={location.name}
        subtitle={`${location.area}, ${location.postcode}`}
        features={location.features}
        action={<EnquiryButton kind={enquiry} venue={venue} variant="light" />}
      >
        {location.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </LocationIntro>

      <Gallery images={location.gallery} footer={galleryFooter} />

      <FeatureGroups heading={included.heading ?? "What’s included"} intro={included.intro} groups={included.groups} />

      {location.prices.length > 0 && (
        <Pricing
          heading={pricing.heading}
          intro={pricing.intro}
          note={pricing.note}
          prices={location.prices}
          action={
            pricing.button.opens === "enquiry" ? (
              <EnquiryButton kind={enquiry} venue={venue} label={pricing.button.label} />
            ) : pricing.button.opens === "link" && pricing.button.href ? (
              <Button href={pricing.button.href} variant="dark" arrow>
                {pricing.button.label || "Find out more"}
              </Button>
            ) : undefined
          }
        />
      )}

      {location.address && (
        <Directions
          heading="Well connected"
          intro={location.directionsIntro}
          modes={location.travelModes}
          mapEmbedUrl={mapEmbedUrl(location.address)}
          place={location.name}
        />
      )}

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
      />

      <PromoCards cards={promos} />

      <FloatingButton>
        <EnquiryButton kind={enquiry} venue={venue} />
      </FloatingButton>
    </>
  );
}
