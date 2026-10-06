import type { ReactNode } from "react";
import ContactButtons from "@/components/enquiry/ContactButtons";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import * as icons from "@/components/icons";
import { ArrowRight, Icon360 } from "@/components/icons";
import Checklist from "@/components/sections/Checklist";
import CollageSplit from "@/components/sections/CollageSplit";
import Directions from "@/components/sections/Directions";
import DownloadCard from "@/components/sections/DownloadCard";
import Faq from "@/components/sections/Faq";
import FaqDirectory from "@/components/sections/FaqDirectory";
import FeatureGroups from "@/components/sections/FeatureGroups";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import ImageCarousel from "@/components/sections/ImageCarousel";
import Intro from "@/components/sections/Intro";
import JobList from "@/components/sections/JobList";
import LinkCards from "@/components/sections/LinkCards";
import MediaKit from "@/components/sections/MediaKit";
import PerkCards from "@/components/sections/PerkCards";
import PressQuotes from "@/components/sections/PressQuotes";
import PromoCards from "@/components/sections/PromoCards";
import Reviews from "@/components/sections/Reviews";
import RoomCards from "@/components/sections/RoomCards";
import SocialLinks from "@/components/sections/SocialLinks";
import TeamGrid from "@/components/sections/TeamGrid";
import Testimonials from "@/components/sections/Testimonials";
import Button from "@/components/ui/Button";
import FloatingButton from "@/components/ui/FloatingButton";
import { jobs } from "@/content/careers";
import { pressLogos, pressPhotos } from "@/content/press";
import { galleryImage, iconItems, locationCard, mediaImage, paragraphs, roomCard, travelModes } from "@/lib/payload";
import type { Page } from "@/payload-types";

type Block = Page["layout"][number];

const asParagraphs = (text: string): ReactNode => paragraphs(text).map((p) => <p key={p}>{p}</p>);
const button = (cta?: { label?: string | null; href?: string | null } | null) => (cta?.label && cta.href ? { label: cta.label, href: cta.href } : undefined);
const faqItems = (items?: { question: string; answer: string; numbered?: boolean | null }[] | null) =>
  (items ?? []).map((item) => ({ question: item.question, answer: paragraphs(item.answer), numbered: item.numbered ?? undefined }));

