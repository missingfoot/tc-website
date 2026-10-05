import type { Cta, RoomDetails } from "@/lib/types";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { text } from "@/lib/styles";

type RoomBookingProps = {
  price: string;
  booking: RoomDetails["booking"];
  cta: Cta;
  className?: string;
};

/** Price, move-in details, a membership period picker and the apply button. A white card on desktop. */
export default function RoomBooking({ price, booking, cta, className = "" }: RoomBookingProps) {
  return (
    <div id="booking" className={`lg:rounded-2xl lg:bg-white lg:p-6 lg:shadow-xl lg:shadow-black/10 ${className}`}>
      <p className="text-2xl font-bold text-ink">From {price} per week</p>

      <dl className="mt-5 flex flex-col gap-2 text-base">
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Move in</dt>
          <dd className="text-ink">{booking.moveIn}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Floor</dt>
          <dd className="text-ink">{booking.floor}</dd>
        </div>
      </dl>

      {/* A plain GET form: the chosen period goes to the application as ?period=… */}
      <form action={cta.href}>
        <label htmlFor="membership-period" className={`mt-6 block ${text.label}`}>
          Select membership period
        </label>
        <Select id="membership-period" name="period" options={booking.periods} className="mt-2" />

        <Button type="submit" variant="dark" className="mt-6 w-full justify-center">
          {cta.label}
        </Button>
      </form>
    </div>
  );
}
