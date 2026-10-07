import LegalDocument from "@/components/sections/LegalDocument";
import { CookieStatement, cookieStatementUpdated } from "@/content/legal/cookies";

export const metadata = { title: "Cookie statement" };

export default function Cookies() {
  return (
    <LegalDocument title="Cookie statement" updated={cookieStatementUpdated}>
      <CookieStatement />
    </LegalDocument>
  );
}
