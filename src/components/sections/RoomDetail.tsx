import type { ReactNode } from "react";
import Image from "next/image";
import Photo from "@/components/ui/Photo";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import PromoCards from "@/components/sections/PromoCards";
import Button from "@/components/ui/Button";
import StickyBar from "@/components/ui/StickyBar";
import Container from "@/components/ui/Container";
import FeatureList from "@/components/ui/FeatureList";
import RoomBooking from "@/components/ui/RoomBooking";
import Section from "@/components/ui/Section";
import VideoButton from "@/components/ui/VideoButton";
import { coLivingAbout } from "@/content/co-living";
import type { CircleImage, Cta, PromoCard, RoomDetails } from "@/lib/types";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";

type RoomDetailProps = {
  room: RoomDetails;
  /** The booking button, e.g. Apply now, or Join the waitlist for a building that isn't open yet. */
  cta: Cta;
  /** Sent with the booking form as hidden fields, e.g. { location: "canary-wharf" } for the waitlist. */
  ctaFields?: Record<string, string>;
  /** "What's included" for every room in the building. */
  included: RoomDetails["features"];
  /** About the building: copy and a photo (with a play button when there's a video). */
  about: { heading: string; text: string[]; poster: CircleImage; video?: string };
  promos: PromoCard[];
};

/** A titled block of copy in the room page's main column. */
function Block({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className={text.subheading}>{heading}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className={`flex flex-col gap-5 ${text.body}`}>
      {items.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

/**
 * A room page, laid out like a listing: a photo hero, then the details and more about the
 * building in a main column with the booking card beside it (sticky on desktop), then the gallery
 * and quick links.
 * On mobile the booking block sits under the key facts, and a bar pinned to the bottom of the
 * screen keeps the booking button in reach.
 */
export default function RoomDetail({ room, cta, ctaFields, included, about, promos }: RoomDetailProps) {
  // The pinned bar's button goes straight to the form, with the hidden fields as its query
  const query = ctaFields ? `?${new URLSearchParams(ctaFields)}` : "";

  return (
    <>
      <Hero image={room.photos[0].src!} imageAlt={room.photos[0].alt} wash={false} />

      <Section raised>
        <Container className="grid gap-12 lg:grid-cols-[1fr_22.5rem] lg:gap-x-16 xl:gap-x-24">
          <div>
            <h1 className="text-4xl font-bold leading-heading text-ink">{room.name}</h1>
            <p className="mt-2 text-lg text-stone">{room.location}</p>
            <FeatureList items={room.features} twoColumn className="mt-8" />
          </div>

          {/* Desktop: the right-hand column, pulled up over the photos and sticky under the nav */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <RoomBooking price={room.price} booking={room.booking} cta={cta} fields={ctaFields} className="lg:sticky lg:top-28 lg:-mt-36" />
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            <Block heading="About the room">
              <Paragraphs items={room.about} />
            </Block>

            {room.floorPlan && (
              <Block heading="Floor plan">
                <div className="relative aspect-[4/3] max-w-xl">
                  {/* Line drawing: served as the original file (small, lossless), since re-encoding blurs thin lines */}
                  <Image src={room.floorPlan.src} alt={room.floorPlan.alt} fill unoptimized className="object-contain" />
                </div>
              </Block>
            )}

            <Block heading="What’s included">
              <FeatureList items={included} twoColumn />
            </Block>

            <Block heading={about.heading}>
              <Paragraphs items={about.text} />
              <div className="relative mt-8 aspect-[7/4] overflow-hidden rounded-2xl bg-ink/10">
                <Photo src={about.poster.src} alt={about.poster.alt} sizes={sizes2x(["(min-width: 1024px)", "45rem"], [null, "100vw"])} className="object-cover" />
                {about.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoButton label="Play video" video={about.video} variant="white" />
                  </div>
                )}
              </div>
            </Block>

            <Block heading="About Co-living">
              <Paragraphs items={coLivingAbout} />
            </Block>
          </div>
        </Container>
      </Section>

      <Gallery heading="Explore the room" images={room.photos} />

      <PromoCards cards={promos} />

      <StickyBar title={room.name} subtitle={`From ${room.price} pw`} hideWhenVisible="#booking">
        <Button href={`${cta.href}${query}`} variant="dark">
          {cta.label}
        </Button>
      </StickyBar>
    </>
  );
}
