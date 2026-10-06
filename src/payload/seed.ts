// Seeds Payload with the pages moved out of code (Home, Foundation, Mission, Careers, Press, FAQ), as they were built, so the
// CMS starts with real content. Safe to rerun, including on production: images already uploaded
// are reused, and a page that already exists is left alone, so edits made in the admin are kept.
//
//   npx payload run src/payload/seed.ts
import path from "node:path";
import { getPayload } from "payload";
import * as icons from "@/components/icons";
import type { CircleImage, LinkCard, LocationDetails, PressQuote, PromoCard } from "@/lib/types";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import { careersBenefits } from "@/content/careers";
import { coLivingPress } from "@/content/co-living";
import { venues } from "@/content/events";
import { faqTopics } from "@/content/faq";
import { homeMainLinks, homePress, homeWhatsNew } from "@/content/home";
import { missionLeaders, missionProducts, missionPromos, missionTeamImages, missionValues } from "@/content/mission";
import { oldOakPromos, oldOakTestimonials } from "@/content/old-oak";
import { morePressUrl, pressInfo, pressNews, pressQuotes } from "@/content/press";
import { servicedLocationIncluded, servicedLocationPages } from "@/content/serviced-living";
import { workingLocationPages } from "@/content/working";
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
const promoCards = (cards: PromoCard[]) =>
  Promise.all(cards.map(async (card) => ({ heading: card.heading, image: await photo(card.image), ctaLabel: card.cta.label, ctaHref: card.cta.href, enquiry: card.cta.enquiry })));
const pressQuoteItems = (quotes: PressQuote[]) =>
  Promise.all(quotes.map(async (q) => ({ quote: q.quote, publication: q.publication, logo: q.logo ? await media(q.logo, `${q.publication} logo`) : undefined })));
const faqItems = (items: FaqItem[]) =>
  items.map((item) => ({ question: item.question, answer: [item.answer].flat().join("\n\n"), numbered: item.numbered ?? false }));
const socialLinks = { blockType: "socialLinks", heading: "Connect with us", intro: "Keep up with what we are up to on social media, and get the chance to get promotions!" };

/** Creates a page unless one with this slug exists (its layout, and so its uploads, only then). */
async function seedPage(slug: string, title: string, layout: () => Promise<object[]>) {
  const existing = await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1 });
  if (existing.docs[0]) return console.log(`/${slug}: already exists, left as it is`);
  await payload.create({ collection: "pages", data: { title, slug, layout: await layout() } as never });
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
    video: { label: "Watch video", url: "https://youtu.be/XkZbmXgOWOA" },
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
    people: await Promise.all(oldOakTestimonials.map(async (t) => ({ name: t.name, photo: await photo(t.image), video: t.video }))),
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
    cta: { label: "See our open positions", href: "#open-positions" },
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

await seedPage("home", "Home", home);
await seedPage("foundation", "Foundation", foundation);
await seedPage("mission", "Mission", mission);
await seedPage("careers", "Careers", careers);
await seedPage("press", "Press", press);
await seedPage("faq", "FAQ", faq);

const images = await payload.count({ collection: "media" });
console.log(`${images.totalDocs} images in the Media library.`);
process.exit(0);
