import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Gallery from "@/components/sections/Gallery";
import CollageSplit from "@/components/sections/CollageSplit";
import RoomCards from "@/components/sections/RoomCards";
import FeatureGroups from "@/components/sections/FeatureGroups";
import Faq from "@/components/sections/Faq";
import Directions from "@/components/sections/Directions";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import FloatingButton from "@/components/ui/FloatingButton";
import {
  canaryWharfEventsImages, canaryWharfFaq, canaryWharfGallery, canaryWharfIncluded, canaryWharfMapEmbed, canaryWharfOffers, canaryWharfPromos,
  canaryWharfRooms, canaryWharfTower, canaryWharfTravelModes, canaryWharfWaitlist,
} from "@/content/canary-wharf";
import { socialLinks } from "@/content/old-oak";

export const metadata = { title: "Canary Wharf" };

// Opening soon: every button joins the waitlist with Canary Wharf chosen.
const waitlist = (variant: "light" | "dark") => (
  <Button href={canaryWharfWaitlist} variant={variant} arrow>
    Join the waitlist
  </Button>
);

export default function CanaryWharf() {
  return (
    <>
      <Hero
        image={canaryWharfTower.src}
        imageAlt={canaryWharfTower.alt}
        imagePosition="center 30%"
        eyebrow="East London"
        title="Canary Wharf"
        subtitle="Flexible length co-living. Stay for a night or longer."
        action={waitlist("light")}
      />

      <Intro raised heading="Flexible length co-living" action={waitlist("light")}>
        The new Collective on the block. Our Canary Wharf co-living space is a haven of creativity and
        community in the heart of the City. The same inspiring shared spaces, events programme and
        beautifully designed private rooms, but with the added benefit of flexibility. You can stay for a
        night or longer.
      </Intro>

      <Gallery
        heading="Explore the spaces"
        intro="Your home, your office, your playground. A rooftop pool and spa, a cinema and games room, a library and co-working space, all under one roof and all yours to use."
        images={canaryWharfGallery}
        footer={
          // TODO: the real 3D tour. Until there is one, this address doesn't exist, so it shows the 404 page
          <Button href="/locations/canary-wharf/3d-tour" variant="dark">
            <Icon360 />
            View 3D Tour
          </Button>
        }
      />

      <CollageSplit heading="A cultural programme" images={canaryWharfEventsImages}>
        <p>
          From supper clubs and cocktail making to live music, coding classes and workshops, our cultural
          events programme is ever-changing and made for each building. Tuck in family style, sip on
          cocktails you&apos;ve made yourself, or dance to your favourite tunes.
        </p>
        <p>
          Got your own idea? We&apos;re here to help you make it happen. Whether you&apos;re staying for a
          weekend or settling in for the year, there&apos;s always something on and someone new to meet.
        </p>
      </CollageSplit>

      <PromoCards cards={canaryWharfOffers} />

      <RoomCards
        heading="Explore the rooms"
        intro="Every studio has an ensuite rain shower, a kitchenette, a comfy mattress and a smart TV. Stay from £80 a night, or live with us on a 4 to 12 month membership with one all-inclusive bill."
        rooms={canaryWharfRooms}
      />

      <FeatureGroups
        heading="What’s included"
        intro="One of a kind spaces, events and the little things like wifi and cleaning, all included in one bill, no matter how long you’re with us."
        groups={canaryWharfIncluded}
      />

      <Faq tone="cream" heading="Good to know" intro="Answers to frequently asked questions at The Collective Canary Wharf." items={canaryWharfFaq} />

      <Directions
        heading="How to find us"
        intro="We’re in Crossharbour Plaza, a few steps from Crossharbour and South Quay DLR stations and a 10 minute walk from Canary Wharf, for quick and easy access to central London by tube or light rail."
        modes={canaryWharfTravelModes}
        mapEmbedUrl={canaryWharfMapEmbed}
        place="Canary Wharf"
      />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and be the first to hear when Canary Wharf opens."
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <PromoCards cards={canaryWharfPromos} />

      <FloatingButton>{waitlist("dark")}</FloatingButton>
    </>
  );
}
