"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Ban, Car, Clock, People, Sofa, SprayBottle, TeamChat, Wrench } from "@/components/icons";
import { site } from "@/config/site";
import { houseInfo, type HouseInfo } from "@/content/good-to-know";
import { useAccount } from "@/lib/account";
import { text } from "@/lib/styles";
import AccountCard from "./AccountCard";
import PostalAddressCard from "./PostalAddressCard";
import WifiCard from "./WifiCard";

const icons: Record<HouseInfo["icon"], ComponentType<{ className?: string }>> = {
  desk: TeamChat,
  cleaning: SprayBottle,
  guests: People,
  quiet: Clock,
  repairs: Wrench,
  decorating: Sofa,
  parking: Car,
  pets: Ban,
};

/** Good to know tab: the things members look up now and then (address, Wi-Fi, house info). */
export default function InfoPanel() {
  const account = useAccount()?.account;
  if (!account) return null;
  const m = account.membership;

  return (
    <>
      {m && <PostalAddressCard m={m} />}
      <WifiCard account={account} />

      <AccountCard heading="Living here">
        <ul className="grid gap-6 sm:grid-cols-2">
          {houseInfo.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-ink">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <p className={`mt-1 ${text.body}`}>{item.body}</p>
                  {item.link && (
                    <Link href={item.link.href} className="mt-2 inline-block font-medium text-ink underline underline-offset-4">
                      {item.link.label}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className={`mt-8 ${text.body}`}>
          More answers in the{" "}
          <Link href="/support" target="_blank" rel="noopener" className="font-medium text-ink underline underline-offset-4">
            Member Support Hub
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          , or call the front desk on{" "}
          <a href={site.phoneLink} className="font-medium whitespace-nowrap text-ink underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </AccountCard>
    </>
  );
}
