// Seeds Payload with the pages moved out of code (Foundation, Mission), as they were built, so the
// CMS starts with real content. Safe to rerun, including on production: images already uploaded
// are reused, and a page that already exists is left alone, so edits made in the admin are kept.
//
//   npx payload run src/payload/seed.ts
import path from "node:path";
import { getPayload } from "payload";
import * as icons from "@/components/icons";
import type { CircleImage } from "@/lib/types";
import { coLivingPress } from "@/content/co-living";
import { missionLeaders, missionProducts, missionPromos, missionTeamImages, missionValues } from "@/content/mission";
import config from "../payload.config";

const payload = await getPayload({ config });
const publicDir = path.resolve(process.cwd(), "public");

/**
 * Uploads an image from public/ to the Media library (once), and returns its id. A fine-tuned crop
 * ("50% 30%") becomes the photo's focal point.
 */
async function media(src: string, alt: string, position?: string): Promise<number> {
  const filename = path.basename(src);
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (existing.docs[0]) return existing.docs[0].id;
  const focal = position?.match(/^(\d+)% (\d+)%$/);
  const data = focal ? { alt, focalX: Number(focal[1]), focalY: Number(focal[2]) } : { alt };
  const doc = await payload.create({ collection: "media", data, filePath: path.join(publicDir, src) });
  return doc.id;
}

const photo = (image: CircleImage) => media(image.src, image.alt, image.position);
const iconName = (icon: unknown) => Object.entries(icons).find(([, component]) => component === icon)?.[0] as keyof typeof icons | undefined;

/** Creates a page unless one with this slug exists. */
async function seedPage(slug: string, title: string, layout: object[]) {
  const existing = await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1 });
  if (existing.docs[0]) return console.log(`/${slug}: already exists, left as it is`);
  await payload.create({ collection: "pages", data: { title, slug, layout } as never });
  console.log(`/${slug}: created`);
}

const f = "/images/foundation";
const foundation = [
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

const mission = [
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
    quotes: await Promise.all(
      coLivingPress.map(async (q) => ({ quote: q.quote, publication: q.publication, logo: q.logo ? await media(q.logo, `${q.publication} logo`) : undefined })),
    ),
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
  { blockType: "socialLinks", heading: "Connect with us", intro: "Keep up with what we are up to on social media, and get the chance to get promotions!" },
];

await seedPage("foundation", "Foundation", foundation);
await seedPage("mission", "Mission", mission);

const images = await payload.count({ collection: "media" });
console.log(`${images.totalDocs} images in the Media library.`);
process.exit(0);
