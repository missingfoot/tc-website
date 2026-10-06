import Hero from "@/components/sections/Hero";
import LinkCards from "@/components/sections/LinkCards";
import Faq from "@/components/sections/Faq";
import PressQuotes from "@/components/sections/PressQuotes";
import MediaKit from "@/components/sections/MediaKit";
import Intro from "@/components/sections/Intro";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";
import { site } from "@/config/site";
import { morePressUrl, pressInfo, pressLogos, pressNews, pressPhotos, pressQuotes } from "@/content/press";

export const metadata = { title: "Press" };

export default function Press() {
  return (
    <>
      <Hero
        image="/images/press-kit/working/the-exchange-1.jpg"
        imageAlt="The Exchange at The Collective Old Oak"
        title="Press"
        subtitle="News, coverage and everything you need to write about The Collective."
      />

      <LinkCards
        raised
        heading="News"
        cards={pressNews}
        cardStyle="dark"
        footer={
          <a href={morePressUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-ink underline underline-offset-4 hover:opacity-70">
            Read more press articles
            <ArrowRight />
          </a>
        }
      />

      <Faq tone="cream" heading="The Collective info" items={pressInfo} />

      <PressQuotes heading="In the press" quotes={pressQuotes} />

      <MediaKit
        heading="Media resources"
        intro="Our logos and photos, free to use when writing about The Collective. Photos download full size."
        logos={pressLogos}
        photoGroups={pressPhotos}
      />

      <Intro layout="stacked" heading="Press enquiries" action={<Button href={`mailto:${site.pressEmail}`} variant="dark" arrow>Email the press team</Button>}>
        For any press enquiries about us, our team, our properties or our programmes, email {site.pressEmail} and we’ll get back to you.
      </Intro>
    </>
  );
}
