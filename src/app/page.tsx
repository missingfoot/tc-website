import Hero from "@/components/sections/Hero";
import SplitIntro from "@/components/sections/SplitIntro";
import Gallery from "@/components/sections/Gallery";
import Button from "@/components/ui/Button";
import { Icon360 } from "@/components/icons";
import { oldOakGallery } from "@/content/old-oak";

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
    </>
  );
}
