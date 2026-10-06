// Seeds Payload with what moved out of code (pages, locations, rooms, the navigation), as it was
// built, so the CMS starts with real content. Safe to rerun, including on production: images
// already uploaded are reused, and anything that already exists is left alone, so edits made in
// the admin are kept.
//
//   npx payload run src/payload/seed.ts
import path from "node:path";
import { getPayload } from "payload";
import * as icons from "@/components/icons";
import type { CircleImage, GalleryImage, LinkCard, LocationDetails, PressQuote, PromoCard, Room } from "@/lib/types";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import { careersBenefits } from "@/content/careers";
import {
  coLivingCommunity,
  coLivingFaq,
  coLivingGrowImages,
  coLivingIncluded,
  coLivingInstagram,
  coLivingLocations,
  coLivingPerks,
  coLivingPress,
  coLivingPromos,
  coLivingVideo,
} from "@/content/co-living";
import { bedfordVenues, eventsGallery, oldOakVenues, venues } from "@/content/events";
import { footerNav, mainNav, mobileNav } from "@/config/navigation";
import { faqTopics } from "@/content/faq";
import { homeMainLinks, homePress, homeWhatsNew } from "@/content/home";
import { missionLeaders, missionProducts, missionPromos, missionTeamImages, missionValues } from "@/content/mission";
import { oldOakMapEmbed, oldOakTravelModes } from "@/content/directions";
import { oldOakIncluded } from "@/content/included";
import { oldOakBenefitsImages, oldOakCommunityCards, oldOakGallery, oldOakPromos, oldOakReviews, oldOakRoomDetails, oldOakTestimonials } from "@/content/old-oak";
import { morePressUrl, pressInfo, pressNews, pressQuotes } from "@/content/press";
import { servicedGallery, servicedIncluded, servicedLocationIncluded, servicedLocationPages, servicedPromos } from "@/content/serviced-living";
import { workingHowItWorks, workingIncluded, workingLocationPages, workingSpaces } from "@/content/working";
import type { FeatureGroup } from "@/components/sections/FeatureGroups";
import config from "../payload.config";

const payload = await getPayload({ config });
const publicDir = path.resolve(process.cwd(), "public");

/**
 * Uploads an image from public/ to the Media library (once), and returns its id. Uploads are
 * matched by the file they came from (file names repeat across folders); ones seeded before that
 * was recorded, by file name and alt text. A fine-tuned crop ("50% 30%") becomes the photo's focal
 * point.
 */
async function media(src: string, alt: string, position?: string): Promise<number> {
  const bySource = await payload.find({ collection: "media", where: { source: { equals: src } }, limit: 1 });
  if (bySource.docs[0]) return bySource.docs[0].id;
  const legacy = await payload.find({
    collection: "media",
    where: { and: [{ filename: { equals: path.basename(src) } }, { alt: { equals: alt } }, { source: { exists: false } }] },
    limit: 1,
  });
  if (legacy.docs[0]) {
    await payload.update({ collection: "media", id: legacy.docs[0].id, data: { source: src } });
    return legacy.docs[0].id;
  }
  const focal = position?.match(/^(\d+)% (\d+)%$/);
  const data = { alt, source: src, ...(focal && { focalX: Number(focal[1]), focalY: Number(focal[2]) }) };
  const doc = await payload.create({ collection: "media", data, filePath: path.join(publicDir, src) });
  return doc.id;
}

const photo = (image: CircleImage) => media(image.src, image.alt, image.position);
const iconName = (icon: unknown) => Object.entries(icons).find(([, component]) => component === icon)?.[0] as keyof typeof icons | undefined;

// Content-file shapes as block data
const linkCards = (cards: LinkCard[]) =>
  Promise.all(cards.map(async (card) => ({ title: card.title, text: card.text, image: await photo(card.image), ctaLabel: card.cta.label, ctaHref: card.cta.href })));
const testimonials = (people: typeof oldOakTestimonials) => Promise.all(people.map(async (t) => ({ name: t.name, photo: await photo(t.image), video: t.video })));
const promoCards = (cards: PromoCard[]) =>
  Promise.all(cards.map(async (card) => ({ heading: card.heading, image: await photo(card.image), ctaLabel: card.cta.label, ctaHref: card.cta.href, enquiry: card.cta.enquiry })));
