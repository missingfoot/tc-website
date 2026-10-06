import LegalDocument from "@/components/sections/LegalDocument";
import { TermsOfUse, termsOfUseUpdated } from "@/content/legal/terms";

export const metadata = { title: "Terms of use" };

export default function Terms() {
  return (
    <LegalDocument title="Terms of use" updated={termsOfUseUpdated}>
      <TermsOfUse />
    </LegalDocument>
  );
}
