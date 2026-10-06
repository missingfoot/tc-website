import type { ReactNode } from "react";
import CollageSplit from "@/components/sections/CollageSplit";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import PromoCards from "@/components/sections/PromoCards";
import SocialLinks from "@/components/sections/SocialLinks";
import { socialLinks } from "@/content/old-oak";
import { mediaImage, paragraphs } from "@/lib/payload";
import type { Page } from "@/payload-types";

type Block = Page["layout"][number];

const asParagraphs = (text: string): ReactNode => paragraphs(text).map((p) => <p key={p}>{p}</p>);
const button = (cta?: { label?: string | null; href?: string | null } | null) => (cta?.label && cta.href ? { label: cta.label, href: cta.href } : undefined);

/**
 * A Payload page's sections, each block rendered by the section component it was modelled on. An
 * Intro straight after a Hero overlaps it on mobile, as on the hand-built pages.
 */
export default function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) => {
    const key = block.id ?? i;
    switch (block.blockType) {
      case "hero": {
        const image = mediaImage(block.image);
        return (
          <Hero
            key={key}
            title={block.title}
            subtitle={block.subtitle ?? undefined}
            image={image.src}
            imageAlt={image.alt}
            imagePreview={image.blur}
            imagePosition={block.imagePosition ?? undefined}
          />
        );
      }
      case "intro":
        return (
          <Intro key={key} heading={block.heading} layout={block.layout ?? "split"} tone={block.tone ?? "white"} cta={button(block.cta)} raised={blocks[i - 1]?.blockType === "hero"}>
            {asParagraphs(block.body)}
          </Intro>
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
      case "promoCards":
        return (
          <PromoCards
            key={key}
            tone={block.tone ?? "white"}
            cards={(block.cards ?? []).map((card) => ({ heading: card.heading, image: mediaImage(card.image, card.position), cta: { label: card.ctaLabel, href: card.ctaHref } }))}
          />
        );
      case "socialLinks":
        return <SocialLinks key={key} heading={block.heading} intro={block.intro ?? undefined} links={socialLinks} cta={{ label: "Sign up for a newsletter", href: "#" }} />;
      default:
        return null;
    }
  });
}
