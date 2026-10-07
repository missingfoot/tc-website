import type { ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import CompactGallery from "@/components/ui/CompactGallery";
import PhotoStrip from "@/components/sections/PhotoStrip";
import PromoCards from "@/components/sections/PromoCards";
import RoomCards from "@/components/sections/RoomCards";
import Button from "@/components/ui/Button";
import StickyBar from "@/components/ui/StickyBar";
import Container from "@/components/ui/Container";
import FeatureList from "@/components/ui/FeatureList";
import RoomBooking from "@/components/ui/RoomBooking";
import Section from "@/components/ui/Section";
import VideoButton from "@/components/ui/VideoButton";
import { coLivingAbout } from "@/content/co-living";
import type { CircleImage, Cta, GalleryImage, PromoCard, Room, RoomDetails } from "@/lib/types";
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
  /** About the building: copy, then its photos as a compact gallery, or a single photo (with a play button when there's a video). */
  about: { heading: string; text: string[]; photos?: GalleryImage[]; poster?: CircleImage; video?: string };
  promos: PromoCard[];
  /** The building's room cards: the others (all but this room) are shown near the end, to browse on. */
  rooms?: Room[];
};

// The main column's width on desktop
const aboutSizes = sizes2x(["(min-width: 1024px)", "45rem"], [null, "100vw"]);

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
 * A room page, laid out like a listing: a strip of the room's photos under the nav, then the
 * details and more about the building in a main column with the booking card beside it (sticky
 * on desktop), then quick links.
 * On mobile the booking block sits under the key facts, and a bar pinned to the bottom of the
 * screen keeps the booking button in reach.
 */
export default function RoomDetail({ room, cta, ctaFields, included, about, promos, rooms = [] }: RoomDetailProps) {
  // The pinned bar's button goes straight to the form, with the hidden fields as its query
  const query = ctaFields ? `?${new URLSearchParams(ctaFields)}` : "";

  return (
    <>
      <PhotoStrip images={room.photos} label={`Photos of the ${room.name}`} floorPlan={room.floorPlan} />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_22.5rem] lg:gap-x-16 xl:gap-x-24">
          <div>
            <h1 className="text-4xl font-bold leading-heading text-ink">{room.name}</h1>
            <p className="mt-2 text-lg text-stone">{room.location}</p>
            <FeatureList items={room.features} twoColumn className="mt-8" />
          </div>

          {/* Desktop: the right-hand column, pulled up over the photos and sticky under the nav */}
          <div className="relative z-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <RoomBooking price={room.price} prices={room.prices} booking={room.booking} cta={cta} fields={ctaFields} className="lg:sticky lg:top-28 lg:-mt-36" />
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            <Block heading="About the room">
              <Paragraphs items={room.about} />
            </Block>

            <Block heading="What’s included">
              <FeatureList items={included} twoColumn />
            </Block>

            <Block heading={about.heading}>
              <Paragraphs items={about.text} />
              {about.photos ? (
                <div className="mt-8">
                  <CompactGallery images={about.photos} sizes={aboutSizes} />
                </div>
              ) : (
                about.poster && (
                  <div className="relative mt-8 aspect-[7/4] overflow-hidden rounded-2xl bg-ink/10">
                    <Photo src={about.poster.src} alt={about.poster.alt} sizes={aboutSizes} className="object-cover" />
                    {about.video && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <VideoButton label="Play video" video={about.video} variant="white" />
                      </div>
                    )}
                  </div>
                )
              )}
            </Block>

            <Block heading="About Co-living">
              <Paragraphs items={coLivingAbout} />
            </Block>
          </div>
        </Container>
      </Section>

      {/* Cards link to /…/rooms/<slug>, so this room's is the one ending in its slug */}
      {rooms.length > 1 && <RoomCards heading="Other rooms" rooms={rooms.filter((r) => !r.href.endsWith(`/${room.slug}`))} />}

      <PromoCards cards={promos} />

      <StickyBar title={room.name} subtitle={`From ${room.price} pw`} hideWhenVisible="#booking">
        <Button href={`${cta.href}${query}`} variant="dark">
          {cta.label}
        </Button>
      </StickyBar>
    </>
  );
}
