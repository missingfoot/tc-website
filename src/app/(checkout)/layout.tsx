import Nav from "@/components/layout/Nav";
import SecurePayment from "@/components/application/SecurePayment";

/**
 * Checkout pages (the room application): the same header, but with only the page's title and
 * "Secure payment" in it, no site links or footer, so people finish what they started.
 */
export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav>
        {/* The title is in the page itself on mobile, where the header has no room for it */}
        <p className="ml-6 hidden border-l border-white/20 pl-6 text-base font-bold lg:block">Room application</p>
        <div className="ml-auto">
          <SecurePayment />
        </div>
      </Nav>
      <main className="flex-1">{children}</main>
    </>
  );
}
