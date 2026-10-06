import Nav from "@/components/layout/Nav";
import AccountHeader from "@/components/account/AccountHeader";

/** The members' account: the site header with the account's own links in place of the menu, and no footer. */
export default function AccountLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav logoLinksHome>
        <AccountHeader />
      </Nav>
      <main className="flex-1 bg-cream">
        {/* Dark band behind the header, which is white and transparent at the top of the page */}
        <div aria-hidden="true" className="h-24 bg-ink" />
        {children}
      </main>
    </>
  );
}
