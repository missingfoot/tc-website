import Link from "next/link";
import { site } from "@/config/site";
import Container from "@/components/ui/Container";
import { getContact, getNavigation } from "@/lib/payload";
import { LogoMark } from "./Logo";

const underlined = "border-b border-white/20 pb-0.5 transition-colors hover:border-white";

/**
 * Site footer: logo and link columns on cream, then contact details, address and legal links
 * on dark. Centred on mobile; columns on desktop. The columns are in the CMS (/admin → Navigation).
 */
export default async function Footer() {
  const [{ footer }, contact] = await Promise.all([getNavigation(), getContact()]);
  return (
    <footer>
      <div className="bg-cream py-12 text-center lg:py-20 lg:text-left">
        <Container>
          <div className="mx-auto grid max-w-224 gap-12 lg:grid-cols-4 lg:gap-8">
            <Link href="/" aria-label={`${site.name} home`} className="mx-auto text-ink lg:mx-0 lg:self-start">
              <LogoMark variant="icon" className="h-14" />
            </Link>
            {footer.map((group) => (
              <nav key={group.label} aria-label={group.label}>
                <h2 className="text-sm font-bold text-stone">{group.label}</h2>
                <ul className="mt-6 flex flex-col gap-5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-lg font-medium text-ink transition-opacity hover:opacity-70">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </Container>
      </div>

      <div className="bg-ink py-12 text-center text-white lg:py-16">
        <Container className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-ash">Contact us</h2>
          <a href={contact.phoneLink} className="mt-6 text-lg font-medium transition-opacity hover:opacity-70">
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className={`mt-4 text-lg font-medium ${underlined}`}>
            {contact.email}
          </a>

          <div className="mt-12 flex flex-col items-center gap-12 lg:mt-14 lg:flex-row lg:gap-12">
            <address className="text-base text-ash not-italic">
              {contact.address.map((line, i) => (
                <span key={line} className="block lg:inline">
                  {line}
                  {i < contact.address.length - 1 && <span className="hidden lg:inline"> </span>}
                </span>
              ))}
            </address>
            <ul className="flex gap-5">
              {site.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-lg font-medium ${underlined}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold text-ash">© {site.name} Ltd.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