const pressQuoteItems = (quotes: PressQuote[]) =>
  Promise.all(quotes.map(async (q) => ({ quote: q.quote, publication: q.publication, logo: q.logo ? await media(q.logo, `${q.publication} logo`) : undefined })));
const faqItems = (items: FaqItem[]) =>
  items.map((item) => ({ question: item.question, answer: [item.answer].flat().join("\n\n"), numbered: item.numbered ?? false }));
const socialLinks = { blockType: "socialLinks", heading: "Connect with us", intro: "Keep up with what we are up to on social media, and get the chance to get promotions!" };

const galleryPhotos = (images: GalleryImage[]) => Promise.all(images.map(async (g) => ({ image: await media(g.src ?? g.thumb, g.alt, g.position), name: g.alt })));
const featureGroups = (groups: FeatureGroup[]) => groups.map((group) => ({ label: group.label, items: group.items.map((item) => ({ label: item.label, icon: iconName(item.icon) })) }));

/** The seeded locations behind these cards (their links end in each location's slug), in order. */
async function locationIds(type: "working" | "serviced" | "venue", cards: Room[]) {
  const { docs } = await payload.find({ collection: "locations", where: { type: { equals: type } }, pagination: false, depth: 0 });
  return cards.map((card) => docs.find((doc) => card.href.endsWith(`/${doc.slug}`))!.id);
}

/** Creates a page unless one with this slug exists (its layout, and so its uploads, only then). */
async function seedPage(slug: string, title: string, layout: () => Promise<object[]>, settings: object = {}) {
  const existing = await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1 });
  if (existing.docs[0]) return console.log(`/${slug}: already exists, left as it is`);
  await payload.create({ collection: "pages", data: { title, slug, layout: await layout(), ...settings } as never });
  console.log(`/${slug}: created`);
}

const f = "/images/foundation";
const foundation = async () => [
  {
    blockType: "hero" as const,
    title: "The Collective Foundation",
    subtitle: "Solving urban problems with a new generation of citizens",
    image: await media(`${f}/accelerator-workshop.jpg`, "Accelerator teams mapping out ideas around a table"),
  },
  {
    blockType: "intro" as const,
    heading: "Overview",
    body: [
      "Cities are evolving faster than ever before, putting stress on persistent problems such as lack of affordable housing and migration in urban areas. Governments and philanthropic ventures are still using old ways to tackle new challenges.",
      "At The Collective Foundation, we envision a world where people come together to confront the most pressing urban issues of our time. We believe that ordinary citizens can do extraordinary things collectively. Imagine if we took risks together, side-by-side and living in one hub. What could our cities look like?",
    ].join("\n\n"),
  },
  {
    blockType: "collageSplit" as const,
    heading: "The Collective Global Accelerator",
    tone: "cream" as const,
    body: [
      "We want to tackle the toughest challenges that people in cities face worldwide. Launching this year, The Collective Global Accelerator (CGA) is designed to support entrepreneurs and innovators from around the world.",
      "Our 4-week immersive programme invites aspiring changemakers to live at The Collective Old Oak and gain access to the mindset, tools and networks they need to grow their social enterprises and make a real difference for people in need.",
    ].join("\n\n"),
    images: {
      main: await media(`${f}/accelerator-workshop.jpg`, "Accelerator teams mapping out ideas around a table"),
      top: await media(`${f}/accelerator-founder.jpg`, "A founder laughing during a conversation"),
      bottom: await media(`${f}/accelerator-cohort.jpg`, "The accelerator cohort together outside The Collective Old Oak"),
    },
  },
  {
    blockType: "collageSplit" as const,
    heading: "The Collective Moonshots Initiative",
    side: "right" as const,
    body: [
      "The Collective Moonshots Initiative is a bi-monthly micro-grant programme that awards £1,000 to innovative teams of Collectivists who come up with an idea for launching a project that contributes positively to the local community.",
      "The Moonshots Initiative taps into the potential of the creative, ambitious and entrepreneurial minds of our communities, and gives them the resources to turn their bold ideas into reality.",
      "More information on this programme will come soon. If you’re interested in applying for a grant, we’d love to hear from you.",
    ].join("\n\n"),
    images: {
      main: await media(`${f}/02-ideas-workshop.jpg`, "Collectivists working through ideas"),
      top: await media(`${f}/01-morning-coffee.jpg`, "A morning coffee stand for the neighbourhood"),
      bottom: await media(`${f}/03-sparklers.jpg`, "Celebrating together"),
    },
    cta: { label: "Get in touch", href: "mailto:hello@thecollective.com?subject=Moonshots" },
  },
  { blockType: "socialLinks" as const, heading: "Connect with us", intro: "Keep up with what we are up to on social media, and get the chance to get promotions!" },
  {
    blockType: "promoCards" as const,
    cards: [
      {
        heading: "Live with us",
        image: await media("/images/press-kit/community/eating-together.jpg", "Residents eating together in a communal lounge"),
        ctaLabel: "Explore co-living",
        ctaHref: "/co-living",
      },
      {
        heading: "Work for us",
        image: await media("/images/careers/team-laptop.jpg", "Team members working through ideas around a table"),
        ctaLabel: "Open positions",
        ctaHref: "/careers#open-positions",
      },
    ],
  },
];

