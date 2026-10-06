import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SignInFlow from "@/components/account/SignInFlow";

export const metadata = { title: "Sign in", robots: { index: false } };

export default async function SignIn({ searchParams }: PageProps<"/account/sign-in">) {
  const { next } = await searchParams;
  // Only send people on to pages in the account (never to another site)
  const safeNext = typeof next === "string" && /^\/account(\/[\w-]*)*$/.test(next) ? next : "/account";
  return (
    <Section tone="cream">
      <Container>
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 lg:p-10">
          <SignInFlow next={safeNext} />
        </div>
      </Container>
    </Section>
  );
}