/** Hyphenated words kept whole ("co-living" never breaks at its hyphen), as the hand-built headings did. */
const keepHyphenatedWords = (text: string): ReactNode =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));

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
            action={heroButton(block.button)}
            video={block.button?.type === "video" && block.button.label && block.button.videoUrl ? { label: block.button.label, url: block.button.videoUrl } : undefined}
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
            action={
              block.buttons === "contact" ? (
                <ContactButtons />
              ) : block.buttons === "enquiry" && block.enquiry ? (
                <EnquiryButton kind={block.enquiry} variant="light" />
              ) : (
                <IntroButton cta={button(block.cta)} dark={block.buttons === "dark"} />
              )
            }
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
      case "gallery":
        return (
          <Gallery
            key={key}
            heading={block.heading ?? undefined}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "cream"}
            images={(block.photos ?? []).map((photo) => galleryImage(photo.image, photo.name))}
            footer={
              block.tour?.label && block.tour.href ? (
                <Button href={block.tour.href} variant="dark">
                  <Icon360 />
                  {block.tour.label}
                </Button>
              ) : undefined
            }
          />
        );
      case "featureGroups":
        return (
          <FeatureGroups
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            groups={(block.groups ?? []).map((group) => ({ label: group.label ?? undefined, items: iconItems(group.items) }))}
          />
        );
      case "locationCards":
        return (
          <RoomCards
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "cream"}
            ctaLabel={block.ctaLabel ?? undefined}
            rooms={block.locations.filter((l) => typeof l === "object").map(locationCard)}
          />
        );
      case "roomCards":
        return (
          <RoomCards
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "cream"}
            ctaLabel={block.ctaLabel ?? undefined}
            rooms={block.rooms.filter((r) => typeof r === "object").map(roomCard)}
          />
        );
      case "reviews":
        return (
          <Reviews
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            reviews={(block.reviews ?? []).map((review) => ({ name: review.name, rating: review.rating, photo: mediaImage(review.photo).src || undefined, text: paragraphs(review.text) }))}
          />
        );
      case "directions":
        return (
          <Directions
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            modes={travelModes(block.travelModes)}
            mapEmbedUrl={block.mapEmbedUrl}
            place={block.place}
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
            heading={keepHyphenatedWords(block.heading)}
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
      case "faq": {
        const faq = (
          <Faq
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            items={faqItems(block.items)}
            outro={block.outro ?? undefined}
            cta={button(block.cta)}
          />
        );
        // An anchor to link straight to it, clear of the sticky header
        return block.anchor ? (
          <div key={key} id={block.anchor} className="scroll-mt-24">
            {faq}
          </div>
        ) : (
          faq
        );
      }
      case "imageCarousel":
        return (
          <ImageCarousel
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "white"}
            images={(block.photos ?? []).map((photo) => mediaImage(photo.image))}
            footer={
              block.footer?.text || block.footer?.linkLabel ? (
                <>
                  {block.footer.text}{" "}
                  {block.footer.linkLabel && block.footer.linkHref && (
                    <a href={block.footer.linkHref} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
                      {block.footer.linkLabel}
                    </a>
                  )}
                </>
              ) : undefined
            }
          />
        );
      case "perkCards":
        return (
          <PerkCards
            key={key}
            heading={block.heading}
            intro={block.intro ?? undefined}
            tone={block.tone ?? "cream"}
            perks={(block.perks ?? []).map((perk) => {
              const photo = mediaImage(perk.image);
              return { name: perk.name, text: perk.text, image: photo.src, imageBlur: photo.blur, logo: mediaImage(perk.logo).src || undefined };
            })}
          />
        );
      case "faqDirectory":
        return <FaqDirectory key={key} raised={raised} tone={block.tone ?? "white"} topics={(block.topics ?? []).map((t) => ({ topic: t.topic, items: faqItems(t.items) }))} />;
      case "openPositions":
        return <JobList key={key} id="open-positions" heading={block.heading} tone={block.tone ?? "white"} jobs={jobs} />;
      case "mediaKit":
        return <MediaKit key={key} heading={block.heading} intro={block.intro ?? undefined} tone={block.tone ?? "cream"} logos={pressLogos} photoGroups={pressPhotos} />;
      case "downloadCard":
        return (
          <DownloadCard
            key={key}
            heading={block.heading}
            intro={block.intro}
            tone={block.tone ?? "white"}
            file={{ href: block.fileHref, label: block.fileLabel }}
            image={mediaImage(block.image)}
          />
        );
      case "promoCards":
        return (
          <PromoCards
            key={key}
            tone={block.tone ?? "white"}
            mobileShape={block.mobileShape ?? "short"}
            cards={(block.cards ?? []).map((card) => ({
              heading: card.heading,
              image: mediaImage(card.image, card.position),
              cta: { label: card.ctaLabel, href: card.ctaHref, enquiry: card.enquiry ?? undefined },
            }))}
          />
        );
      case "socialLinks":
        return <SocialLinks key={key} heading={block.heading} intro={block.intro ?? undefined} />;
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

/** A Payload page: its sections, and its floating enquiry button if it has one. */
export function RenderPage({ page }: { page: Page }) {
  return (
    <>
      <RenderBlocks blocks={page.layout} />
      {page.floatingEnquiry && (
        <FloatingButton>
          <EnquiryButton kind={page.floatingEnquiry} />
        </FloatingButton>
      )}
    </>
  );
}

/**
 * A hero's button (a video button is the Hero's own): a link, or an enquiry form's, with or without
 * an arrow. Nothing at all without one, as the Hero leaves room for any button it's given.
 */
function heroButton(button?: Extract<Block, { blockType: "hero" }>["button"]) {
  if (button?.type !== "button") return undefined;
  const arrow = button.arrow ?? true;
  if (button.opens === "enquiry")
    return button.enquiry ? <EnquiryButton kind={button.enquiry} variant="light" arrow={arrow} label={button.label ?? undefined} /> : undefined;
  if (!button.label || !button.href) return undefined;
  return (
    <Button href={button.href} arrow={arrow}>
      {button.label}
    </Button>
  );
}
