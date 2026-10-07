import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import CollageSplit from "@/components/sections/CollageSplit";
import SocialLinks from "@/components/sections/SocialLinks";
import PromoCards from "@/components/sections/PromoCards";
import { site } from "@/config/site";
import { acceleratorBubbles, moonshotsBubbles } from "@/content/foundation";
import { socialLinks } from "@/content/old-oak";
import { liveWorkPromos } from "@/content/promos";

export const metadata = { title: "Foundation" };

export default function Foundation() {
  return (
    <>
      <Hero
        image="/images/foundation/accelerator-workshop.jpg"
        imageAlt="Accelerator teams mapping out ideas around a table"
        title="The Collective Foundation"
        subtitle="Solving urban problems with a new generation of citizens"
      />

      <Intro raised heading="Overview">
        <p>
          Cities are evolving faster than ever before, putting stress on persistent problems such as lack of affordable
          housing and migration in urban areas. Governments and philanthropic ventures are still using old ways to tackle
          new challenges.
        </p>
        <p>
          At The Collective Foundation, we envision a world where people come together to confront the most pressing
          urban issues of our time. We believe that ordinary citizens can do extraordinary things collectively. Imagine
          if we took risks together, side-by-side and living in one hub. What could our cities look like?
        </p>
      </Intro>

      <CollageSplit tone="cream" heading="The Collective Global Accelerator" images={acceleratorBubbles}>
        <p>
          We want to tackle the toughest challenges that people in cities face worldwide. Launching this year, The
          Collective Global Accelerator (CGA) is designed to support entrepreneurs and innovators from around the world.
        </p>
        <p>
          Our 4-week immersive programme invites aspiring changemakers to live at The Collective Old Oak and gain access
          to the mindset, tools and networks they need to grow their social enterprises and make a real difference for
          people in need.
        </p>
      </CollageSplit>

      <CollageSplit
        side="right"
        heading="The Collective Moonshots Initiative"
        images={moonshotsBubbles}
        cta={{ label: "Get in touch", href: `mailto:${site.email}?subject=Moonshots` }}
      >
        <p>
          The Collective Moonshots Initiative is a bi-monthly micro-grant programme that awards £1,000 to innovative
          teams of Collectivists who come up with an idea for launching a project that contributes positively to the
          local community.
        </p>
        <p>
          The Moonshots Initiative taps into the potential of the creative, ambitious and entrepreneurial minds of our
          communities, and gives them the resources to turn their bold ideas into reality.
        </p>
        <p>
          More information on this programme will come soon. If you’re interested in applying for a grant, we’d love to
          hear from you.
        </p>
      </CollageSplit>

      <SocialLinks
        heading="Connect with us"
        intro="Keep up with what we are up to on social media, and get the chance to get promotions!"
        links={socialLinks}
        cta={{ label: "Sign up for a newsletter", href: "#" }}
      />

      <PromoCards cards={liveWorkPromos} />
    </>
  );
}
