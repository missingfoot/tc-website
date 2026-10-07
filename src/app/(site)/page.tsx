import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import LinkCards from "@/components/sections/LinkCards";
import Testimonials from "@/components/sections/Testimonials";
import PressQuotes from "@/components/sections/PressQuotes";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import { homeMainLinks, homePress, homeWhatsNew } from "@/content/home";
import { oldOakPromos, oldOakTestimonials, socialLinks } from "@/content/old-oak";
import { coLivingVideo } from "@/content/co-living";

export default function Home() {
  return (
    <>
      <Hero
        image="/images/old-oak/benefits/shared-dinner.jpg"
        imageAlt="Residents sharing dinner around a long table"
        eyebrow="The Collective"
        title="A new way to live work and play"
        video={{ label: "Watch video", url: coLivingVideo }}
      />

      <Intro raised layout="stacked" heading="We're unlocking the world's greatest cities for the creative and ambitious" cta={{ label: "Read more", href: "/mission" }}>
        Our mission is simple: we want to build a world that’s more alive, more together and more collaborative. Our
        buildings are so much more than just bricks and mortar: they redefine the way people choose to live, work and
        play by providing unique shared environments that unlock inspiration and make every single day extraordinary. We
        create places where you can meet new people, try new things, and learn something new every day.
      </Intro>

      <LinkCards cards={homeMainLinks} cardStyle="dark" />

      <Testimonials heading="Residents love our spaces" testimonials={oldOakTestimonials} />

      <PressQuotes heading="The Collective in the Press" quotes={homePress} />

      <LinkCards heading="What’s New" cards={homeWhatsNew} cardStyle="light" />

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