const mission = async () => [
  {
    blockType: "hero",
    title: "Meet The Collective",
    subtitle: "Our mission is simple: to build a world that’s more alive, more together and more collaborative.",
    image: await media("/images/mission/hero-reception.jpg", "A member and one of our team chatting at the front desk"),
  },
  {
    blockType: "intro",
    heading: "We believe people are most alive when they are together",
    layout: "stacked",
    body: "We create better places for people to live, work and play. Our homes and workspaces are designed to inspire and bring people together, unlocking a new lifestyle for the curious and ambitious. We’re fiercely passionate about creating happy, inspired communities who think and live big. Our members live in beautifully designed private spaces and share awesome amenities: think cinemas, gyms, spas, co-working spaces, bars and restaurants.",
  },
  {
    blockType: "checklist",
    heading: "Our values",
    tone: "cream",
    items: missionValues.map((item) => ({ icon: iconName(item.icon), title: item.title, text: item.text })),
  },
  {
    blockType: "linkCards",
    heading: "What we do",
    intro: "We create places for people to live, work and play, designed to help people live happier, fuller lives, learning and growing as part of an engaged community.",
    cardStyle: "dark",
    cards: await Promise.all(missionProducts.map(async (card) => ({ title: card.title, text: card.text, image: await photo(card.image), ctaLabel: card.cta.label, ctaHref: card.cta.href }))),
  },
  {
    blockType: "collageSplit",
    heading: "Together, we’ve got this",
    tone: "cream",
    body: [
      "We’re a young team who want to change the world for our generation and beyond. Our culture is rooted in helping one another grow, because getting where we want to be tomorrow comes down to what we do today.",
      "We are fearless, collaborative and caring, building each other up so we can build great things.",
    ].join("\n\n"),
    images: { main: await photo(missionTeamImages.main), top: await photo(missionTeamImages.top), bottom: await photo(missionTeamImages.bottom) },
  },
  {
    blockType: "pressQuotes",
    heading: "The Collective in the press",
    quotes: await pressQuoteItems(coLivingPress),
  },
  {
    blockType: "teamGrid",
    heading: "Team leaders",
    tone: "cream",
    people: await Promise.all(missionLeaders.map(async (person) => ({ name: person.name, role: person.role, photo: await photo(person.image) }))),
  },
  {
    blockType: "promoCards",
    cards: await Promise.all(missionPromos.map(async (card) => ({ heading: card.heading, image: await photo(card.image), ctaLabel: card.cta.label, ctaHref: card.cta.href }))),
  },
  socialLinks,
];

const home = async () => [
  {
    blockType: "hero",
    eyebrow: "The Collective",
    title: "A new way to live work and play",
    image: await media("/images/old-oak/benefits/shared-dinner.jpg", "Residents sharing dinner around a long table"),
    button: { type: "video", label: "Watch video", videoUrl: "https://youtu.be/XkZbmXgOWOA" },
  },
  {
    blockType: "intro",
    heading: "We're unlocking the world's greatest cities for the creative and ambitious",
    layout: "stacked",
    body: "Our mission is simple: we want to build a world that’s more alive, more together and more collaborative. Our buildings are so much more than just bricks and mortar: they redefine the way people choose to live, work and play by providing unique shared environments that unlock inspiration and make every single day extraordinary. We create places where you can meet new people, try new things, and learn something new every day.",
    cta: { label: "Read more", href: "/mission" },
  },
  { blockType: "linkCards", cardStyle: "dark", cards: await linkCards(homeMainLinks) },
  {
    blockType: "testimonials",
    heading: "Residents love our spaces",
    tone: "cream",
    people: await testimonials(oldOakTestimonials),
  },
  { blockType: "pressQuotes", heading: "The Collective in the Press", quotes: await pressQuoteItems(homePress) },
  { blockType: "linkCards", heading: "What’s New", cardStyle: "light", cards: await linkCards(homeWhatsNew) },
  socialLinks,
  { blockType: "promoCards", cards: await promoCards(oldOakPromos) },
];

