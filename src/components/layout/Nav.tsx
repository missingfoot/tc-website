import Link from "next/link";
import { mainNav, type NavLink } from "@/config/navigation";
import Container from "@/components/ui/Container";
import { ChevronDown } from "@/components/icons";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import StickyHeader from "./StickyHeader";

type NavProps = {
  links?: NavLink[];
};

/**
 * Site header. Starts transparent over the top of the page (so the first block should be a
 * dark Hero), then turns white and compact once scrolled.
 */
export default function Nav({ links = mainNav }: NavProps) {
  return (
    <StickyHeader>
      <Container className="flex h-full items-center justify-between">
        <Logo />

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
