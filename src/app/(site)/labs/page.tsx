import LabsHero from "@/components/sections/LabsHero";
import Intro from "@/components/sections/Intro";
import ProductShowcase from "@/components/sections/ProductShowcase";
import PromoCards from "@/components/sections/PromoCards";
import SocialLinks from "@/components/sections/SocialLinks";
import { acquire, colab, mobileApp } from "@/content/labs";
import { liveWorkPromos } from "@/content/promos";
import { socialLinks } from "@/content/old-oak";

export const metadata = { title: "Labs" };

export default function Labs() {
  return (
    <>
      <LabsHero
        title="Innovation Labs"
        subtitle="We build new technology and software that supports our ventures and helps them scale to cities around the world."
        cta={{ label: "See our projects", href: "#products" }}
      />

      <Intro raised heading="Our mission">
        <p>
          The Collective Innovation Labs is our thought leadership living lab that explores and highlights the ways in
          which The Collective is using innovative technologies and tools to contribute to the radical transformation of
          our urban habitats and built environments. We incorporate these digital technologies into the layers of
          networks and information that permeate throughout the urban spaces in which our ventures thrive.
        </p>
        <p>
          Our Innovation Labs initiative aims to gather and collect data from our communities in order to cultivate ideas
          to improve and facilitate the processes of technical construction, operational maintenance, internal
          communications, space design and community experience in each of our co-living spaces. We will use these
          learnings in order to consistently be aware of the emerging trends within the urban real estate sector and to
          always remain at the forefront of the ever growing shared living phenomenon.
        </p>
      </Intro>

      <div id="products" className="scroll-mt-28">
        <ProductShowcase tone="cream" product={acquire} />
      </div>
      <ProductShowcase product={colab} side="right" />
      <ProductShowcase tone="cream" product={mobileApp} />

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
