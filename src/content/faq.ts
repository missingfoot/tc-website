import type { FaqTopic } from "@/components/sections/FaqDirectory";

// From the old site's FAQ (all about co-living at Old Oak), grouped by topic and lightly tidied.
// TODO: check against today's offer: prices, the deposit (the room application asks for a holding
// deposit and joining fee instead), room sizes (the room pages say 11.6 / 12 m²), membership
// lengths and the partner perks (Zipcar, Zipjet, Lovespace).
export const faqTopics: FaqTopic[] = [
  {
    topic: "About co-living",
    items: [
      {
        question: "What is co-living?",
        answer:
          "Co-living is a new way of living inspired by the old, with community and shared experiences at its core. It starts with shared spaces like a bar, restaurant, gym, library, laundry, roof terraces and hot desks, and uses them to bring people together: collaborative, fun places that introduce members to new people, ideas and experiences.",
      },
      {
        question: "Who is co-living for?",
        answer:
          "If you’re a native Londoner, it’s your new scene. If you’re new to London, it’s your home away from home. If you’re an entrepreneur, it’s your future network. Co-living is for anyone who values community and convenience and is ready to embrace a new way to live.",
      },
      {
        question: "What kind of shared spaces are there?",
        answer:
          "Three themed dining rooms, a library, a games room, a cinema, the secret garden, a sauna and spa, a roof terrace and the launderette. Every floor has a shared kitchen, and on the ground floor there’s the lobby and The Collective Bar + Kitchen, both great places to hang out or work.",
      },
      { question: "How many private rooms are there?", answer: "There are 546 rooms at The Collective Old Oak, across 10 floors." },
      { question: "Do you accept students and seniors?", answer: "Of course. Students and seniors are very welcome, as long as they share in the community’s values." },
    ],
  },
  {
    topic: "Rooms & prices",
    items: [
      {
        question: "How much does it cost?",
        answer: "Ensuites start from £245 a week and studios from £290. Current prices for each room are on the Old Oak page.",
      },
      {
        question: "What’s the difference between your room types?",
        answer: [
          "Ensuite: a private bathroom, with a kitchenette shared with one other member.",
          "Studio: a private bathroom and your own private kitchenette.",
          "Premium rooms on the top three floors also have views over the city.",
        ],
      },
      {
        question: "What’s included in the price?",
        answer:
          "One monthly bill covers council tax, utilities, wifi, gym access (free membership after a £50 joining fee), room cleaning every two weeks, linen changes, the shared spaces, community events and our 24/7 on-site team.",
      },
      { question: "What size are the rooms?", answer: ["Ensuites: 9.2 m², plus a 5.8 m² shared kitchenette.", "Studios: 12 m²."] },
      { question: "What size is the bed?", answer: "The beds throughout Old Oak are small doubles." },
      { question: "Are there rooms for couples?", answer: "Yes, some of our rooms are available for couples." },
    ],
  },
  {
    topic: "Moving in & payments",
    items: [
      {
        question: "How do I secure my room?",
        answer: [
          "You can apply for your room online from its page. To apply you’ll pay a holding deposit and a one-off joining fee, and there are no hidden fees.",
          "Want to see it first? Book a tour with the Apply now button.",
        ],
      },
      {
        question: "How long can I stay?",
        answer:
          "Our standard memberships are 9 and 12 months, with a limited number of 4 and 6 month memberships. Prices vary with the length of membership; see the Old Oak page for the latest rates.",
      },
      {
        question: "How do I pay my rent?",
        answer:
          "By direct debit on the first of each month, set up when you sign your agreement. If you move in partway through a month, you only pay for the days you’re here.",
      },
      {
        question: "What if I want to leave early?",
        answer: "You can find someone to take over the rest of your licence agreement.",
      },
      {
        question: "Do you accept housing benefit or Jobseeker’s Allowance?",
        answer: "Unfortunately we can’t accept people on housing benefit or Jobseeker’s Allowance.",
      },
    ],
  },
  {
    topic: "Living here",
    items: [
      {
        question: "What events can I expect?",
        answer:
          "Everything from yoga classes, film nights and creative workshops to live music and partner events. Most are free, and they’re a great way to meet people and try something new.",
      },
      {
        question: "Can I host my own event?",
        answer:
          "We’d love you to. There’s a huge range of spaces to use, from the library and secret garden to the games room, cinema and dining rooms.",
      },
      {
        question: "Is my room cleaned and my linen changed?",
        answer:
          "Yes, every two weeks, by a team dedicated to exactly that. You’ll get a schedule so you can plan ahead, and the shared spaces are cleaned every day.",
      },
      { question: "Can I decorate my room?", answer: "Make yourself at home, but please don’t hammer anything into the walls. Any damage comes out of your deposit when you leave." },
      {
        question: "Can friends come to stay?",
        answer: "This is your home, so yes. Friends can stay in your room, and for longer visits we have guest rooms at £60 a night.",
      },
      { question: "Is there a 24/7 concierge?", answer: "Yes, there’s always someone at the front desk to help." },
      {
        question: "Can someone sign for my parcels?",
        answer: "Of course. The front desk team will sign for parcels while you’re out, and you can collect them when you’re back.",
      },
      {
        question: "Am I responsible for changing the lightbulbs?",
        answer: "Nope. Our maintenance team fixes anything from a lightbulb to a chair leg. Just let us know and we’ll sort it.",
      },
    ],
  },
  {
    topic: "Good to know",
    items: [
      {
        question: "Is there a curfew?",
        answer:
          "No curfew, but please be respectful of your neighbours. Quiet hours start at 10pm Sunday to Thursday, and at midnight on Friday and Saturday.",
      },
      { question: "Are pets allowed?", answer: "Unfortunately not." },
      {
        question: "Is there parking?",
        answer: "There’s no parking on site, but members can rent Zipcars, with the first year’s subscription free.",
      },
      {
        question: "Is the laundry free?",
        answer: "The washing machines and dryers take a prepaid card, and our partner Zipjet can handle dry cleaning.",
      },
      { question: "Is there extra storage?", answer: "Yes, through our partner Lovespace, who provide storage for Old Oak members." },
    ],
  },
];
