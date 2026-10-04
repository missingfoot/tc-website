import Hero from "@/components/sections/Hero";
import SplitIntro from "@/components/sections/SplitIntro";
import Gallery from "@/components/sections/Gallery";
import CollageSplit from "@/components/sections/CollageSplit";
import OverlapCards from "@/components/sections/OverlapCards";
import RoomCards from "@/components/sections/RoomCards";
import FeatureGroups from "@/components/sections/FeatureGroups";
import Testimonials from "@/components/sections/Testimonials";
import { oldOakIncluded } from "@/content/included";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import { oldOakBenefitsImages, oldOakCommunityCards, oldOakGallery, oldOakRooms, oldOakTestimonials } from "@/content/old-oak";

export default function Home() {
  return (
    <>
      <Hero
        image="/images/hero-cover-old-oak.jpg"
        imageAlt="The Collective Old Oak lounge"
        eyebrow="North London"
        title="Old Oak"
        subtitle="Live somewhere that's home, and so much more."
        cta={{ label: "Apply Now", href: "#" }}
      />

      <SplitIntro heading="Co-living at Old Oak" cta={{ label: "Read more", href: "#" }}>
        More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses
        shared spaces and facilities to create a more fulfilling lifestyle. Home to over 500 people
        from all walks of life, all our members share a curious mind and a desire to live their life
        in a more connected way with the people around them.
      </SplitIntro>

      <Gallery
        heading="Explore the spaces"
        intro="Co-living is a living experience that's bold, exciting and unique. By combining shared spaces with events and opportunities to connect, collective living provides a platform for you to maximise your potential."
        images={oldOakGallery}
        footer={
          <Button href="#" variant="dark">
            <Icon360 />
            View 3D Tour
          </Button>
        }
      />

      <CollageSplit
        heading={
          <>
            The benefits of <span className="whitespace-nowrap">co-living</span>
          </>
        }
        images={oldOakBenefitsImages}
      >
        <p>
          We know that one of the most daunting things about moving is feeling isolated or alone.
          Whether you&apos;re new to the city, trying to meet new people, starting a business or
          building your career, co-living at Old Oak helps you to feel part of something bigger. Old
          Oak is a place fuelled by experiences. Our diverse group of members creates the perfect
          environment for you to immerse yourself and discover something new every single day.
        </p>
        <p>
          Whether it&apos;s in your private apartment, or in one of our more quiet shared spaces like
          the library or spa, Old Oak provides ample space for you to take a bit of much needed time
          out. The age-old &apos;work hard, play harder&apos; is realized at Old Oak. With a games room,
          cinema room, multiple restaurants and bars, and a roof garden, there&apos;s more than enough
          to keep even the most active busy.
        </p>
      </CollageSplit>

      <OverlapCards {...oldOakCommunityCards} />

      <RoomCards
        heading="Explore the rooms"
        intro="Each room in Old Oak has unique co-living feel that is designed to make you feel at home but not keep you in your room where you are encouraged to explore and make connections with other members."
        rooms={oldOakRooms}
      />

      <FeatureGroups
        heading="What’s included"
        intro="More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses shared spaces and facilities to create a more fulfilling lifestyle."
        groups={oldOakIncluded}
      />

      <Testimonials
        heading="Residents love our spaces"
        intro="More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses shared spaces and facilities to create a more fulfilling lifestyle."
        testimonials={oldOakTestimonials}
      />
    </>
  );
}
