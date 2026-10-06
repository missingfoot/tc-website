import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Checklist from "@/components/sections/Checklist";
import LinkCards from "@/components/sections/LinkCards";
import CollageSplit from "@/components/sections/CollageSplit";
import TeamGrid from "@/components/sections/TeamGrid";
import PressQuotes from "@/components/sections/PressQuotes";
import PromoCards from "@/components/sections/PromoCards";
import SocialLinks from "@/components/sections/SocialLinks";
import { coLivingPress } from "@/content/co-living";
import { missionLeaders, missionProducts, missionPromos, missionTeamImages, missionValues } from "@/content/mission";
import { socialLinks } from "@/content/old-oak";

export const metadata = { title: "Mission" };

export default function Mission() {
  return (
    <>
      <Hero
        image="/images/mission/hero-reception.jpg"
        imageAlt="A member and one of our team chatting at the front desk"
        title="Meet The Collective"
        subtitle="Our mission is simple: to build a world that’s more alive, more together and more collaborative."
      />

      <Intro raised layout="stacked" heading="We believe people are most alive when they are together">
        We create better places for people to live, work and play. Our homes and workspaces are designed to inspire and
        bring people together, unlocking a new lifestyle for the curious and ambitious. We’re fiercely passionate about
        creating happy, inspired communities who think and live big. Our members live in beautifully designed private
        spaces and share awesome amenities: think cinemas, gyms, spas, co-working spaces, bars and restaurants.
      </Intro>

      <Checklist tone="cream" heading="Our values" items={missionValues} />

      <LinkCards
        heading="What we do"
        intro="We create places for people to live, work and play, designed to help people live happier, fuller lives, learning and growing as part of an engaged community."
        cards={missionProducts}
        cardStyle="dark"
      />

      <CollageSplit tone="cream" heading="Together, we’ve got this" images={missionTeamImages}>
        <p>
          We’re a young team who want to change the world for our generation and beyond. Our culture is rooted in helping
          one another grow, because getting where we want to be tomorrow comes down to what we do today.
        </p>
        <p>We are fearless, collaborative and caring, building each other up so we can build great things.</p>
      </CollageSplit>

      <PressQuotes heading="The Collective in the press" quotes={coLivingPress} />

      <TeamGrid tone="cream" heading="Team leaders" people={missionLeaders} />

      <PromoCards cards={missionPromos} />

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />
    </>
  );
}
