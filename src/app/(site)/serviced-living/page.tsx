import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Gallery from "@/components/sections/Gallery";
import RoomCards from "@/components/sections/RoomCards";
import FeatureGroups from "@/components/sections/FeatureGroups";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import FloatingButton from "@/components/ui/FloatingButton";
import { servicedGallery, servicedIncluded, servicedLocations, servicedPromos } from "@/content/serviced-living";
import { socialLinks } from "@/content/old-oak";

export const metadata = { title: "Serviced Living" };

export default function ServicedLiving() {
  return (
    <>
      <Hero
        image="/images/serviced-living/notting-hill/01-studio.jpg"
        imageAlt="A bright Notting Hill studio with a dining table by the window"
        title="Live life without the hassle"
        subtitle="Beautiful serviced apartments, right in the heart of London’s most iconic locations."
        action={<EnquiryButton kind="serviced" variant="light" />}
      />

      <Intro raised heading="Serviced living at The Collective" action={<EnquiryButton kind="serviced" variant="light" />}>
        <p>
          Serviced living isn’t new, but the way we do it is. Living in your own space shouldn’t mean settling for less
          than a unique living experience.
        </p>
        <p>
          Our serviced living houses offer all-inclusive private rooms and apartments in some of London’s most iconic
          locations, each with shared spaces like a kitchen or garden, so you get the sense of community at the heart of
          everything we do.
        </p>
        <p>Every room includes one all-inclusive bill, weekly cleaning, linen changes and a concierge service, to make life as easy as possible.</p>
      </Intro>

      <Gallery
        heading="Look inside"
        intro="Serviced living to the highest standards: beautifully furnished, modern private rooms right in the heart of London, with equally beautiful shared spaces."
        images={servicedGallery}
      />

      <FeatureGroups
        heading="What’s included"
        intro="Every room comes with these as standard, so you can get on with living."
        groups={servicedIncluded}
      />

      <RoomCards
        heading="Locations"
        intro="Each house has its own character and neighbourhood, with everything you need included in one weekly price."
        rooms={servicedLocations}
        ctaLabel="More info"
      />

      <PromoCards cards={servicedPromos} />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <FloatingButton>
        <EnquiryButton kind="serviced" />
      </FloatingButton>
    </>
  );
}
