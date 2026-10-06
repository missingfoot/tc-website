import type { Cta } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getContact } from "@/lib/payload";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Facebook, Instagram, Mail, Twitter, YouTube } from "@/components/icons";
import { pressable } from "@/lib/styles";

const PLATFORM_ICONS = { youtube: YouTube, twitter: Twitter, facebook: Facebook, instagram: Instagram, email: Mail };

export type SocialLink = { platform: keyof typeof PLATFORM_ICONS; label: string; href: string };

type SocialLinksProps = {
  /** Section background (default cream). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  links: SocialLink[];
  cta?: Cta;
};

/**
 * Heading and intro, a row of square social icon links and a call-to-action button.
 * Centred on desktop; on mobile the icons spread across the width and the button is full width.
 */
export default async function SocialLinks({ heading, intro, links, cta, tone = "cream" }: SocialLinksProps) {
  // The email link goes to the CMS's Contact details email
  const { email } = await getContact();
  return (
    <Section tone={tone}>
      <Container className="flex flex-col items-start lg:items-center">
        <SectionIntro heading={heading} intro={intro} />

        <ul className="mt-10 flex w-full justify-between gap-4 lg:w-auto lg:justify-center">
          {links.map(({ platform, label, href: link }) => {
            const href = platform === "email" ? `mailto:${email}` : link;
            const PlatformIcon = PLATFORM_ICONS[platform];
            const external = !href.startsWith("mailto:");
            return (
              <li key={platform}>
                <a
                  href={href}
                  aria-label={label}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  // Same hover as the white Button variant
                  className={`flex size-14 items-center justify-center rounded-xl bg-white text-ink hover:bg-cream-dark ${pressable}`}
                >
                  <PlatformIcon />
                </a>
              </li>
            );
          })}
        </ul>

        {cta && (
          <Button href={cta.href} variant="dark" arrow className="mt-10 w-full justify-center lg:w-auto">
            {cta.label}
          </Button>
        )}
      </Container>
    </Section>
  );
}
