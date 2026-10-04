import Image from "next/image";
import type { ComponentType } from "react";
import type { Room, RoomFeatureIcon } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Basin, Bed, Hob, TapeMeasure } from "@/components/icons";
import { sizes2x } from "@/lib/images";

const FEATURE_ICONS: Record<RoomFeatureIcon, ComponentType<{ className?: string }>> = {
  bathroom: Basin,
  kitchen: Hob,
  size: TapeMeasure,
  room: Bed,
};

type RoomCardsProps = {
  heading: string;
  intro?: string;
  rooms: Room[];
};

/** Section heading and intro, then a card per room type: photo, price, feature tiles and a link. */
export default function RoomCards({ heading, intro, rooms }: RoomCardsProps) {
  return (
    <Section className="bg-cream">
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {rooms.map((room) => (
            <li key={room.name}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-center">
      <div className="relative aspect-[7/5]">
        <Image
          src={room.image.src}
          alt={room.image.alt}
          fill
          sizes={sizes2x(["(min-width: 1024px)", "354px"], ["(min-width: 768px)", "50vw"], [null, "100vw"])}
          quality={90}
          className="object-cover"
          style={{ objectPosition: room.image.position ?? "center" }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center p-8">
        <h3 className="text-2xl font-medium text-ink">{room.name}</h3>
        <Pill className="mt-4">{room.price}</Pill>

        <ul className="mt-8 grid w-full grid-cols-2 gap-5">
          {room.features.map(({ icon, label }) => {
            const FeatureIcon = FEATURE_ICONS[icon];
            return (
              <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-cream/40 px-2 py-5">
                <FeatureIcon className="text-ink" />
                <span className="text-sm leading-tight text-stone">{twoLines(label)}</span>
              </li>
            );
          })}
        </ul>

        <Button href={room.href} variant="dark" arrow className="mt-8 w-full justify-center">
          View Room
        </Button>
      </div>
    </article>
  );
}

/** Breaks a label before its last word, as in the design: "Private / Bathroom", "11.6 Square / Metres". */
function twoLines(label: string) {
  const i = label.lastIndexOf(" ");
  if (i === -1) return label;
  return (
    <>
      {label.slice(0, i)}
      <br />
      {label.slice(i + 1)}
    </>
  );
}
