import Image from "next/image";
import type { ApplicationRoom } from "@/lib/application";
import { formatMoney, roomCosts } from "@/lib/application";
import { Details, InfoTip } from "./fields";

/** The room being applied for and what's paid today: the sticky card beside the steps, or the mobile "Show info" page (`fullScreen`). */
export default function ApplicationSummary({ room, fullScreen = false }: { room: ApplicationRoom; fullScreen?: boolean }) {
  const costs = roomCosts(room.weeklyPrice);
  return (
    <div className={fullScreen ? "bg-white" : "overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10"}>
      <div className="relative aspect-[19/11] bg-ink/10">
        <Image src={room.photo.src} alt={room.photo.alt} fill sizes={fullScreen ? "(min-resolution: 2dppx) 100vw, 200vw" : "(min-resolution: 2dppx) 24rem, 48rem"} quality={90} className="object-cover" />
      </div>

      <div className="divide-y divide-ink/10 px-6 pb-6 lg:px-8">
        <div className="py-6">
          <h2 className="text-2xl font-bold leading-heading text-ink">{room.name}</h2>
          <div className="mt-4">
            <Details
              split
              rows={[
                ["Location", room.location],
                ["Floor", room.floor],
                [
                  <>
                    Licence fee
                    <InfoTip label="the licence fee">Your monthly bill: rent plus everything that’s included.</InfoTip>
                  </>,
                  `${formatMoney(costs.monthly)} pm (${formatMoney(costs.weekly)} pw)`,
                ],
              ]}
            />
          </div>
        </div>

        <div className="py-6">
          <h3 className="font-bold text-ink">Dates</h3>
          <div className="mt-3">
            <Details split rows={[["Move in", room.moveIn], ["Membership", room.period]]} />
          </div>
        </div>

        <div className="py-6">
          <h3 className="font-bold text-ink">To apply for this room you’ll pay</h3>
          <div className="mt-3">
            <Details
              split
              rows={[
                [
                  <>
                    Holding deposit
                    <InfoTip label="the holding deposit">One week’s licence fee. It becomes part of your security bond.</InfoTip>
                  </>,
                  formatMoney(costs.holdingDeposit),
                ],
                [
                  <>
                    Joining fee
                    <InfoTip label="the joining fee">A one-off membership fee, paid once when you join.</InfoTip>
                  </>,
                  formatMoney(costs.joiningFee),
                ],
              ]}
            />
          </div>
        </div>

        <p className="flex items-baseline justify-between gap-4 pt-6 text-2xl font-bold text-ink">
          <span>Total today</span>
          <span>{formatMoney(costs.dueToday, true)}</span>
        </p>
      </div>
    </div>
  );
}
