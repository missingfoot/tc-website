import Link from "next/link";
import Hero from "@/components/sections/Hero";
import Checklist from "@/components/sections/Checklist";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import GetLinkForm from "@/components/referrals/GetLinkForm";
import { referralSteps, rewardRows } from "@/content/referrals";
import { text } from "@/lib/styles";

export const metadata = { title: "Refer a friend" };

export default function ReferAFriend() {
  return (
    <>
      <Hero
        image="/images/referrals/two-friends.jpg"
        imageAlt="Two friends standing together in front of a hedge at night"
        title="Get up to £200 for every friend you refer"
        subtitle="Help us build our community. You get up to £200 for every friend who moves in, and they get up to £200 off their rent."
      />

      <Section raised>
        <Container className="mx-auto max-w-4xl">
          <h2 className={text.subheading}>Get your referral link</h2>
          <p className={`mt-2 ${text.body}`}>Referrals are for members, and there’s no limit, so invite as many friends as you like.</p>
          <div className="mt-8">
            <GetLinkForm />
          </div>
        </Container>
      </Section>

      <Checklist tone="cream" heading="How it works" items={referralSteps} />

      <Section>
        <Container>
          <SectionIntro heading="How much you can earn" intro="You and your friend each get the same amount, depending on how long they move in for." />
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-cream lg:mt-16">
            <table className="w-full text-left text-base">
              <thead>
                <tr className="border-b border-ink/10">
                  <th scope="col" className="p-4 font-medium text-stone lg:p-6">
                    <span className="sr-only">Who’s referring</span>
                  </th>
                  <th scope="col" className="p-4 font-bold text-ink lg:p-6">9+ months</th>
                  <th scope="col" className="p-4 font-bold text-ink lg:p-6">12+ months</th>
                </tr>
              </thead>
              <tbody>
                {rewardRows.map((row) => (
                  <tr key={row.who} className="border-b border-ink/10 last:border-0">
                    <th scope="row" className="p-4 font-medium text-ink lg:p-6">
                      {row.who}
                    </th>
                    <td className="p-4 text-2xl font-bold text-ink lg:p-6">£{row.nine}</td>
                    <td className="p-4 text-2xl font-bold text-ink lg:p-6">£{row.twelve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-8 lg:text-center ${text.body}`}>
            <Link href="/refer-a-friend/terms" className="font-medium text-ink underline underline-offset-4">
              Read the terms and conditions
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
