"use client";

import { usePathname } from "next/navigation";
import { pageTitles } from "@/config/navigation";
import { HeaderTitle } from "./StickyHeader";

/** The current page's title for the mobile top bar, looked up from the nav config. */
export default function PageTitle() {
  return <HeaderTitle title={pageTitles[usePathname()]} />;
}
