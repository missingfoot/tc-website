"use client";

import { usePathname } from "next/navigation";
import { HeaderTitle } from "./StickyHeader";

/** The current page's title for the mobile top bar, looked up by path (see `config/page-titles`). */
export default function PageTitle({ titles }: { titles: Record<string, string> }) {
  return <HeaderTitle title={titles[usePathname()]} />;
}
