import { AmexLogo, Lock, MastercardLogo, VisaLogo } from "@/components/icons";

/** "Secure payment" with the accepted cards. Takes the surrounding text colour (white in the checkout header). */
export default function SecurePayment() {
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      <p className="flex items-center gap-2 text-base font-medium">
        <Lock />
        <span className="max-sm:sr-only">Secure payment</span>
      </p>
      <ul aria-label="Accepted cards" className="flex gap-1.5 sm:gap-2">
        <li>
          <VisaLogo className="h-6" />
        </li>
        <li>
          <MastercardLogo className="h-6" />
        </li>
        <li>
          <AmexLogo className="h-6" />
        </li>
      </ul>
    </div>
  );
}
