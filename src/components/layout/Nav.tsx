import type { ReactNode } from "react";
import { mainNav, type NavLink } from "@/config/navigation";
import Container from "@/components/ui/Container";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavDropdown from "./NavDropdown";
import NavItem from "./NavItem";
import PageTitle from "./PageTitle";
import StickyHeader, { HeaderDock } from "./StickyHeader";

type NavProps = {
  links?: NavLink[];
  /**
   * Replaces the links and menu, e.g. a checkout's title and "Secure payment", so people stay on
   * the page. The logo is then shown without a link for the same reason.
   */
  children?: ReactNode;
};

/**
 * Site header: transparent over the top of the page (so the first block should be a dark
 * Hero), then a floating dark pill once scrolled.
 */
export default function Nav({ links = mainNav, children }: NavProps) {
  return (
    <StickyHeader>
      {/* relative + isolate so the dock pill can sit behind the content (-z-10). On mobile the
          content sits further in (max-md:px-9) so it has 24px of room inside the pill. */}
      <Container className="relative isolate flex h-full items-center justify-between max-md:px-9">
        <HeaderDock />
        {children ? (
          <>
            <Logo link={false} />
            {children}
          </>
        ) : (
          <>
            <Logo />
            <PageTitle />

            <nav aria-label="Main">
              <ul className="hidden items-center gap-10 text-base font-medium leading-5 lg:flex">
                {links.map((link) =>
                  link.menu ? (
                    <NavDropdown key={link.label} link={link} />
                  ) : (
                    <NavItem key={link.label} link={link} />
                  ),
                )}
              </ul>
            </nav>

            <MobileMenu />
          </>
        )}
      </Container>
    </StickyHeader>
  );
}
