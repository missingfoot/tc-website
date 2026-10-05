import Hero from "@/components/sections/Hero";
import FaqDirectory from "@/components/sections/FaqDirectory";
import Intro from "@/components/sections/Intro";
import PromoCards from "@/components/sections/PromoCards";
import Button from "@/components/ui/Button";
import EnquiryButton from "@/components/enquiry/EnquiryButton";
import { site } from "@/config/site";
import { faqTopics } from "@/content/faq";
import { oldOakPromos } from "@/content/old-oak";

export const metadata = { title: "FAQ" };

export default function Faq() {
  return (
    <>
      <Hero
        image="/images/old-oak/gallery/05-reception.jpg"
        imageAlt="The reception at The Collective Old Oak"
        title="Frequently asked questions"
        subtitle="Everything you need to know about living at The Collective."
      />

      <FaqDirectory raised topics={faqTopics} />

      <Intro tone="cream" layout="stacked" heading="Still have a question?" action={<ContactButtons />}>
        Our team is here to help. Give us a call or drop us an email, or book a tour and see it for yourself.
      </Intro>

      <PromoCards cards={oldOakPromos} />
    </>
  );
}

/** Call, email or apply: full width and stacked on mobile, side by side on desktop. */
function ContactButtons() {
  return (
    <div className="flex w-full flex-col gap-3 *:justify-center lg:w-auto lg:flex-row">
      <Button href={site.phoneLink} variant="outline">
        Call us
      </Button>
      <Button href={`mailto:${site.email}`} variant="outline">
        Email us
      </Button>
      <EnquiryButton kind="living" />
    </div>
  );
}
