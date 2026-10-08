import type { ComponentType } from "react";
import { Bed, Book, Building, CalendarCheck, IdCard, Lifebuoy, LocationPin, People, Phone, SprayBottle, Tag, Wrench } from "@/components/icons";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import type { TicketCategory } from "@/lib/account";

type Icon = ComponentType<{ className?: string }>;

/** What a member can report an issue about (the help desk's queues). */
export const ticketCategories: Record<TicketCategory, { label: string; icon: Icon; description: string; prompt: string }> = {
  maintenance: {
    label: "Maintenance",
    icon: Wrench,
    description: "Something broken, leaking or not working",
    prompt: "Tell us what’s wrong and where, e.g. the shower in your bathroom. If you’re out when we visit, the team will let themselves in and leave a card.",
  },
  housekeeping: {
    label: "Housekeeping",
    icon: SprayBottle,
    description: "Cleaning, linen and the shared spaces",
    prompt: "A missed clean, fresh linen or towels, or a shared space that needs attention: let us know what and where.",
  },
  general: {
    label: "General support",
    icon: Lifebuoy,
    description: "Your membership, post, guests or anything else",
    prompt: "Ask us anything: your membership, post and parcels, guests, events or something else entirely.",
  },
};

export type HelpTopic = { slug: string; title: string; icon: Icon; articles: FaqItem[] };