const careers = async () => [
  {
    blockType: "hero",
    title: "Help us build a better world, together",
    image: await media("/images/careers/team-laptop.jpg", "Team members working through ideas around a table"),
    button: { type: "button", label: "See our open positions", href: "#open-positions" },
  },
  {
    blockType: "intro",
    heading: "Big ambitions need great people",
    body: [
      "Transforming the way people live, to change the world for the better, doesn’t happen overnight. To make it happen, we need some pretty great people.",
      "Working at The Collective means never settling for what you know. We’re constantly hustling, learning, challenging and pushing the boundaries of what it means to live in a connected world, with a culture of support and ambition that gives our team the confidence to make their big thinking happen.",
      "We’re innovating through uncharted territory, and we’d love to have you along for the ride.",
    ].join("\n\n"),
  },
  {
    blockType: "checklist",
    heading: "Benefits",
    tone: "cream",
    items: careersBenefits.map((item) => ({ icon: iconName(item.icon), title: item.title, text: item.text })),
  },
  { blockType: "openPositions", heading: "Open positions" },
];

const press = async () => [
  {
    blockType: "hero",
    title: "Press",
    subtitle: "News, coverage and everything you need to write about The Collective.",
    image: await media("/images/press-kit/working/the-exchange-1.jpg", "The Exchange at The Collective Old Oak"),
  },
  { blockType: "linkCards", heading: "News", cardStyle: "dark", cards: await linkCards(pressNews), moreLink: { label: "Read more press articles", href: morePressUrl } },
  { blockType: "faq", heading: "The Collective info", tone: "cream", items: faqItems(pressInfo) },
  { blockType: "pressQuotes", heading: "In the press", quotes: await pressQuoteItems(pressQuotes) },
  { blockType: "mediaKit", heading: "Media resources", intro: "Our logos and photos, free to use when writing about The Collective. Photos download full size." },
  {
    blockType: "intro",
    heading: "Press enquiries",
    layout: "stacked",
    body: "For any press enquiries about us, our team, our properties or our programmes, email press@thecollective.com and we’ll get back to you.",
    buttons: "dark",
    cta: { label: "Email the press team", href: "mailto:press@thecollective.com" },
  },
];

const faq = async () => [
  {
    blockType: "hero",
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about living at The Collective.",
    image: await media("/images/old-oak/gallery/05-reception.jpg", "The reception at The Collective Old Oak"),
  },
  { blockType: "faqDirectory", topics: faqTopics.map((t) => ({ topic: t.topic, items: faqItems(t.items) })) },
  {
    blockType: "intro",
    heading: "Still have a question?",
    layout: "stacked",
    tone: "cream",
    body: "Our team is here to help. Give us a call or drop us an email, or book a tour and see it for yourself.",
    buttons: "contact",
  },
  { blockType: "promoCards", cards: await promoCards(oldOakPromos) },
];

/** Creates a location unless one of this type and slug exists. */
async function seedLocation(type: "working" | "serviced" | "venue", location: LocationDetails, included: FeatureGroup[] = []) {
  const existing = await payload.find({ collection: "locations", where: { and: [{ type: { equals: type } }, { slug: { equals: location.slug } }] }, limit: 1 });
  if (existing.docs[0]) return console.log(`${type} ${location.slug}: already exists, left as it is`);
  const iconItems = (items: { icon: unknown; label: string }[]) => items.map((item) => ({ label: item.label, icon: iconName(item.icon) }));
  await payload.create({
    collection: "locations",
    data: {
      type,
      name: location.name,
      slug: location.slug,
      area: location.area,
      postcode: location.postcode,
      fromPrice: location.fromPrice,
      image: await photo(location.image),
      features: iconItems(location.features),
      intro: location.intro.join("\n\n"),
      gallery: await Promise.all(location.gallery.map(async (g) => ({ image: await media(g.src ?? g.thumb, g.alt, g.position), name: g.alt }))),
      prices: location.prices,
      included: included.map((group) => ({ label: group.label, items: iconItems(group.items) })),
      address: location.address,
      directionsIntro: location.directionsIntro,
      travelModes: location.travelModes.map((mode) => ({ ...mode, steps: mode.steps.join("\n") })),
    } as never,
  });
  console.log(`${type} ${location.slug}: created`);
}

