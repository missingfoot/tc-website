import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomDetail from "@/components/sections/RoomDetail";
import { canaryWharfAbout, canaryWharfPromos, canaryWharfRoomDetails, canaryWharfRoomIncluded, canaryWharfRooms } from "@/content/canary-wharf";

export function generateStaticParams() {
  return canaryWharfRoomDetails.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findRoom(slug: string) {
  const room = canaryWharfRoomDetails.find((r) => r.slug === slug);
  if (!room) notFound();
  return room;
}

export async function generateMetadata({ params }: PageProps<"/locations/canary-wharf/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findRoom(slug).name} · Canary Wharf` };
}

// Opening soon: the booking button joins the waitlist, with Canary Wharf chosen
const waitlist = { label: "Join the waitlist", href: "/waitlist" };

/** A Canary Wharf room page (layout in RoomDetail). */
export default async function CanaryWharfRoom({ params }: PageProps<"/locations/canary-wharf/rooms/[slug]">) {
  const { slug } = await params;
  const room = findRoom(slug);

  return (
    <RoomDetail
      room={room}
      cta={waitlist}
      ctaFields={{ location: "canary-wharf" }}
      included={canaryWharfRoomIncluded}
      about={canaryWharfAbout}
      promos={canaryWharfPromos}
      rooms={canaryWharfRooms}
    />
  );
}
