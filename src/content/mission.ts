import { Crowd, Handshake, Lion, Scales, Sprout } from "@/components/icons";
import type { ChecklistItem } from "@/components/sections/Checklist";
import type { CircleImage, LinkCard, Person, PromoCard } from "@/lib/types";

const img = "/images/mission";

export const missionValues: ChecklistItem[] = [
  { icon: Lion, title: "Fearless", text: "We are pioneers who think big, embrace uncertainty and will relentlessly hustle to make the impossible happen." },
  { icon: Scales, title: "Balance", text: "We find balance and happiness in work and play so you can give your heart and soul to both. Ultimately, we’re all here to be happy." },
  { icon: Sprout, title: "Grow", text: "We never settle for the status quo; always listening, understanding and evolving so that we can deliver with belief and excellence." },
  { icon: Handshake, title: "Respect", text: "We believe respect is given and earned through being authentic, humble, trustworthy and great at what you do." },
  { icon: Crowd, title: "Community", text: "We are obsessive about human connection, whether it’s building lasting relationships or engaging and giving back to our communities." },
];

export const missionProducts: LinkCard[] = [
  {
    title: "Co-Living",
    text: "A new take on an old theme, co-living invites you to be part of something bigger by living in a more connected way with the people around you. Live as part of a community, sharing beautiful spaces and daily events, with your own private apartment.",
    image: { src: "/images/co-living/community/03-cooking-club.jpg", alt: "Residents cooking together at a cooking club" },
    cta: { label: "Find out more", href: "/co-living" },
  },
  {
    title: "Working",
    text: "It’s all about the environment when you’re working on your next big thing. Our workspaces are designed for collaboration and innovation: places where people, ideas and ambitions come together to make something amazing.",
    image: { src: `${img}/working.jpg`, alt: "Two members working together at a table" },
    cta: { label: "Find out more", href: "/working" },
  },
  {
    title: "Event Spaces",
    text: "Nothing brings people together like an event, and you can’t hold an event without the perfect space. That’s why we’ve created inspiring venues designed for sharing ideas and experiences.",
    image: { src: `${img}/event-space.jpg`, alt: "A long table laid for dinner in one of our event spaces" },
    cta: { label: "Find out more", href: "/event-spaces" },
  },
  {
    title: "Serviced Living",
    text: "Modern serviced apartments, studios and rooms in some of London’s most iconic locations, combining beautifully furnished private rooms with communal spaces for a unique sense of community and luxury.",
    image: { src: `${img}/serviced-living.jpg`, alt: "A furnished serviced living bedroom" },
    cta: { label: "Find out more", href: "/serviced-living" },
  },
];

export const missionTeamImages: { main: CircleImage; top: CircleImage; bottom: CircleImage } = {
  main: { src: `${img}/team-retreat.jpg`, alt: "The Collective team together on a company retreat" },
  top: { src: `${img}/christmas-party.jpg`, alt: "Three of the team at the Christmas party" },
  bottom: { src: `${img}/reza-speaking.jpg`, alt: "Reza Merchant, founder and CEO, speaking", position: "50% 30%" },
};

export const missionLeaders: Person[] = [
  ["Reza Merchant", "Founder & CEO", "reza"],
  ["Jai Madhvani", "Finance Director", "jai"],
  ["Jon Taylor", "Customer Director", "jon"],
  ["Vineet Kalra", "Group Operations Director", "vineet"],
  ["Jill Ju", "Investment Director", "jill"],
  ["Irina Listovskaya", "Product Director", "irina"],
].map(([name, role, file]) => ({ name, role, image: { src: `${img}/team/${file}.jpg`, alt: `${name}, ${role}` } }));

export const missionPromos: PromoCard[] = [
  {
    heading: "Co-living at Old Oak",
    image: { src: "/images/co-living/old-oak-exterior.jpg", alt: "The Collective Old Oak building" },
    cta: { label: "Explore Old Oak", href: "/locations/old-oak" },
  },
  {
    heading: "Discover Serviced Living",
    image: { src: `${img}/serviced-living.jpg`, alt: "A furnished serviced living bedroom" },
    cta: { label: "Explore now", href: "/serviced-living" },
  },
];
