import Link from "next/link";
import { mainNav, type NavLink } from "@/config/navigation";
import Container from "@/components/ui/Container";
import { ChevronDown } from "@/components/icons";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import PageTitle from "./PageTitle";
import StickyHeader, { HeaderDock } from "./StickyHeader";

type NavProps = {
  links?: NavLink[];
};

/**
 * Site header: transparent over the top of the page (so the first block should be a dark
 * Hero), then a floating dark pill once scrolled.
 */
export default function Nav({ links = mainNav }: NavProps) {
  return (
    <StickyHeader>
      {/* relative + isolate so the dock pill can sit behind the content (-z-10). On mobile the
          content sits further in (max-md:px-9) so it has 24px of room inside the pill. */}
      <Container className="relative isolate flex h-full items-center justify-between max-md:px-9">
        <HeaderDock />
        <Logo />
        <PageTitle />

        <nav aria-label="Main">
          <ul className="hidden items-center gap-10 text-base font-medium leading-5 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="flex items-center gap-0.5 hover:opacity-80">
                  {link.label}
                  {link.dropdown && <ChevronDown />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileMenu />
      </Container>
    </StickyHeader>
  );
}
