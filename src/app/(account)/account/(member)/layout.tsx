import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import AccountShell from "@/components/account/AccountShell";

export const metadata = { robots: { index: false } };

/** Every signed-in account page: greeting, tabs and the renewal reminder around the tab's content. */
export default function MemberLayout({ children }: LayoutProps<"/account">) {
  return (
    <Section tone="cream">
      <Container>
        <AccountShell>{children}</AccountShell>
      </Container>
    </Section>
  );
}
