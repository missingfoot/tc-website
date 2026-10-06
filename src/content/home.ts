import type { LinkCard } from "@/lib/types";

const home = "/images/home";

export const homeMainLinks: LinkCard[] = [
  {
    title: "Co-Living",
    text: "Co-living is a new way to rent in cities. Combining private ensuites with beautiful shared spaces and a programme of inspiring events, all included in one monthly bill, we help our members get the most out of city living.",
    image: { src: "/images/old-oak/promos/friends-chatting.jpg", alt: "Two residents laughing together in the lounge" },
    cta: { label: "Explore Co-Living", href: "/co-living" },
  },
  {
    title: "Working",
    text: "It’s all about the environment when you’re working on your next big thing. Whether it’s a collaboration or a solo endeavour, our workspaces are designed to enable your best work.",
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
    cta: { label: "Read the latest news", href: "/blog/category/news" },
  },
  {
    title: "Community",
    text: "Find out more about our community and meet some of our members where they share their experiences living with us",
    image: { src: `${home}/community.jpg`, alt: "Residents playing games in the games room" },
    cta: { label: "Explore the community", href: "/blog/category/community" },
  },
  {
    title: "Innovation",
    text: "Catch up with the latest tech innovations we have been working on to make living at The Collective an amazing experience",
    image: { src: `${home}/innovation.jpg`, alt: "Members building a prototype together" },
    cta: { label: "Explore innovation", href: "/blog/category/innovation" },
  },
  {
    title: "City Life",
    text: "New to London? We give you some great tips and insights into living in London and some best practices",
    image: { src: `${home}/city-life.jpg`, alt: "Aerial view of London and the Thames" },
    cta: { label: "See our guide to London", href: "/blog/category/city-living" },
  },
];
