import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Gallery from "@/components/sections/Gallery";
import RoomCards from "@/components/sections/RoomCards";
import DownloadCard from "@/components/sections/DownloadCard";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import FloatingButton from "@/components/ui/FloatingButton";
import { bedfordVenues, eventsGallery, oldOakVenues } from "@/content/events";
import { servicedPromos } from "@/content/serviced-living";
import { socialLinks } from "@/content/old-oak";

export const metadata = { title: "Event Spaces" };

export default function EventSpaces() {
  return (
    <>
      <Hero
        image="/images/event-spaces/the-exchange/01-lounge.jpg"
        imageAlt="The Exchange at Old Oak, set up for an event"
        title="Bring people together"
        subtitle="Inspiring venues in central and west London, for events your guests won’t forget."
        action={<EnquiryButton kind="events" variant="light" />}
      />

      <Intro raised heading="Discover our event spaces" action={<EnquiryButton kind="events" variant="light" />}>
        <p>
          Nothing brings people together like an event, and you can’t hold an event without the perfect space. That’s why
          we’ve created inspiring venues designed for sharing ideas and experiences.
        </p>
        <p>
          Each is unique: from photo shoots, panel discussions and networking to birthdays, supper clubs, conferences and
          film screenings. With sound systems, lighting and projection, plus bar and catering, your event will leave a
          lasting impression.
        </p>
      </Intro>

      <RoomCards
        heading="Bedford Square"
        intro="Four spaces in a Georgian townhouse in Bloomsbury, a short walk from Tottenham Court Road."
        rooms={bedfordVenues}
        ctaLabel="See the space"
      />

      <Gallery heading="Look inside" images={eventsGallery} tone="white" />

      <RoomCards
        heading="Old Oak"
        intro="Three spaces in our co-living building on the canal at Willesden Junction, from a 200-guest venue to a private dining room."
        rooms={oldOakVenues}
        ctaLabel="See the space"
      />

      <DownloadCard
        heading="Download our brochure"
        intro="Every venue in one place: floor plans, capacities for each layout, facilities and how to get there. Handy to share with your team."
        file={{ href: "/downloads/the-collective-event-spaces.pdf", label: "Download brochure" }}
        image={{ src: "/images/event-spaces/the-gallery/01-dinner.jpg", alt: "The Gallery laid for dinner" }}
      />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <PromoCards cards={servicedPromos} />

      <FloatingButton>
        <EnquiryButton kind="events" />
      </FloatingButton>
    </>
  );
}
