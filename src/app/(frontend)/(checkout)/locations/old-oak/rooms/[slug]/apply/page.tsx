import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomApplication from "@/components/application/RoomApplication";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getRoom, getRooms, roomDetails } from "@/lib/payload";
import { parsePrice } from "@/lib/application";

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

export async function generateMetadata({ params }: PageProps<"/locations/old-oak/rooms/[slug]/apply">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Apply · ${(await findRoom(slug)).name} · Old Oak`, robots: { index: false } };
}

/** The room application, reached from a room page's "Apply now" (which passes the chosen ?period=). */
export default async function ApplyForRoom({ params, searchParams }: PageProps<"/locations/old-oak/rooms/[slug]/apply">) {
  const { slug } = await params;
  const { period } = await searchParams;
  const room = await findRoom(slug);
  // Only accept a period the room offers; otherwise the first (longest)
  const chosenPeriod = typeof period === "string" && room.booking.periods.includes(period) ? period : room.booking.periods[0];

  return (
    <>
      {/* Dark band behind the header, which is white and transparent at the top of the page */}
      <div aria-hidden="true" className="h-24 bg-ink" />

      {/* Mobile: extra room at the bottom so the last button can scroll clear of the pinned "Show info" bar */}
      <Section tone="cream" className="max-lg:bg-white max-lg:pb-36">
        <Container>
          {/* Desktop shows the title in the checkout header, so this is for mobile and screen readers */}
          <h1 className="mb-10 text-4xl font-bold leading-heading text-ink lg:sr-only">Room application</h1>

          <RoomApplication
            room={{
              slug: room.slug,
              name: room.name,
              location: room.location,
              floor: room.booking.floor,
              photo: { src: room.photos[0].src!, alt: room.photos[0].alt },
              weeklyPrice: parsePrice(room.price),
              moveIn: room.booking.moveIn,
              period: chosenPeriod,
            }}
          />
        </Container>
      </Section>
    </>
  );
}
