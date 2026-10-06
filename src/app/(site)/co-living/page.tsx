import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import FeatureGroups from "@/components/sections/FeatureGroups";
import LinkCards from "@/components/sections/LinkCards";
import Testimonials from "@/components/sections/Testimonials";
import CollageSplit from "@/components/sections/CollageSplit";
import Gallery from "@/components/sections/Gallery";
import Faq from "@/components/sections/Faq";
import PressQuotes from "@/components/sections/PressQuotes";
import PerkCards from "@/components/sections/PerkCards";
import ImageCarousel from "@/components/sections/ImageCarousel";
import PromoCards from "@/components/sections/PromoCards";
import SocialLinks from "@/components/sections/SocialLinks";
import {
  coLivingCommunity, coLivingFaq, coLivingGrowImages, coLivingIncluded, coLivingInstagram, coLivingLocations, coLivingPerks, coLivingPress,
  coLivingPromos, coLivingVideo,
} from "@/content/co-living";
import { oldOakGallery, oldOakTestimonials, socialLinks } from "@/content/old-oak";

export const metadata = { title: "Co-Living" };

export default function CoLiving() {
  return (
    <>
      <Hero
        image="/images/old-oak/promos/friends-chatting.jpg"
        imageAlt="Two residents laughing together in the lounge"
        title="A new way to rent"
        subtitle="Combining private ensuites with beautiful shared spaces and a host of inspiring events, all included in one monthly bill."
        video={{ label: "Watch video", url: coLivingVideo }}
      />

      <Intro raised layout="stacked" heading="What is co-living?" cta={{ label: "Read more", href: "#faq" }}>
        Co-living is a way of living in cities that is focused on community and convenience. Live as part of a
        community, sharing wonderfully designed spaces and inspiring events, with the comfort of being able to retreat
        to your own fully furnished private apartment at the end of the day. Everything you need to make the most of
        city life is included in one bill, so you can do the living, and leave the rest to us.
      </Intro>

      <FeatureGroups heading="What’s included" groups={coLivingIncluded} />

      <LinkCards heading="Locations" cards={coLivingLocations} cardStyle="dark" imageShape="tall" />

      <Testimonials heading="See what our members say" testimonials={oldOakTestimonials} />

      <Gallery
        tone="white"
        heading="Community"
        intro="Our spaces are nothing without people, and it’s our members that make it a home. You will have endless opportunities to start new and interesting conversations, share ideas and experiences with like-minded individuals, leave your mark and help to build this amazing community."
        images={coLivingCommunity}
      />

      <Gallery
        heading="Shared spaces"
        intro="We create beautifully designed spaces that bring people together. Co-living provides the opportunity to do something different every day – whether it’s an exercise class, live music night or life drawing, there’s always a way to have fun and connect with other members."
        images={oldOakGallery}
      />

      <CollageSplit heading="Learn. Develop. Grow." images={coLivingGrowImages}>
        <p>
          Be a part of something bigger. From workshops and courses to gigs and guest speakers, there’s a way to engage
          with the community every day of the week.
        </p>
        <p>Create a new club, host a dinner party or plan an event. Share your skills and create an unforgettable experience for the community.</p>
      </CollageSplit>

      <ImageCarousel
        heading="A look inside"
        images={coLivingInstagram}
        footer={
          <>
            See the latest from our community by following us on Instagram{" "}
            <a href="https://www.instagram.com/thecollective_living/" target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
              @thecollective_living
            </a>
          </>
        }
      />

      <PerkCards
        heading="The little extras"
        intro="We’ve partnered with a few great brands to help make life that little bit easier. Our members have access to a range of exclusive discounts and offers, from the likes of:"
        perks={coLivingPerks}
      />

      <div id="faq" className="scroll-mt-24">
        <Faq
          heading="Want to know more?"
          items={coLivingFaq}
          outro="Co-living is designed to be the perfect platform for life in the city, focusing on creating beautiful spaces and the greatest possible experiences within them."
          cta={{ label: "Apply now", href: "#" }}
        />
      </div>

      <PressQuotes heading="In the press" quotes={coLivingPress} />

      <PromoCards cards={coLivingPromos} mobileShape="tall" />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />
    </>
  );
}
