import DetailsPanel from "@/components/account/DetailsPanel";
import { getContact } from "@/lib/payload";

export const metadata = { title: "Your details · Your account" };

export default async function DetailsPage() {
  return <DetailsPanel email={(await getContact()).email} />;
}