// In order: cards follow the order locations were created in (then drag to reorder in the admin)
for (const location of workingLocationPages) await seedLocation("working", location);
for (const location of servicedLocationPages) await seedLocation("serviced", location, servicedLocationIncluded[location.slug]);
for (const venue of venues) await seedLocation("venue", venue, venue.venueFacilities);

const working = async () => [
  {
    blockType: "hero",
    title: "The future of work.",
    subtitle: "Changing the way we view work. Get collaborative and communal with our beautiful and productive working spaces.",
    image: await media("/images/working/hero.jpg", "Members working at long tables in The Den"),
    button: { type: "button", opens: "enquiry", enquiry: "working" },
  },
  {
    blockType: "intro",
    heading: "Work. Connect. Create.",
    body: [
      "When we built The Den we wanted to make the perfect environment for the next generation of creators to turn their ideas into reality.",
      "Our aim is to help every person that enters our space succeed, by providing the space, services, community and support needed to let them focus on the work they love.",
      "We are building London’s leading creative community, so make yourself at home.",
    ].join("\n\n"),
    buttons: "enquiry",
    enquiry: "working",
  },
  {
    blockType: "gallery",
    heading: "Explore the spaces",
    intro: "By combining shared spaces with events and opportunities to connect, our workspaces give you a platform to do your best work and maximise your potential.",
    photos: await galleryPhotos(workingSpaces),
  },
  { blockType: "checklist", heading: "How it works", items: workingHowItWorks.map((item) => ({ icon: iconName(item.icon), title: item.title, text: item.text })) },
  {
    blockType: "locationCards",
    heading: "Our Locations",
    intro: "Each location has its own unique feel, designed to help you do your best work while encouraging you to explore and make connections with other members.",
    locations: await locationIds("working", workingLocationPages.map((l) => ({ href: `/working/${l.slug}` }) as Room)),
    ctaLabel: "More info",
  },
  {
    blockType: "featureGroups",
    heading: "What’s included",
    intro: "All of our locations come with these features as standard, as well as all of their own unique offerings.",
    groups: featureGroups(workingIncluded),
  },
  socialLinks,
  { blockType: "promoCards", cards: await promoCards(oldOakPromos) },
];

const servicedLiving = async () => [
  {
    blockType: "hero",
    title: "Live life without the hassle",
    subtitle: "Beautiful serviced apartments, right in the heart of London’s most iconic locations.",
    image: await media("/images/serviced-living/notting-hill/01-studio.jpg", "A bright Notting Hill studio with a dining table by the window"),
    button: { type: "button", opens: "enquiry", enquiry: "serviced" },
  },
  {
    blockType: "intro",
    heading: "Serviced living at The Collective",
    body: [
      "Serviced living isn’t new, but the way we do it is. Living in your own space shouldn’t mean settling for less than a unique living experience.",
      "Our serviced living houses offer all-inclusive private rooms and apartments in some of London’s most iconic locations, each with shared spaces like a kitchen or garden, so you get the sense of community at the heart of everything we do.",
      "Every room includes one all-inclusive bill, weekly cleaning, linen changes and a concierge service, to make life as easy as possible.",
    ].join("\n\n"),
    buttons: "enquiry",
    enquiry: "serviced",
  },
  {
    blockType: "gallery",
    heading: "Look inside",
    intro: "Serviced living to the highest standards: beautifully furnished, modern private rooms right in the heart of London, with equally beautiful shared spaces.",
    photos: await galleryPhotos(servicedGallery),
  },
  { blockType: "featureGroups", heading: "What’s included", intro: "Every room comes with these as standard, so you can get on with living.", groups: featureGroups(servicedIncluded) },
  {
    blockType: "locationCards",
    heading: "Locations",
    intro: "Each house has its own character and neighbourhood, with everything you need included in one weekly price.",
    locations: await locationIds("serviced", servicedLocationPages.map((l) => ({ href: `/serviced-living/${l.slug}` }) as Room)),
    ctaLabel: "More info",
  },
  { blockType: "promoCards", cards: await promoCards(servicedPromos) },
  socialLinks,
];

