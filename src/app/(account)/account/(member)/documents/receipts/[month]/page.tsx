import RentReceipt from "@/components/account/RentReceipt";

export const metadata = { title: "Receipt · Your account" };

/** `month` is the payment's month, e.g. 2026-09. */
export default async function ReceiptPage({ params }: PageProps<"/account/documents/receipts/[month]">) {
  const { month } = await params;
  return <RentReceipt month={month} />;
}