// The Member Support Hub: guides for living at Old Oak, from the old member help desk's topics.
// TODO: check against the house rules and current partners before launch.
export const helpTopics: HelpTopic[] = [
  {
    slug: "community-guidelines",
    title: "Community guidelines",
    icon: Book,
    articles: [
      {
        question: "What is co-living?",
        answer:
          "A new way of living inspired by the old, with community and shared experiences at its core. Your room is your own; the bar, restaurant, gym, library, laundry, roof terraces and hot desks are shared, and they’re where you’ll meet everyone else.",
      },
      {
        question: "Using The Collective help desk",
        answer: [
          "Report an issue from Support in your account: choose Maintenance, Housekeeping or General support and tell us what’s up. You’ll get a reference number, and our replies show up in your tickets.",
          "For anything urgent, like a leak or being locked out, call us or come to the front desk instead.",
        ],
      },
      {
        question: "House rules",
        answer: [
          "Treat the building and each other with respect. Shared spaces are for everyone, so tidy up after yourself and leave them as you’d like to find them.",
          "No smoking anywhere inside, no pets, and nothing hammered into the walls.",
        ],
      },
      {
        question: "Quiet hours",
        answer: "There’s no curfew, but quiet hours start at 10pm Sunday to Thursday, and at midnight on Friday and Saturday.",
      },
      {
        question: "Having guests",
        answer:
          "Friends are welcome to visit and stay in your room: sign them in at the front desk when they arrive. For longer visits, our guest rooms are £60 a night.",
      },
    ],
  },
  {
    slug: "old-oak-team",
    title: "Old Oak team",
    icon: People,
    articles: [
      {
        question: "The Old Oak team",
        answer:
          "Our front desk, community, housekeeping and maintenance teams all work on site. There’s someone at the front desk 24 hours a day, so come and say hello.",
      },
      {
        question: "The Collective Ambassador Programme",
        answer:
          "Ambassadors are members who help shape life in the building: hosting events, welcoming new members and feeding back ideas. Ask the community team if you’d like to get involved.",
      },
    ],
  },
  {
    slug: "my-membership",
    title: "My membership",
    icon: IdCard,
    articles: [
      {
        question: "The app",
        answer: "The Collective app is where you’ll find events, book shared spaces and chat to other members. Download it from the App Store or Google Play and sign in with your account email.",
      },
      {
        question: "Receiving mail and parcels",
        answer: "The front desk signs for parcels while you’re out and lets you know when one arrives. Collect it with your member card any time.",
      },
      {
        question: "Postal address",
        answer: "Your postal address is in Membership in your account. Always include your room number, so your post gets to you quickly.",
      },
      {
        question: "Paying your rent",
        answer: "Rent is collected by Direct Debit on the 1st of each month. You can check or change your bank details under Billing in Membership.",
      },
      {
        question: "Renewing or moving out",
        answer: "Let us know before your renew-by date, under Renewal in your account. You can see the date there, along with your renewal options.",
      },
    ],
  },
  {
    slug: "the-building",
    title: "The building",
    icon: Building,
    articles: [
      {
        question: "Fire alarm and procedure",
        answer: [
          "If the alarm sounds, leave by the nearest stairs (never the lifts) and go to the assembly point outside the main entrance. Don’t stop to collect belongings.",
          "The alarm is tested every Monday at 11:00; a short ring then is nothing to worry about.",
        ],
      },
      {
        question: "Map of the building",
        answer: "The lobby, bar and kitchen are on the ground floor, every floor has a shared kitchen, and the library, games room, cinema, spa and roof terrace are signposted from the lifts. Ask the front desk for a printed map.",
      },
      {
        question: "Old Oak front desk",
        answer: "The front desk is staffed 24/7, in the lobby. They can help with parcels, guests, lost keys and anything else.",
      },
      {
        question: "Laundry",
        answer: "The launderette’s washing machines and dryers take a prepaid card, which you can top up at the front desk.",
      },
    ],
  },
  {
    slug: "my-room",
    title: "My room",
    icon: Bed,
    articles: [
      {
        question: "Cleaning and linen",
        answer: "Your room is cleaned and your linen changed every two weeks. You’ll get a schedule so you can plan ahead; if a clean is missed, report it under Housekeeping.",
      },
      {
        question: "Accessing your room for emergencies or maintenance",
        answer:
          "In an emergency the team can enter your room at any time. For maintenance we’ll let you know when we’re coming, and if you’re out we’ll leave a card to say we’ve been.",
      },
      {
        question: "Your kitchenette",
        answer: "Studios have their own kitchenette; ensuites share one with one other member. Please keep it clean and don’t leave food out, and report anything broken under Maintenance.",
      },
      {
        question: "Decorating your room",
        answer: "Make yourself at home, but please don’t hammer anything into the walls. Any damage comes out of your deposit when you leave.",
      },
      {
        question: "Locked out?",
        answer: "Come to the front desk with photo ID and they’ll let you in, day or night.",
      },
    ],
  },
  {
    slug: "events",
    title: "Events",
    icon: CalendarCheck,
    articles: [
      {
        question: "What kind of events do you host?",
        answer: "Everything from yoga classes, film nights and creative workshops to live music and partner events. Most are free; see what’s on in the app.",
      },
      {
        question: "How do I host my own event?",
        answer: "We’d love you to. Tell the community team what you have in mind, at least two weeks ahead, and they’ll help you find a space and spread the word.",
      },
      {
        question: "Guidelines for hosting an event",
        answer: "Events are open to all members, finish by quiet hours and leave the space as you found it. Anything with outside guests, alcohol or ticket sales needs the community team’s OK first.",
      },
    ],
  },
  {
    slug: "around-old-oak",
    title: "Around Old Oak",
    icon: LocationPin,
    articles: [
      {
        question: "Doctor",
        answer: "Register with a local GP practice as soon as you move in; the front desk can tell you which practices cover Old Oak. For urgent advice any time, call NHS 111.",
      },
      {
        question: "Dentist",
        answer: "Find NHS dentists taking new patients near you on the NHS website. In a dental emergency out of hours, call NHS 111.",
      },
      {
        question: "Community map for eating, drinking and doing",
        answer: "Members’ favourite places nearby, from coffee to climbing, are on the community map in the app. Add your own!",
      },
    ],
  },
  {
    slug: "perks-and-partnerships",
    title: "Perks & partnerships",
    icon: Tag,
    articles: [
      { question: "Zipjet", answer: "Our partner Zipjet collects and delivers dry cleaning and laundry. Book in the Zipjet app." },
      { question: "Zipcar", answer: "There’s no parking on site, but members can rent Zipcars nearby, with the first year’s subscription free." },
      { question: "Lovespace", answer: "Need more room? Lovespace collect, store and return your things, with a discount for members." },
    ],
  },
  {
    slug: "contacting-us",
    title: "Contacting us",
    icon: Phone,
    articles: [
      {
        question: "Logging a maintenance request",
        answer: "Go to Support in your account, choose Report an issue, then Maintenance. Tell us what’s wrong and where, and we’ll reply in your tickets.",
      },
      {
        question: "Logging a general request",
        answer: "Go to Support in your account, choose Report an issue, then General support.",
      },
      {
        question: "Lost property",
        answer: "Lost something in the building? Ask at the front desk, where anything handed in is kept for 30 days.",
      },
      {
        question: "Urgent problems",
        answer: "For leaks, lockouts or anything that can’t wait, call us or come to the front desk, which is open 24/7.",
      },
    ],
  },
];
