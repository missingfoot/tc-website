import type { LinkCard } from "@/lib/types";

const home = "/images/home";

export const homeMainLinks: LinkCard[] = [
  {
    title: "Co-Living",
    text: "Starting with London, our focus is on creating ground-breaking spaces and the greatest possible experiences within them. We’re redefining the way people can choose to live, work and play.",
    image: { src: "/images/old-oak/promos/friends-chatting.jpg", alt: "Two residents laughing together in the lounge" },
    cta: { label: "Explore Co-Living", href: "/co-living" },
  },
  {
    title: "Working",
    text: "Starting with London, our focus is on creating ground-breaking spaces and the greatest possible experiences within them. We’re redefining the way people can choose to live, work and play.",
    // TODO: only a 354px copy exists, so it's soft; swap for a larger original
    image: { src: `${home}/working.jpg`, alt: "Members working at long tables in the workspace" },
    cta: { label: "Explore Working", href: "/working" },
  },
];

export { coLivingPress as homePress } from "./co-living";

export const homeWhatsNew: LinkCard[] = [
  {
    title: "News",
    text: "Read the latest news about the community, our projects and the The Collective company in general.",
    image: { src: `${home}/news.jpg`, alt: "A cyclist on the canal path beside Old Oak" },
    cta: { label: "Read the latest news", href: "/blog" },
  },
  {
    title: "Community",
    text: "Find out more about our community and meet some of our members where they share their experiences living with us",
    image: { src: `${home}/community.jpg`, alt: "Residents playing games in the games room" },
    cta: { label: "Explore the community", href: "#" },
  },
  {
    title: "Innovation",
    text: "Catch up with the latest tech innovations we have been working on to make living at The Collective an amazing experience",
    image: { src: `${home}/innovation.jpg`, alt: "Members building a prototype together" },
    cta: { label: "The Collective Labs", href: "/labs" },
  },
  {
    title: "City Life",
    text: "New to London? We give you some great tips and insights into living in London and some best practices",
    image: { src: `${home}/city-life.jpg`, alt: "Aerial view of London and the Thames" },
    cta: { label: "See our guide to London", href: "#" },
  },
];
