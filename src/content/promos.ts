import type { PromoCard } from "@/lib/types";

/** Generic "Live with us" / "Work for us" cards, for pages that aren't about a product. */
export const liveWorkPromos: PromoCard[] = [
  {
    heading: "Live with us",
    image: { src: "/images/press-kit/community/eating-together.jpg", alt: "Residents eating together in a communal lounge" },
    cta: { label: "Explore co-living", href: "/co-living" },
  },
  {
    heading: "Work for us",
    image: { src: "/images/careers/team-laptop.jpg", alt: "Team members working through ideas around a table" },
    cta: { label: "Open positions", href: "/careers#open-positions" },
  },
];
