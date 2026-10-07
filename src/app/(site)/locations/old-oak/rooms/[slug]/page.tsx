import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomDetail from "@/components/sections/RoomDetail";
import { oldOakAbout, oldOakPromos, oldOakRoomDetails, oldOakRoomIncluded } from "@/content/old-oak";

export function generateStaticParams() {
  return oldOakRoomDetails.map(({ slug }) => ({ slug }));
}

// Unknown slugs 404 via notFound(). (Not `dynamicParams = false`: on Netlify that 404s the prebuilt pages too.)
function findRoom(slug: string) {
  const room = oldOakRoomDetails.find((r) => r.slug === slug);
  if (!room) notFound();
  return room;
}

export async function generateMetadata({ params }: PageProps<"/locations/old-oak/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${findRoom(slug).name} · Old Oak` };
}

/** An Old Oak room page (layout in RoomDetail). */
export default async function OldOakRoom({ params }: PageProps<"/locations/old-oak/rooms/[slug]">) {
  const { slug } = await params;
  const room = findRoom(slug);
  const apply = { label: "Apply now", href: `/locations/old-oak/rooms/${room.slug}/apply` };

  return <RoomDetail room={room} cta={apply} included={oldOakRoomIncluded} about={oldOakAbout} promos={oldOakPromos} />;
}
