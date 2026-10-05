import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

/** The main site: full nav and footer. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
