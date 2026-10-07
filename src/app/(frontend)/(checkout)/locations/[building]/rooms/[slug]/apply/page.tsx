import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomApplication from "@/components/application/RoomApplication";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getPricingRules, getRoom, getRooms, roomDetails } from "@/lib/payload";

// Bedrooms are in the CMS (/admin → Bedrooms), each under its building's co-living (/admin → Locations)
export async function generateStaticParams() {
  return (await getRooms()).filter((room) => !room.home.comingSoon).map((room) => ({ building: room.home.slug, slug: room.slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
async function findRoom(building: string, slug: string) {
  const room = await getRoom(building, slug);
  if (!room || room.home.comingSoon) notFound();
  return { room: roomDetails(room), building: room.home };
}

export async function generateMetadata({ params }: PageProps<"/locations/[building]/rooms/[slug]/apply">): Promise<Metadata> {
  const { building, slug } = await params;
  const found = await findRoom(building, slug);
  return { title: `Apply · ${found.room.name} · ${found.building.name}`, robots: { index: false } };
}

/** The room application, reached from a room page's "Apply now" (which passes the chosen ?period=). */
export default async function ApplyForRoom({ params, searchParams }: PageProps<"/locations/[building]/rooms/[slug]/apply">) {
  const { building, slug } = await params;
  const { period } = await searchParams;
  const { room } = await findRoom(building, slug);
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
              // The rate for the length picked, from pence
              weeklyPrice: (room.rates.find((rate) => rate.period === chosenPeriod) ?? room.rates[0]).weekly / 100,
              moveIn: room.booking.moveIn,
              period: chosenPeriod,
              rules: await getPricingRules(),
            }}
          />
        </Container>
      </Section>
    </>
  );
}
