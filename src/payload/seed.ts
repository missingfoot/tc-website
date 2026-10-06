// Seeds Payload with the Foundation page, as it was built in code, so the proof of concept starts
// with real content. Safe to rerun: images already uploaded are reused, and the page is replaced.
//
//   npx payload run src/payload/seed.ts
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";

const payload = await getPayload({ config });
const publicDir = path.resolve(process.cwd(), "public");

/** Uploads an image from public/ to the Media library (once), and returns its id. */
async function media(src: string, alt: string): Promise<number> {
  const filename = path.basename(src);
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (existing.docs[0]) return existing.docs[0].id;
  const doc = await payload.create({ collection: "media", data: { alt }, filePath: path.join(publicDir, src) });
  return doc.id;
}

const f = "/images/foundation";
const layout = [
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

const existing = await payload.find({ collection: "pages", where: { slug: { equals: "foundation" } }, limit: 1 });
if (existing.docs[0]) await payload.update({ collection: "pages", id: existing.docs[0].id, data: { title: "Foundation", layout } });
else await payload.create({ collection: "pages", data: { title: "Foundation", slug: "foundation", layout } });

const images = await payload.count({ collection: "media" });
console.log(`Seeded the Foundation page (${images.totalDocs} images in the Media library).`);
process.exit(0);
