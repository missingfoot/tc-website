import type { ReactNode } from "react";
import type { NavLink } from "@/config/navigation";
import { getPageTitles } from "@/config/page-titles";
import { getNavigation } from "@/lib/payload";
import Container from "@/components/ui/Container";
import AccountButton from "./AccountButton";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavDropdown from "./NavDropdown";
import NavItem from "./NavItem";
import PageTitle from "./PageTitle";
import StickyHeader, { HeaderDock } from "./StickyHeader";

type NavProps = {
  /** In place of the desktop bar's links from the CMS (/admin → Navigation). */
  links?: NavLink[];
  /**
   * Replaces the links and menu, e.g. a checkout's title and "Secure payment", so people stay on
   * the page. The logo is then shown without a link for the same reason, unless `logoLinksHome`.
   */
  children?: ReactNode;
  logoLinksHome?: boolean;
};

/**
 * Site header: transparent over the top of the page (so the first block should be a dark
 * Hero), then a floating dark pill once scrolled.
 */
export default async function Nav({ links, children, logoLinksHome = false }: NavProps) {
  const nav = await getNavigation();
  const desktop = links ?? nav.desktop;
  return (
    <StickyHeader>
      {/* relative + isolate so the dock pill can sit behind the content (-z-10). On mobile the
          content sits further in (max-md:px-9) so it has 24px of room inside the pill. */}
      <Container className="relative isolate flex h-full items-center justify-between max-md:px-9">
        <HeaderDock />
        {children ? (
          <>
            <Logo link={logoLinksHome} />
            {children}
          </>
        ) : (
          <>
            <Logo />
            <PageTitle titles={await getPageTitles()} />

            <nav aria-label="Main">
              <ul className="hidden items-center gap-10 text-base font-medium leading-5 lg:flex">
                {desktop.map((link) =>
                  link.menu ? (
                    <NavDropdown key={link.label} link={link} />
                  ) : (
                    <NavItem key={link.label} link={link} />
                  ),
                )}
                {/* -mr-3: the dock pill runs 24px past the content, so this leaves the same 12px gap on the
                    right as above and below the 40px button in the 64px pill */}
                <li className="-mr-3">
                  <AccountButton compact />
                </li>
              </ul>
            </nav>

            <MobileMenu groups={nav.menu} />
          </>
        )}
      </Container>
    </StickyHeader>
  );
}