const eventSpaces = async () => [
  {
    blockType: "hero",
    title: "Bring people together",
    subtitle: "Inspiring venues in central and west London, for events your guests won’t forget.",
    image: await media("/images/event-spaces/the-exchange/01-lounge.jpg", "The Exchange at Old Oak, set up for an event"),
    button: { type: "button", opens: "enquiry", enquiry: "events" },
  },
  {
    blockType: "intro",
    heading: "Discover our event spaces",
    body: [
      "Nothing brings people together like an event, and you can’t hold an event without the perfect space. That’s why we’ve created inspiring venues designed for sharing ideas and experiences.",
      "Each is unique: from photo shoots, panel discussions and networking to birthdays, supper clubs, conferences and film screenings. With sound systems, lighting and projection, plus bar and catering, your event will leave a lasting impression.",
    ].join("\n\n"),
    buttons: "enquiry",
    enquiry: "events",
  },
  {
    blockType: "locationCards",
    heading: "Bedford Square",
    intro: "Four spaces in a Georgian townhouse in Bloomsbury, a short walk from Tottenham Court Road.",
    locations: await locationIds("venue", bedfordVenues),
    ctaLabel: "See the space",
  },
  { blockType: "gallery", heading: "Look inside", tone: "white", photos: await galleryPhotos(eventsGallery) },
  {
    blockType: "locationCards",
    heading: "Old Oak",
    intro: "Three spaces in our co-living building on the canal at Willesden Junction, from a 200-guest venue to a private dining room.",
    locations: await locationIds("venue", oldOakVenues),
    ctaLabel: "See the space",
  },
  {
    blockType: "downloadCard",
    heading: "Download our brochure",
    intro: "Every venue in one place: floor plans, capacities for each layout, facilities and how to get there. Handy to share with your team.",
    fileLabel: "Download brochure",
    fileHref: "/downloads/the-collective-event-spaces.pdf",
    image: await media("/images/event-spaces/the-gallery/01-dinner.jpg", "The Gallery laid for dinner"),
  },
  socialLinks,
  { blockType: "promoCards", cards: await promoCards(servicedPromos) },
];

const coLiving = async () => [
  {
    blockType: "hero",
    title: "A new way to rent",
    subtitle: "Combining private ensuites with beautiful shared spaces and a host of inspiring events, all included in one monthly bill.",
    image: await media("/images/old-oak/promos/friends-chatting.jpg", "Two residents laughing together in the lounge"),
    button: { type: "video", label: "Watch video", videoUrl: coLivingVideo },
  },
  {
    blockType: "intro",
    heading: "What is co-living?",
    layout: "stacked",
    body: "Co-living is a way of living in cities that is focused on community and convenience. Live as part of a community, sharing wonderfully designed spaces and inspiring events, with the comfort of being able to retreat to your own fully furnished private apartment at the end of the day. Everything you need to make the most of city life is included in one bill, so you can do the living, and leave the rest to us.",
    cta: { label: "Read more", href: "#faq" },
  },
  { blockType: "featureGroups", heading: "What’s included", groups: featureGroups(coLivingIncluded) },
  { blockType: "linkCards", heading: "Locations", cardStyle: "dark", imageShape: "tall", cards: await linkCards(coLivingLocations) },
  { blockType: "testimonials", heading: "See what our members say", tone: "cream", people: await testimonials(oldOakTestimonials) },
  {
    blockType: "gallery",
    tone: "white",
    heading: "Community",
    intro: "Our spaces are nothing without people, and it’s our members that make it a home. You will have endless opportunities to start new and interesting conversations, share ideas and experiences with like-minded individuals, leave your mark and help to build this amazing community.",
    photos: await galleryPhotos(coLivingCommunity),
  },
  {
    blockType: "gallery",
    heading: "Shared spaces",
    intro: "We create beautifully designed spaces that bring people together. Co-living provides the opportunity to do something different every day – whether it’s an exercise class, live music night or life drawing, there’s always a way to have fun and connect with other members.",
    photos: await galleryPhotos(oldOakGallery),
  },
  {
    blockType: "collageSplit",
    heading: "Learn. Develop. Grow.",
    body: [
      "Be a part of something bigger. From workshops and courses to gigs and guest speakers, there’s a way to engage with the community every day of the week.",
      "Create a new club, host a dinner party or plan an event. Share your skills and create an unforgettable experience for the community.",
    ].join("\n\n"),
    images: { main: await photo(coLivingGrowImages.main), top: await photo(coLivingGrowImages.top), bottom: await photo(coLivingGrowImages.bottom) },
  },
  {
    blockType: "imageCarousel",
    heading: "A look inside",
    photos: await Promise.all(coLivingInstagram.map(async (image) => ({ image: await photo(image) }))),
    footer: { text: "See the latest from our community by following us on Instagram", linkLabel: "@thecollective_living", linkHref: "https://www.instagram.com/thecollective_living/" },
  },
  {
    blockType: "perkCards",
    heading: "The little extras",
    intro: "We’ve partnered with a few great brands to help make life that little bit easier. Our members have access to a range of exclusive discounts and offers, from the likes of:",
    perks: await Promise.all(
      coLivingPerks.map(async (perk) => ({
        name: perk.name,
        text: perk.text,
        image: await media(perk.image, perk.name),
        logo: perk.logo ? await media(perk.logo, `${perk.name} logo`) : undefined,
      })),
    ),
  },
  {
    blockType: "faq",
    heading: "Want to know more?",
    items: faqItems(coLivingFaq),
    outro: "Co-living is designed to be the perfect platform for life in the city, focusing on creating beautiful spaces and the greatest possible experiences within them.",
    cta: { label: "Apply now", href: "/apply" },
    anchor: "faq",
  },
  { blockType: "pressQuotes", heading: "In the press", quotes: await pressQuoteItems(coLivingPress) },
  { blockType: "promoCards", mobileShape: "tall", cards: await promoCards(coLivingPromos) },
  socialLinks,
];

