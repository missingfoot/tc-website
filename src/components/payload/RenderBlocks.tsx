import type { ReactNode } from "react";
import ContactButtons from "@/components/enquiry/ContactButtons";
import * as icons from "@/components/icons";
import { ArrowRight } from "@/components/icons";
import Checklist from "@/components/sections/Checklist";
import CollageSplit from "@/components/sections/CollageSplit";
import Faq from "@/components/sections/Faq";
import FaqDirectory from "@/components/sections/FaqDirectory";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import JobList from "@/components/sections/JobList";
import LinkCards from "@/components/sections/LinkCards";
import MediaKit from "@/components/sections/MediaKit";
import PressQuotes from "@/components/sections/PressQuotes";
import PromoCards from "@/components/sections/PromoCards";
import SocialLinks from "@/components/sections/SocialLinks";
import TeamGrid from "@/components/sections/TeamGrid";
import Testimonials from "@/components/sections/Testimonials";
import Button from "@/components/ui/Button";
import { jobs } from "@/content/careers";
import { socialLinks } from "@/content/old-oak";
import { pressLogos, pressPhotos } from "@/content/press";
import { mediaImage, paragraphs } from "@/lib/payload";
import type { Page } from "@/payload-types";

type Block = Page["layout"][number];

const asParagraphs = (text: string): ReactNode => paragraphs(text).map((p) => <p key={p}>{p}</p>);
const button = (cta?: { label?: string | null; href?: string | null } | null) => (cta?.label && cta.href ? { label: cta.label, href: cta.href } : undefined);
const faqItems = (items?: { question: string; answer: string; numbered?: boolean | null }[] | null) =>
  (items ?? []).map((item) => ({ question: item.question, answer: paragraphs(item.answer), numbered: item.numbered ?? undefined }));

/** A text link with an arrow under a section, e.g. "Read more press articles". Other sites open in a new tab. */
function MoreLink({ label, href }: { label: string; href: string }) {
  const external = /^https?:/.test(href);
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} className="inline-flex items-center gap-2 font-medium text-ink underline underline-offset-4 hover:opacity-70">
      {label}
      <ArrowRight />
    </a>
  );
}

/**
 * A Payload page's sections, each block rendered by the section component it was modelled on. The
 * first section after a Hero overlaps it on mobile (where it can), as on the hand-built pages.
 */
export default function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) => {
    const key = block.id ?? i;
    const raised = blocks[i - 1]?.blockType === "hero";
    switch (block.blockType) {
      case "hero": {
        const image = mediaImage(block.image);
        return (
          <Hero
            key={key}
            eyebrow={block.eyebrow ?? undefined}
            title={block.title}
            subtitle={block.subtitle ?? undefined}
            cta={button(block.cta)}
            video={block.video?.label && block.video.url ? { label: block.video.label, url: block.video.url } : undefined}
            image={image.src}
            imageAlt={image.alt}
            imagePreview={image.blur}
            imagePosition={block.imagePosition ?? undefined}
          />
        );
      }
      case "intro":
        return (
          <Intro
            key={key}
            heading={block.heading}
            layout={block.layout ?? "split"}
            tone={block.tone ?? "white"}
            raised={raised}
            action={block.buttons === "contact" ? <ContactButtons /> : <IntroButton cta={button(block.cta)} dark={block.buttons === "dark"} />}
          >
            {asParagraphs(block.body)}
          </Intro>
        );
      case "checklist":
        return (
          <Checklist
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            items={(block.items ?? []).map((item) => ({ icon: item.icon ? icons[item.icon] : undefined, title: item.title, text: item.text }))}
          />
        );
      case "linkCards":
        return (
          <LinkCards
            key={key}
            heading={block.heading ?? undefined}
            intro={block.intro ?? undefined}
            cardStyle={block.cardStyle ?? "dark"}
            imageShape={block.imageShape ?? "wide"}
            tone={block.tone ?? "white"}
            raised={raised}
            footer={block.moreLink?.label && block.moreLink.href ? <MoreLink label={block.moreLink.label} href={block.moreLink.href} /> : undefined}
            cards={(block.cards ?? []).map((card) => ({ title: card.title, text: card.text, image: mediaImage(card.image, card.position), cta: { label: card.ctaLabel, href: card.ctaHref } }))}
          />
        );
      case "collageSplit":
        return (
          <CollageSplit
            key={key}
            heading={block.heading}
            tone={block.tone ?? "white"}
            side={block.side ?? "left"}
            cta={button(block.cta)}
            images={{ main: mediaImage(block.images.main), top: mediaImage(block.images.top), bottom: mediaImage(block.images.bottom) }}
          >
            {asParagraphs(block.body)}
          </CollageSplit>
        );
      case "pressQuotes":
        return (
          <PressQuotes
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            quotes={(block.quotes ?? []).map((q) => ({ quote: q.quote, publication: q.publication, logo: mediaImage(q.logo).src || undefined }))}
          />
        );
      case "teamGrid":
        return (
          <TeamGrid
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            people={(block.people ?? []).map((person) => ({ name: person.name, role: person.role, image: mediaImage(person.photo, person.position) }))}
          />
        );
      case "testimonials":
        return (
          <Testimonials
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "cream"}
            testimonials={(block.people ?? []).map((person) => ({ name: person.name, image: mediaImage(person.photo), video: person.video ?? undefined }))}
          />
        );
      case "faq":
        return <Faq key={key} heading={block.heading} intro={block.intro ?? undefined} tone={block.tone ?? "white"} items={faqItems(block.items)} />;
      case "faqDirectory":
        return <FaqDirectory key={key} raised={raised} tone={block.tone ?? "white"} topics={(block.topics ?? []).map((t) => ({ topic: t.topic, items: faqItems(t.items) }))} />;
      case "openPositions":
        return <JobList key={key} id="open-positions" heading={block.heading} tone={block.tone ?? "white"} jobs={jobs} />;
      case "mediaKit":
        return <MediaKit key={key} heading={block.heading} intro={block.intro ?? undefined} tone={block.tone ?? "cream"} logos={pressLogos} photoGroups={pressPhotos} />;
      case "promoCards":
        return (
          <PromoCards
            key={key}
            tone={block.tone ?? "white"}
            cards={(block.cards ?? []).map((card) => ({
              heading: card.heading,
              image: mediaImage(card.image, card.position),
              cta: { label: card.ctaLabel, href: card.ctaHref, enquiry: card.enquiry ?? undefined },
            }))}
          />
        );
      case "socialLinks":
        return <SocialLinks key={key} heading={block.heading} intro={block.intro ?? undefined} links={socialLinks} cta={{ label: "Sign up for a newsletter", href: "#" }} />;
      default:
        return null;
    }
  });
}

/** An Intro's button: light (the default) or dark, if it has one. */
function IntroButton({ cta, dark }: { cta?: { label: string; href: string }; dark: boolean }) {
  if (!cta) return null;
  return (
    <Button href={cta.href} variant={dark ? "dark" : "light"} arrow>
      {cta.label}
    </Button>
  );
}
