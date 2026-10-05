import Button from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";
import type { DirectDebit } from "@/lib/account";
import { text } from "@/lib/styles";

const statuses: Record<DirectDebit["status"], { label: string; tone: string; note?: string }> = {
  active: { label: "Active", tone: "bg-sage/20 text-ink" },
  pending: { label: "Setting up", tone: "bg-cream text-ink", note: "Your bank is confirming it, which usually takes a few working days." },
  failed: { label: "Needs attention", tone: "bg-red-100 text-red-900", note: "Your bank couldn’t set this up. Please check your details and try again." },
};

/** The rent Direct Debit in the Billing card: its status and bank, with a button to set up or change it. */
export default function DirectDebitStatus({ directDebit, justUpdated = false }: { directDebit?: DirectDebit; justUpdated?: boolean }) {
  const status = directDebit && statuses[directDebit.status];
  return (
    <div className="mt-6 rounded-2xl border border-ink/10 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={text.label}>Direct Debit</p>
          {directDebit && status ? (
            <p className="mt-1 flex flex-wrap items-center gap-3">
              <span className="font-medium text-ink">
                {directDebit.bank} ••••{directDebit.accountEnding}
              </span>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${status.tone}`}>{status.label}</span>
            </p>
          ) : (
            <p className="mt-1 font-medium text-ink">Not set up yet</p>
          )}
        </div>
        <Button href="/account/direct-debit" variant={directDebit ? "outline" : "dark"} className="w-full justify-center sm:w-auto">
          {directDebit ? "Change bank details" : "Set up Direct Debit"}
        </Button>
      </div>
      {justUpdated && <InfoBox tone="success" className="mt-4">Thanks, your new Direct Debit is set up. Your next rent payment will come from this account.</InfoBox>}
      {status?.note && !justUpdated && <InfoBox className="mt-4">{status.note}</InfoBox>}
    </div>
  );
}
