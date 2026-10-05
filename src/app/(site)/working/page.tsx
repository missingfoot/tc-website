import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Gallery from "@/components/sections/Gallery";
import Checklist from "@/components/sections/Checklist";
import RoomCards from "@/components/sections/RoomCards";
import FeatureGroups from "@/components/sections/FeatureGroups";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import { workingHowItWorks, workingIncluded, workingLocations, workingSpaces } from "@/content/working";
import { oldOakPromos, socialLinks } from "@/content/old-oak";

export const metadata = { title: "Working" };

export default function Working() {
  return (
    <>
      <Hero
        image="/images/working/hero.jpg"
        imageAlt="Members working at long tables in The Den"
        title="The future of work."
        subtitle="Changing the way we view work. Get collaborative and communal with our beautiful and productive working spaces."
        action={<EnquiryButton kind="working" variant="light" />}
      />

      <Intro raised heading="Work. Connect. Create." action={<EnquiryButton kind="working" variant="light" />}>
        <p>
          When we built The Den we wanted to make the perfect environment for the next generation of creators to turn
          their ideas into reality.
        </p>
        <p>
          Our aim is to help every person that enters our space succeed, by providing the space, services, community and
          support needed to let them focus on the work they love.
        </p>
        <p>We are building London’s leading creative community, so make yourself at home.</p>
      </Intro>

      <Gallery
        heading="Explore the spaces"
        intro="By combining shared spaces with events and opportunities to connect, our workspaces give you a platform to do your best work and maximise your potential."
        images={workingSpaces}
      />

      <Checklist heading="How it works" items={workingHowItWorks} />

      <RoomCards
        heading="Our Locations"
        intro="Each location has its own unique feel, designed to help you do your best work while encouraging you to explore and make connections with other members."
        rooms={workingLocations}
        ctaLabel="More info"
      />

      <FeatureGroups
        heading="What’s included"
        intro="All of our locations come with these features as standard, as well as all of their own unique offerings."
        groups={workingIncluded}
      />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <PromoCards cards={oldOakPromos} />
    </>
  );
}