/** Creates a room unless one with this slug exists. */
async function seedRoom(room: (typeof oldOakRoomDetails)[number]) {
  const existing = await payload.find({ collection: "rooms", where: { slug: { equals: room.slug } }, limit: 1 });
  if (existing.docs[0]) return console.log(`room ${room.slug}: already exists, left as it is`);
  const [first, ...more] = room.photos;
  await payload.create({
    collection: "rooms",
    data: {
      name: room.name,
      slug: room.slug,
      price: room.price,
      location: room.location,
      image: await media(first.src ?? first.thumb, first.alt, first.position),
      features: room.features.map((item) => ({ label: item.label, icon: iconName(item.icon) })),
      about: room.about.join("\n\n"),
      photos: await galleryPhotos(more),
      floorPlan: room.floorPlan ? await photo(room.floorPlan) : undefined,
      moveIn: room.booking.moveIn,
      floor: room.booking.floor,
      periods: room.booking.periods.join("\n"),
    } as never,
  });
  console.log(`room ${room.slug}: created`);
}

for (const room of oldOakRoomDetails) await seedRoom(room);

const oldOak = async () => [
  {
    blockType: "hero",
    eyebrow: "North London",
    title: "Old Oak",
    subtitle: "Live somewhere that's home, and so much more.",
    image: await media("/images/hero-cover-old-oak.jpg", "The Collective Old Oak lounge"),
    button: { type: "button", opens: "enquiry", enquiry: "living" },
  },
  {
    blockType: "intro",
    heading: "Co-living at Old Oak",
    body: "More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses shared spaces and facilities to create a more fulfilling lifestyle. Home to over 500 people from all walks of life, all our members share a curious mind and a desire to live their life in a more connected way with the people around them.",
    buttons: "enquiry",
    enquiry: "living",
  },
  {
    blockType: "gallery",
    heading: "Explore the spaces",
    intro: "Co-living is a living experience that's bold, exciting and unique. By combining shared spaces with events and opportunities to connect, collective living provides a platform for you to maximise your potential.",
    photos: await galleryPhotos(oldOakGallery),
    // TODO: link target for the 3D tour
    tour: { label: "View 3D Tour", href: "#" },
  },
  {
    blockType: "collageSplit",
    heading: "The benefits of co-living",
    body: [
      "We know that one of the most daunting things about moving is feeling isolated or alone. Whether you're new to the city, trying to meet new people, starting a business or building your career, co-living at Old Oak helps you to feel part of something bigger. Old Oak is a place fuelled by experiences. Our diverse group of members creates the perfect environment for you to immerse yourself and discover something new every single day.",
      "Whether it's in your private apartment, or in one of our more quiet shared spaces like the library or spa, Old Oak provides ample space for you to take a bit of much needed time out. The age-old 'work hard, play harder' is realized at Old Oak. With a games room, cinema room, multiple restaurants and bars, and a roof garden, there's more than enough to keep even the most active busy.",
    ].join("\n\n"),
    images: { main: await photo(oldOakBenefitsImages.main), top: await photo(oldOakBenefitsImages.top), bottom: await photo(oldOakBenefitsImages.bottom) },
  },
  { blockType: "promoCards", cards: await promoCards(oldOakCommunityCards) },
  {
    blockType: "roomCards",
    heading: "Explore the rooms",
    intro: "Each room in Old Oak has unique co-living feel that is designed to make you feel at home but not keep you in your room where you are encouraged to explore and make connections with other members.",
    rooms: (await payload.find({ collection: "rooms", sort: "_order", pagination: false, depth: 0 })).docs.map((room) => room.id),
  },
  {
    blockType: "featureGroups",
    heading: "What’s included",
    intro: "More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses shared spaces and facilities to create a more fulfilling lifestyle.",
    groups: featureGroups(oldOakIncluded),
  },
  {
    blockType: "testimonials",
    heading: "Residents love our spaces",
    intro: "More than just bricks and mortar, The Collective Old Oak is a vibrant community that uses shared spaces and facilities to create a more fulfilling lifestyle.",
    tone: "cream",
    people: await testimonials(oldOakTestimonials),
  },
  {
    blockType: "reviews",
    heading: "Rated 5 stars",
    intro: "What residents and guests say about staying with us.",
    reviews: await Promise.all(
      oldOakReviews.map(async (review) => ({
        name: review.name,
        rating: review.rating,
        photo: review.photo ? await media(review.photo, review.name) : undefined,
        text: review.text.join("\n\n"),
      })),
    ),
  },
  {
    blockType: "directions",
    heading: "Well connected",
    intro: "Situated on the banks of the canal in Willesden Junction, Old Oak is perfectly positioned to access London, with both tube and rail connections close by.",
    travelModes: oldOakTravelModes.map((mode) => ({ ...mode, steps: mode.steps.join("\n") })),
    mapEmbedUrl: oldOakMapEmbed,
    place: "Old Oak",
  },
  socialLinks,
  { blockType: "promoCards", cards: await promoCards(oldOakPromos) },
];

