import type { FaqItem } from "@/components/sections/Faq";
import type { LogoAsset, PhotoGroup } from "@/components/sections/MediaKit";
import type { LinkCard, PressQuote } from "@/lib/types";

// From the old Press page. TODO: newer coverage; the old news photos weren't saved, so the cards
// use our own photos that fit each story.
export const pressNews: LinkCard[] = [
  {
    title: "Is ‘luxury co-living’ a solution to loneliness in big cities?",
    text: "BBC News · 30 March 2017",
    image: { src: "/images/old-oak/promos/friends-chatting.jpg", alt: "Two residents chatting in the lounge" },
    cta: { label: "Watch on the BBC", href: "http://www.bbc.com/news/av/magazine-39381920/is-luxury-co-living-a-solution-to-loneliness-in-big-cities" },
  },
  {
    title: "The new commune: it’s the way to rent",
    text: "The Times · 18 November 2016",
    image: { src: "/images/co-living/old-oak-exterior.jpg", alt: "The Collective Old Oak building" },
    cta: { label: "Read in The Times", href: "https://www.thetimes.co.uk/article/the-new-commune-its-the-way-to-rent-7fgbcrf8g" },
  },
  {
    title: "Generation Rent’s new home: yoga classes, a dog cleaning station and communal living",
    text: "The Telegraph · 18 September 2016",
    image: { src: "/images/old-oak/benefits/yoga.jpg", alt: "A resident doing yoga" },
    cta: { label: "Read in The Telegraph", href: "https://www.telegraph.co.uk/property/renting/generation-rents-new-home-yoga-classes-a-dog-cleaning-station-an/" },
  },
];

export const morePressUrl = "https://medium.com/collective-living";

// The design's questions with answers we know. TODO: answers for "Was it based on the 2015 film
// High-Rise?", "How much money does The Collective make?" and "What's the difference between The
// Collective and…?" (the design's placeholder).
export const pressInfo: FaqItem[] = [
  {
    question: "What is The Collective all about?",
    answer:
      "We create better places for people to live, work and play. Our homes and workspaces are designed to bring people together, unlocking a new lifestyle for the curious and ambitious: beautifully designed private spaces with shared amenities like cinemas, gyms, spas, co-working spaces, bars and restaurants.",
  },
  {
    question: "Was The Collective really started in a library?",
    answer: [
      "Yes! The Collective was born in 2010, in the library of LSE University, when our CEO Reza Merchant set out to solve a problem he had experienced first-hand: the lack of quality, affordable accommodation for young people in London.",
      "Since then we’ve learnt a lot about how young people live, and the role that the places around them play in their lives. We’ve grown up since our founding days, and our ambitions have grown with us, but our objective of making life better for our generation remains the same.",
    ],
  },
  {
    question: "Where can I find The Collective?",
    answer:
      "Our co-living building is at Old Oak in north-west London (NW10), the largest of its kind in the world. Our head office, workspace and event venues are at Bedford Square in Bloomsbury (WC1), with more event spaces at Old Oak and serviced living in Acton and Notting Hill.",
  },
];

/** Press quotes (logos where we have them; the rest show the publication's name). */
export const pressQuotes: PressQuote[] = [
  {
    quote: "Co-working was last year’s squeeze. This year – not least with a planned 22-floor luxury tower of shared accommodation and amenities in Stratford, London, called The Collective – it’s all about co-living.",
    publication: "GQ",
    logo: "/images/press/gq.svg",
    href: "http://www.gq-magazine.co.uk/gallery/rolls-royce-harry-styles-guardians-of-the-galaxy-2",
  },
  {
    quote: "Take in a yoga class on the roof deck, before having dinner with neighbours at the communal table, in time for a movie in the cinema – all without leaving your home. This is the future of renting for millennials in London.",
    publication: "The Telegraph",
    logo: "/images/press/the-telegraph.svg",
    href: "https://www.telegraph.co.uk/property/renting/generation-rents-new-home-yoga-classes-a-dog-cleaning-station-an/",
  },
  {
    quote: "Most young professionals moving to thriving cities face a difficult choice between spending a big share of their income on renting their own place, or moving in with strangers in a shared house to save money. The Collective offers something different. It is home.",
    publication: "The Economist",
    logo: "/images/press/the-economist.svg",
    href: "https://www.economist.com/news/business/21727948-co-living-hipsters-not-hippies-pricey-housing-markets-mean-co-living-buildings-are",
  },
  {
    quote: "With a rooftop terrace, games room and secret garden, The Collective Old Oak could easily be mistaken for an exclusive private members’ club, based purely on its prospectus. And in many ways, that is exactly what it is.",
    publication: "Property Week",
    logo: "/images/press/property-week.svg",
    href: "https://www.propertyweek.com/co-living-pioneers-shake-up-rental-market-/5093162.article",
  },
  { quote: "Be prepared to become a Collectivist, or member, not a mere tenant.", publication: "The Times", logo: "/images/press/the-times.svg" },
  {
    quote: "British co-living property startup The Collective has revealed its bold plans to more than double the size of its portfolio with a huge expansion into the U.S. and Germany – a move that could place it among the largest co-living providers in the world.",
    publication: "Forbes",
  },
  {
    quote: "Are co-living spaces the answer to loneliness? Reza Merchant’s Collective in London’s Old Oak has proved a hit and now he’s primed to make his social experiment a global endeavour.",
    publication: "Monocle",
  },
];

const logos = "/downloads/logos/the-collective";
export const pressLogos: LogoAsset[] = [
  { name: "The Collective logo, stacked, black", file: `${logos}-stacked-black` },
  { name: "The Collective logo, stacked, white", file: `${logos}-stacked-white`, dark: true },
  { name: "The Collective logo, horizontal, black", file: `${logos}-horizontal-black` },
  { name: "The Collective logo, horizontal, white", file: `${logos}-horizontal-white`, dark: true },
];

const kit = "/images/press-kit";
const group = (heading: string, folder: string, photos: [string, string][]): PhotoGroup => ({
  heading,
  photos: photos.map(([file, alt]) => ({ src: `${kit}/${folder}/${file}.jpg`, alt })),
});

export const pressPhotos: PhotoGroup[] = [
  group("Co-living spaces", "co-living", [
    ["old-oak-reception", "Old Oak reception"],
    ["games-room", "The games room"],
    ["secret-garden", "The secret garden"],
    ["dining-room", "Dining room"],
    ["the-gallery", "The Gallery"],
    ["gym", "The gym"],
  ]),
  group("Working spaces", "working", [
    ["the-den", "The Den"],
    ["the-exchange-1", "The Exchange"],
    ["the-exchange-2", "The Exchange"],
    ["private-offices", "Private offices"],
    ["fixed-desks", "Fixed desks"],
    ["office-kitchen", "Office kitchen"],
  ]),
  group("The Collective community", "community", [
    ["canal-rowing", "Rowing on the canal"],
    ["social-chats", "Chatting round a table"],
    ["cinema", "Cinema night"],
    ["playing-games", "Playing games"],
    ["working-together", "Working on a project together"],
    ["eating-together", "Eating together"],
  ]),
];
