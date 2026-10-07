import Photo from "@/components/ui/Photo";
import CompactGallery from "@/components/ui/CompactGallery";
import { RoomPriceLabel, RoomPricingControl, RoomPricingProvider } from "@/components/ui/RoomPricing";
import type { Room } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { sizes2x } from "@/lib/images";

type RoomCardsProps = {
  /** Section background (default cream). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  rooms: Room[];
  /** Button label on each card (default "View Room"). */
  ctaLabel?: string;
};

/** Section heading and intro, then a card per room type or location: photo, name, price, feature tiles and a link. */
export default function RoomCards({ heading, intro, rooms, ctaLabel = "View Room", tone = "cream" }: RoomCardsProps) {
  // Membership lengths with prices, longest first: when there are some, a control above the cards picks one
  const lengths = [...new Set(rooms.flatMap((room) => room.prices?.map((p) => p.months) ?? []))].sort((a, b) => b - a);

  const content = (
    <>
      <SectionIntro heading={heading} intro={intro} />
      {lengths.length > 0 && (
        // As wide as the cards below, so it lines up with their edges
        <div className={`mt-10 w-full ${rooms.length % 3 === 0 ? "" : "mx-auto max-w-4xl"}`}>
          <RoomPricingControl lengths={lengths} />
        </div>
      )}
      {/* Three columns for 3, 6…; otherwise two (e.g. 4 cards make a tidy 2 × 2) */}
      <ul className={`mt-12 grid gap-8 md:grid-cols-2 lg:gap-10 ${rooms.length % 3 === 0 ? "lg:grid-cols-3" : "mx-auto max-w-4xl"}`}>
        {rooms.map((room) => (
          <li key={room.name}>
            <RoomCard room={room} ctaLabel={ctaLabel} />
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <Section tone={tone}>
      <Container>{lengths.length > 0 ? <RoomPricingProvider lengths={lengths}>{content}</RoomPricingProvider> : content}</Container>
    </Section>
  );
}

const cardSizes = sizes2x(["(min-width: 1024px)", "354px"], ["(min-width: 768px)", "50vw"], [null, "100vw"]);

function RoomCard({ room, ctaLabel }: { room: Room; ctaLabel: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-center">
      {room.photos && room.photos.length > 1 ? (
        // Flush with the card's top edge: the card's own rounding clips it
        <CompactGallery images={room.photos} floorPlan={room.floorPlan} sizes={cardSizes} aspect="aspect-[7/5]" className="" />
      ) : (
        <div className="relative aspect-[7/5]">
          <Photo
            src={room.image.src}
            alt={room.image.alt}
            sizes={cardSizes}
            quality={90}
            className="object-cover"
            style={{ objectPosition: room.image.position ?? "center" }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col items-center p-8">
        <h3 className="text-2xl font-medium text-ink">{room.name}</h3>
        {room.subtitle && <p className="mt-1 text-sm text-stone">{room.subtitle}</p>}
        <Pill className="mt-4">{room.prices ? <RoomPriceLabel prices={room.prices} fallback={room.price} /> : room.price}</Pill>

        <ul className="mt-8 grid w-full grid-cols-2 gap-5">
          {room.features.map(({ icon, label }) => {
            const FeatureIcon = icon;
            return (
              <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-cream/40 px-2 py-5">
                <FeatureIcon className="text-ink" />
                <span className="text-sm leading-tight text-stone">{twoLines(label)}</span>
              </li>
            );
          })}
        </ul>

        <Button href={room.href} variant="dark" arrow className="mt-8 w-full justify-center">
          {ctaLabel}
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
