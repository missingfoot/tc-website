import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Photo from "@/components/ui/Photo";
import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import Button from "@/components/ui/Button";
import StickyBar from "@/components/ui/StickyBar";
import Container from "@/components/ui/Container";
import FeatureList from "@/components/ui/FeatureList";
import RoomBooking from "@/components/ui/RoomBooking";
import Section from "@/components/ui/Section";
import VideoButton from "@/components/ui/VideoButton";
import RenderBlocks from "@/components/payload/RenderBlocks";
import { fillVariables } from "@/lib/variables";
import { getRoom, getRooms, getTemplate, roomColumn, roomDetails } from "@/lib/payload";
import { sizes2x } from "@/lib/images";
import { text } from "@/lib/styles";

// Rooms are in the CMS (/admin → Rooms)
export async function generateStaticParams() {
  return (await getRooms()).map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findRoom(slug: string) {
  const room = await getRoom(slug);
  if (!room) notFound();
  return roomDetails(room);
}

export async function generateMetadata({ params }: PageProps<"/locations/old-oak/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${(await findRoom(slug)).name} · Old Oak` };
}


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
 * screen keeps "Apply now" in reach.
 */
export default async function OldOakRoom({ params }: PageProps<"/locations/old-oak/rooms/[slug]">) {
  const { slug } = await params;
  const room = await findRoom(slug);
  // The room template (/admin → Templates) has the main column's shared content and the sections
  // after it. Templates come from the seed: without one, there's no layout to show
  const found = await getTemplate("room");
  if (!found) notFound();
  // {lowest-price} in the template's words is this room's
  const template = fillVariables(found, new Map(), room.price);
  const shared = roomColumn(template);
  const apply = { label: "Apply now", href: `/locations/old-oak/rooms/${room.slug}/apply` };

  return (
    <>
      <Hero image={room.photos[0].src!} imageAlt={room.photos[0].alt} imagePreview={room.photos[0].blur} wash={false} />

      <Section raised>
        <Container className="grid gap-12 lg:grid-cols-[1fr_22.5rem] lg:gap-x-16 xl:gap-x-24">
          <div>
            <h1 className="text-4xl font-bold leading-heading text-ink">{room.name}</h1>
            <p className="mt-2 text-lg text-stone">{room.location}</p>
            <FeatureList items={room.features} twoColumn className="mt-8" />
          </div>

          {/* Desktop: the right-hand column, pulled up over the photos and sticky under the nav */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <RoomBooking price={room.price} booking={room.booking} rates={room.rates} cta={apply} className="lg:sticky lg:top-28 lg:-mt-36" />
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            <Block heading="About the room">
              <Paragraphs items={room.about} />
            </Block>

            {room.floorPlan && (
              <Block heading="Floor plan">
                <div className="relative aspect-[4/3] max-w-xl">
                  {/* Line drawing: served as the original PNG (small, lossless), since WebP re-encoding blurs thin lines */}
                  <Image src={room.floorPlan.src} alt={room.floorPlan.alt} fill unoptimized className="object-contain" />
                </div>
              </Block>
            )}

            {shared.included.length > 0 && (
              <Block heading="What’s included">
                <FeatureList items={shared.included} twoColumn />
              </Block>
            )}

            {shared.about.heading && (
            <Block heading={shared.about.heading}>
              <Paragraphs items={shared.about.text} />
              <div className="relative mt-8 aspect-[7/4] overflow-hidden rounded-2xl bg-ink/10">
                <Photo src={shared.about.poster.src} alt={shared.about.poster.alt} preview={shared.about.poster.blur} sizes={sizes2x(["(min-width: 1024px)", "45rem"], [null, "100vw"])} className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoButton label="Play video" video={shared.about.video} variant="white" />
                </div>
              </div>
            </Block>
            )}

            {shared.coLivingAbout.length > 0 && (
              <Block heading="About Co-living">
                <Paragraphs items={shared.coLivingAbout} />
              </Block>
            )}
          </div>
        </Container>
      </Section>

      <RenderBlocks blocks={template.layout} place={{ gallery: room.photos }} />

      <StickyBar title={room.name} subtitle={`From ${room.price} pw`} hideWhenVisible="#booking">
        <Button href={apply.href} variant="dark">
          {apply.label}
        </Button>
      </StickyBar>
    </>
  );
}
