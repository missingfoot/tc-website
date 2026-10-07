import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import { PricingSheet } from "../fields/PricingSheet";

/** /admin/pricing: every price on the site in one editable table (PricingSheet), in the admin's frame. */
export function PricingView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Fpricing");
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <PricingSheet />
      </Gutter>
    </DefaultTemplate>
  );
}
