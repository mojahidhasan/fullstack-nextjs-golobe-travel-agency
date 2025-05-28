import { cn } from "@/lib/utils";

import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import calender from "@/public/icons/calender-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";

import plane from "@/public/icons/airplane-filled.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import airlinesLogos from "@/data/airlinesLogos";
import { formatInTimeZone } from "date-fns-tz";
import { cookies } from "next/headers";
import Link from "next/link";
export function FlightBookingDetailsCard({ className, bookingData }) {
  const tz = cookies().get("timeZone")?.value || "UTC";
  const now = Date.now();
  const canCancel = bookingData.bookingStatus !== "canceled";
  const canRefund =
    bookingData.bookingStatus === "canceled" &&
    bookingData.paymentStatus === "paid" &&
    now < new Date(2026);

  const flightData = bookingData.flightSnapshot;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-md sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[200px] items-center gap-4">
          <Image
            className="h-16 w-16 rounded-lg border border-primary object-contain p-2"
            src={airlinesLogos[flightData.airlineId.iataCode]}
            height={64}
            width={64}
            alt="airline logo"
          />
          <div>
            <p className="text-sm text-muted-foreground">
              {flightData.airlineId.name}
            </p>
            <p className="font-medium">{flightData.airplaneId.model}</p>
          </div>
        </div>
        <div>
          <div className="mb-3 flex justify-end">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-right text-xs font-semibold uppercase",
                bookingData.bookingStatus === "confirmed" &&
                  "bg-green-100 text-green-700",
                bookingData.bookingStatus === "pending" &&
                  "bg-yellow-100 text-yellow-700",
                bookingData.bookingStatus === "canceled" &&
                  "bg-red-100 text-red-700",
              )}
            >
              {bookingData.bookingStatus}
            </span>
          </div>
          <div>
            <p>
              Flight No:{" "}
              <span className="font-semibold">{flightData.flightNumber}</span>
            </p>
            <p>
              PNR:{" "}
              <span className="font-semibold">{bookingData.bookingRef}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-col font-semibold">
          <span>
            {formatInTimeZone(+flightData.departure.scheduled, tz, "HH:mm")}
          </span>{" "}
          <span>
            {formatInTimeZone(
              +flightData.departure.scheduled,
              tz,
              "d MMMM yyyy",
            )}
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">
            {flightData.departure.airport.name} (
            {flightData.departure.airport.iataCode})
          </span>
        </div>
        <div className="flex grow items-center justify-center gap-4 max-md:flex-col">
          <Image
            src={lineLeft}
            width={36}
            height={36}
            className="min-h-[36px] min-w-[36px] max-md:rotate-90"
            alt="lineleft_icon"
          />
          <Image
            src={plane}
            alt="plane_icon"
            className="min-h-[48px] min-w-[48px] max-md:rotate-90"
            height={48}
            width={48}
          />
          <Image
            className="min-h-[36px] min-w-[36px] max-md:rotate-90"
            width={36}
            height={36}
            src={lineRight}
            alt="lineright_icon"
          />
        </div>
        <div className="flex flex-col font-semibold">
          <span>
            {formatInTimeZone(+flightData.arrival.scheduled, tz, "HH:mm")}
          </span>{" "}
          <span>
            {formatInTimeZone(+flightData.arrival.scheduled, tz, "d MMMM yyyy")}
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">
            {flightData.arrival.airport.name} (
            {flightData.arrival.airport.iataCode})
          </span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SmallDataCard
          imgSrc={calender}
          title="Date"
          data={formatInTimeZone(
            +flightData.departure.scheduled,
            tz,
            "d MMMM yyyy",
          )}
        />
        <SmallDataCard
          imgSrc={gate}
          title="Gate"
          data={flightData.departure.gate}
        />
        <SmallDataCard
          imgSrc={timer}
          title="Flight time"
          data={formatInTimeZone(+flightData.totalDuration, tz, "HH:mm")}
        />
        <SmallDataCard title="Terminal" data={flightData.departure.terminal} />
      </div>

      <div className="rounded-md bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Passengers
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bookingData.passengers.map((p) => (
            <div
              key={p._id}
              className="min-w-fit grow rounded-md bg-white p-3 shadow-sm"
            >
              <p className="font-medium">{p.firstName + " " + p.lastName}</p>
              <p className="text-sm text-muted-foreground">
                Seat:{" "}
                {
                  bookingData.seats.find((s) => s.reservation.for === p._id)
                    .seatNumber
                }
              </p>
              <p className="text-sm text-muted-foreground">
                Ticket ID: {p._id}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Button will be made functional soon */}
      <div className="mt-4 flex flex-wrap justify-between gap-3">
        <Button className={"min-w-[100px]"} asChild>
          <Link href={`/user/my_bookings/flights/${bookingData.bookingRef}`}>
            View
          </Link>
        </Button>
        {bookingData.bookingStatus === "pending" && (
          <Button className={"min-w-[100px]"} asChild>
            <Link href={`/user/my_bookings/flights/${bookingData.bookingRef}`}>
              Pay
            </Link>
          </Button>
        )}
        {bookingData.bookingStatus === "confirmed" && (
          <Button className="text-wrap">Download Ticket</Button>
        )}
        {canCancel && <Button variant="destructive">Cancel Flight</Button>}

        {canRefund && (
          <Button variant="outline" className="border-green-500 text-green-700">
            Request Refund
          </Button>
        )}
      </div>
    </div>
  );
}
