import LegalDocument from "@/components/sections/LegalDocument";
import { PrivacyNotice, privacyNoticeUpdated } from "@/content/legal/privacy";

export const metadata = { title: "Privacy notice" };

export default function Privacy() {
  return (
    <LegalDocument title="Privacy notice" updated={privacyNoticeUpdated}>
      <PrivacyNotice />
    </LegalDocument>
  );
}
