import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import LinkCards from "@/components/sections/LinkCards";
import Testimonials from "@/components/sections/Testimonials";
import PressQuotes from "@/components/sections/PressQuotes";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import { homeMainLinks, homePress, homeWhatsNew } from "@/content/home";
import { oldOakPromos, oldOakTestimonials, socialLinks } from "@/content/old-oak";

export default function Home() {
  return (
    <>
      <Hero
        image="/images/old-oak/benefits/shared-dinner.jpg"
        imageAlt="Residents sharing dinner around a long table"
        eyebrow="The Collective"
        title="A new way to live work and play"
        video={{ label: "Watch our video", url: "https://youtu.be/XkZbmXgOWOA" }}
      />

      <Intro raised layout="stacked" heading="We're unlocking the world's greatest cities for the creative and ambitious" cta={{ label: "Read more", href: "/our-story" }}>
        Starting with London, our focus is on creating ground-breaking spaces and the greatest possible experiences
        within them. By doing this, we’re redefining the way people can choose to live, work and play.
      </Intro>

      <LinkCards cards={homeMainLinks} tone="dark" />

      <Testimonials heading="Residents love our spaces" testimonials={oldOakTestimonials} />

      <PressQuotes heading="The Collective in the Press" quotes={homePress} />

      <LinkCards heading="What’s New" cards={homeWhatsNew} tone="light" />

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
