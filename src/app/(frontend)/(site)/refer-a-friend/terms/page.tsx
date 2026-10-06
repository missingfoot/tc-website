import LegalDocument from "@/components/sections/LegalDocument";
import { referralTerms } from "@/content/referrals";

export const metadata = { title: "Referral terms and conditions" };

export default function ReferralTerms() {
  return (
    <LegalDocument title="Referral scheme terms and conditions" back={{ label: "Back to refer a friend", href: "/refer-a-friend" }}>
      {referralTerms.map((section) => [
        <h2 key={section.heading}>{section.heading}</h2>,
        ...(section.paragraphs ?? []).map((p) => <p key={p}>{p}</p>),
        section.points && (
          <ul key={`${section.heading}-points`}>
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ),
      ])}
    </LegalDocument>
  );
}
