import {
  Bill, CalendarCheck, Cocktail, Dumbbell, Router, Shelves, Sofa, SprayBottle, TeamChat, WashingMachine,
} from "@/components/icons";
import type { FaqItem } from "@/components/sections/Faq";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import type { CircleImage, GalleryImage, LinkCard, Perk, PressQuote, PromoCard } from "@/lib/types";

const img = "/images/co-living";

// Two unlabelled groups = the design's two-column list
export const coLivingIncluded: FeatureGroup[] = [
  {
    items: [
      { icon: Bill, label: "All inclusive bills" },
      { icon: SprayBottle, label: "Bi-weekly cleaning" },
      { icon: WashingMachine, label: "Laundry facilities" },
      { icon: Dumbbell, label: "Gym" },
      { icon: CalendarCheck, label: "Flexible contracts" },
    ],
  },
  {
    items: [
      { icon: Router, label: "Superfast broadband" },
      { icon: TeamChat, label: "24/7 concierge" },
      { icon: Sofa, label: "Communal spaces" },
      { icon: Shelves, label: "Work spaces" },
      { icon: Cocktail, label: "Events programme" },
    ],
  },
];

export const coLivingLocations: LinkCard[] = [
  {
    title: "Old Oak",
    text: "NW10 · Starting at £245 per week",
    image: { src: `${img}/old-oak-exterior.jpg`, alt: "The Collective Old Oak building" },
    cta: { label: "Explore Old Oak", href: "/locations/old-oak" },
  },
  {
    title: "Canary Wharf",
    text: "E14 · Starting at £245 per week",
    image: { src: `${img}/canary-wharf.jpg`, alt: "The Collective Canary Wharf tower", position: "center 30%" },
    cta: { label: "Explore Canary Wharf", href: "/locations/canary-wharf" },
  },
];

export const coLivingGrowImages: { main: CircleImage; top: CircleImage; bottom: CircleImage } = {
  main: { src: `${img}/kayaking.jpg`, alt: "Residents kayaking on the canal" },
  top: { src: `${img}/workshop.jpg`, alt: "Residents at a craft workshop" },
  bottom: { src: `${img}/party.jpg`, alt: "Residents dancing at a party" },
};

export const coLivingFaq: FaqItem[] = [
  {
    question: "What is co-living?",
    answer:
      "Co-living is a way of living in cities that is focused on community and convenience. Live as part of a community, sharing wonderfully designed spaces and inspiring events, with the comfort of being able to retreat to your own fully furnished private apartment at the end of the day. Everything you need to make the most of city life is included in bill; rent, concierge, superfast internet, all utilities and taxes, room cleaning, exciting daily events and gym membership. So you can do the living, and leave the rest to us.",
  },
  {
    question: "Who is co-living for?",
    answer:
      "Co-living is for anyone who is ready to embrace a more connected way of living; who want to be part of something through the place they call home. Diverse individuals of different ages, cultures, genders and languages, come together to form their own environment in which they live, work and play.",
  },
  {
    question: "What is included in the price?",
    answer:
      "The all-in-one monthly bill covers your rent, council tax, utility bills, wi-fi, access to the gym (free membership after a £50 joining fee), room cleaning, linen changes, access to communal spaces, community events and our 24/7 on-site team to help make your experience the best it can be.",
  },
  {
    question: "What is the length of stay?",
    // TODO: copy is from the old site (mentions Canary Wharf opening in 2019) — needs updating
    answer: [
      "We offer membership lengths of nine and twelve months, with a limited number of four and six month memberships over the summer. If you want to stay with us for any longer than twelve months, all you have to do is renew your membership. Please note that the price of the room may vary dependant on membership length. For more information on the latest room rates, please visit our booking form.",
      "The Collective Canary Wharf (opening in 2019) will offer the option to stop in or stay a while, with stays from just one night. No matter how long you’re around for, we’ve got you covered.",
    ],
  },
  {
    question: "Is my room cleaned and my linen changed?",
    answer:
      "Yes! We have an entire team dedicated to exactly that. Room cleans and linen changes are once every two weeks. All the common spaces are cleaned everyday. You’ll be given a schedule so you can plan ahead.",
  },
  {
    question: "What is provided in my room?",
    answer:
      "All rooms are fully furnished and come with a queen size bed with under bed storage, bedding and bed linen, desk and desk chair, 24 inch screen, wardrobe, kettle and waste paper bin.",
  },
];

const logo = (name: string) => `/images/press/${name}.svg`;