await seedPage("home", "Home", home);
await seedPage("foundation", "Foundation", foundation);
await seedPage("mission", "Mission", mission);
await seedPage("careers", "Careers", careers);
await seedPage("press", "Press", press);
await seedPage("faq", "FAQ", faq);
await seedPage("working", "Working", working, { floatingEnquiry: "working" });
await seedPage("serviced-living", "Serviced Living", servicedLiving, { floatingEnquiry: "serviced" });
await seedPage("event-spaces", "Event Spaces", eventSpaces, { floatingEnquiry: "events" });
await seedPage("co-living", "Co-Living", coLiving);
await seedPage("old-oak", "Old Oak", oldOak, { floatingEnquiry: "living" });

const images = await payload.count({ collection: "media" });
console.log(`${images.totalDocs} images in the Media library.`);
// The navigation, from config/navigation.ts, unless it's been set up in the admin already
const nav = await payload.findGlobal({ slug: "navigation", depth: 0 });
if (nav.menu?.length || nav.desktop?.length || nav.footer?.length) console.log("navigation: already set up, left as it is");
else {
  const links = (items: { label: string; href: string }[]) => items.map(({ label, href }) => ({ label, href, show: true }));
  await payload.updateGlobal({
    slug: "navigation",
    data: {
      menu: mobileNav.map((group) => ({
        heading: group.label,
        items: group.items.map((item) => ({ label: item.label, href: item.href, show: true, subLinks: links(item.children ?? []) })),
      })),
      desktop: mainNav.map((item) =>
        !item.menu
          ? { label: item.label, opens: "link" as const, href: item.href, show: true }
          : // A dropdown of headed sections is the menu's (More); one without headings, its own links
            item.menu.some((group) => group.label)
            ? { label: item.label, opens: "menu" as const, show: true }
            : { label: item.label, opens: "dropdown" as const, subLinks: links(item.menu.flatMap((group) => group.items)), show: true },
      ),
      footer: footerNav.map((column) => ({ heading: column.label!, links: links(column.items), show: true })),
    },
  });
  console.log("navigation: created");
}

process.exit(0);
