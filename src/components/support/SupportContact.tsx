import Intro from "@/components/sections/Intro";
import Button from "@/components/ui/Button";
import { site } from "@/config/site";

/** The hub's sign-off: report an issue from your account, or call for anything urgent. */
export default function SupportContact() {
  return (
    <Intro
      layout="stacked"
      heading="Can’t find what you need?"
      action={
        <div className="flex w-full flex-col gap-3 *:justify-center lg:w-auto lg:flex-row">
          <Button href="/account/support/new" variant="dark">
            Report an issue
          </Button>
          <Button href={site.phoneLink} variant="outline">
            Call us
          </Button>
        </div>
      }
    >
      Members can report an issue from their account, and we’ll reply there. For anything urgent, like a leak or a lockout, call us or come to the front desk.
    </Intro>
  );
}