export const coLivingPress: PressQuote[] = [
  {
    quote: "Take in a yoga class on the roof deck, before having dinner with neighbours at the communal table, in time for a movie in the cinema – all without leaving your home. This is the future of renting for millennials in London.",
    publication: "The Telegraph",
    logo: logo("the-telegraph"),
  },
  {
    quote: "Co-working was last year’s squeeze. This year – not least with a planned 22-floor luxury tower of shared accommodation and amenities in Stratford, London, called The Collective – it’s all about co-living.",
    publication: "GQ",
    logo: logo("gq"),
  },
  {
    quote: "Most young professionals moving to thriving cities face a difficult choice between spending a big share of their income on renting their own place, or moving in with strangers in a shared house to save money. The Collective offers something different.",
    publication: "The Economist",
    logo: logo("the-economist"),
  },
  {
    quote: "With a rooftop terrace, games room and secret garden, The Collective Old Oak could easily be mistaken for an exclusive private members’ club. And in many ways, that is exactly what it is.",
    publication: "Property Week",
    logo: logo("property-week"),
  },
  {
    quote: "Residents of The Collective Old Oak are getting more bang for their buck.",
    publication: "The Times",
    logo: logo("the-times"),
  },
  {
    quote: "Its expanding facilities offer a 21st-century alternative to flat-sharing.",
    publication: "The Guardian",
    logo: logo("the-guardian"),
  },
];

const perks = `${img}/perks`;
export const coLivingPerks: Perk[] = [
  {
    name: "Urban Massage",
    text: "On-demand massage services. Select a time, date and treatment and a qualified therapist will be with you within an hour.",
    image: `${perks}/urban-massage.jpg`,
    logo: `${perks}/urban-massage-logo.png`,
  },
  {
    name: "LOVESPACE",
    text: "Self storage without the hassle. Free collection of your items for as long as you need – returned on your request as quickly as the next day.",
    image: `${perks}/lovespace.jpg`,
    logo: `${perks}/lovespace-logo.png`,
  },
  {
    name: "Zipjet",
    text: "Mobile laundry and dry cleaning services. Have your clothes picked up, cleaned and dropped off the same day.",
    image: `${perks}/zipjet.jpg`,
    logo: `${perks}/zipjet-logo.png`,
  },
  {
    name: "Zipcar",
    text: "Car hire made simple. We have Zipcars parked on The Collective Old Oak’s Atlas Road entrance. Wander downstairs and treat yourself to a day trip.",
    image: `${perks}/zipcar.jpg`,
    logo: `${perks}/zipcar-logo.png`,
  },
  {
    name: "Ruuby",
    text: "London’s first digital beauty concierge, offering direct access to the best beauty services at-home and in-salon.",
    image: `${perks}/ruuby.jpg`,
    logo: `${perks}/ruuby-logo.png`,
  },
];

export const coLivingInstagram: CircleImage[] = Array.from({ length: 10 }, (_, i) => ({
  src: `${img}/instagram/${String(i + 1).padStart(2, "0")}.jpg`,
  alt: "Life at The Collective, from our Instagram",
}));

export const coLivingVideo = "https://vimeo.com/261310781";

export const coLivingPromos: PromoCard[] = [
  {
    heading: "Spread the word. Your friends join. You earn.",
    // TODO: stand-in; the design's two-friends photo isn't in the image folder
    image: { src: `${img}/friends.jpg`, alt: "Friends hugging and laughing together" },
    cta: { label: "Refer a friend", href: "#" },
  },
  {
    heading: "Explore Old Oak, the world’s largest co-living building.",
    image: { src: `${img}/old-oak-exterior.jpg`, alt: "The Collective Old Oak building" },
    cta: { label: "Find out more", href: "/locations/old-oak" },
  },
];

const community = `${img}/community`;
// Caption shown under the photo (also its alt text, like the Old Oak gallery)
export const coLivingCommunity: GalleryImage[] = [
  ["01-cabaret-night", "Cabaret night"],
  ["02-swing-dance", "Swing dance class"],
  ["03-cooking-club", "Cooking club"],
  ["04-movie-night", "Movie night"],
  ["05-halloween", "Halloween party"],
  ["06-rooftop-social", "Rooftop social"],
  ["07-fancy-dress", "Fancy dress"],
  ["08-games-night", "Games night"],
  ["09-record-club", "Record club"],
].map(([file, caption]) => ({ src: `${community}/${file}.jpg`, thumb: `${community}/thumbs/${file}.jpg`, alt: caption }));

/** "About Co-living", at the end of each room page. */
export const coLivingAbout = [
  "The Collective has developed a new way of living in cities that focuses on community and convenience. Our members have their own private rooms whilst also sharing beautiful spaces and having access to thought-provoking events, all designed to bring people together.",
  "Everything you need to make the most of city life is included in one convenient payment: rent, concierge, superfast internet, all utilities and taxes, room cleaning, daily events and gym membership.",
  "Don’t just take our word for it, though, come and see it for yourself.",
];
